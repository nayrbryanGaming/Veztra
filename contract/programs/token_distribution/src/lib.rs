use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

declare_id!("GarNqFaBLcyhb3knGu7s9qkESPJvVD7wHKDakWbCWiVC");

#[program]
pub mod token_distribution {
    use super::*;

    pub fn create_stream(
        ctx: Context<CreateStream>,
        amount: u64,
        start_time: i64,
        end_time: i64,
        cliff_time: Option<i64>,
        vesting_type: VestingType,
    ) -> Result<()> {
        require!(amount > 0, VeztraError::InvalidAmount);
        require!(end_time > start_time, VeztraError::InvalidTimeRange);
        if let Some(cliff) = cliff_time {
            require!(
                cliff >= start_time && cliff <= end_time,
                VeztraError::InvalidCliffTime
            );
        }

        let stream = &mut ctx.accounts.stream;
        stream.creator = ctx.accounts.creator.key();
        stream.recipient = ctx.accounts.recipient.key();
        stream.mint = ctx.accounts.mint.key();
        stream.vault = ctx.accounts.vault.key();
        stream.amount = amount;
        stream.claimed_amount = 0;
        stream.start_time = start_time;
        stream.end_time = end_time;
        stream.cliff_time = cliff_time;
        stream.vesting_type = vesting_type;
        stream.status = StreamStatus::Active;
        stream.bump = ctx.bumps.stream;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.creator_token_account.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.creator.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, amount)?;

        emit!(StreamCreated {
            stream: stream.key(),
            creator: stream.creator,
            recipient: stream.recipient,
            amount,
            start_time,
            end_time,
        });

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let clock = Clock::get()?;
        let now = clock.unix_timestamp;

        // Phase 1: validate and compute (immutable borrow, dropped at end of block)
        let (creator_key, recipient_key, mint_key, bump, claimable, new_claimed, completed) = {
            let stream = &ctx.accounts.stream;
            require!(
                stream.status == StreamStatus::Active,
                VeztraError::StreamNotActive
            );
            if let Some(cliff) = stream.cliff_time {
                require!(now >= cliff, VeztraError::CliffNotReached);
            }
            let vested = calculate_vested(stream, now);
            let claimable = vested.saturating_sub(stream.claimed_amount);
            require!(claimable > 0, VeztraError::NothingToWithdraw);
            let new_claimed = stream.claimed_amount.checked_add(claimable).unwrap();
            let completed = new_claimed >= stream.amount;
            (
                stream.creator,
                stream.recipient,
                stream.mint,
                stream.bump,
                claimable,
                new_claimed,
                completed,
            )
        };

        // Phase 2: CPI transfer from vault to recipient
        let seeds: &[&[&[u8]]] = &[&[
            b"stream",
            creator_key.as_ref(),
            recipient_key.as_ref(),
            mint_key.as_ref(),
            &[bump],
        ]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.recipient_token_account.to_account_info(),
                    authority: ctx.accounts.stream.to_account_info(),
                },
                seeds,
            ),
            claimable,
        )?;

        // Phase 3: update state
        let stream = &mut ctx.accounts.stream;
        stream.claimed_amount = new_claimed;
        if completed {
            stream.status = StreamStatus::Completed;
        }

        emit!(Withdrawn {
            stream: ctx.accounts.stream.key(),
            recipient: ctx.accounts.recipient.key(),
            amount: claimable,
        });

        Ok(())
    }

    pub fn cancel_stream(ctx: Context<CancelStream>) -> Result<()> {
        let clock = Clock::get()?;
        let now = clock.unix_timestamp;

        // Phase 1: validate and compute (immutable borrow)
        let (creator_key, recipient_key, mint_key, bump, unclaimed_vested, unvested) = {
            let stream = &ctx.accounts.stream;
            require!(
                stream.status == StreamStatus::Active,
                VeztraError::StreamNotActive
            );
            let vested = calculate_vested(stream, now);
            let unclaimed_vested = vested.saturating_sub(stream.claimed_amount);
            let unvested = stream.amount.saturating_sub(vested);
            (
                stream.creator,
                stream.recipient,
                stream.mint,
                stream.bump,
                unclaimed_vested,
                unvested,
            )
        };

        let seeds: &[&[&[u8]]] = &[&[
            b"stream",
            creator_key.as_ref(),
            recipient_key.as_ref(),
            mint_key.as_ref(),
            &[bump],
        ]];

        // Phase 2: send vested but unclaimed tokens to recipient
        if unclaimed_vested > 0 {
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.recipient_token_account.to_account_info(),
                        authority: ctx.accounts.stream.to_account_info(),
                    },
                    seeds,
                ),
                unclaimed_vested,
            )?;
        }

        // Return unvested tokens to creator
        if unvested > 0 {
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.creator_token_account.to_account_info(),
                        authority: ctx.accounts.stream.to_account_info(),
                    },
                    seeds,
                ),
                unvested,
            )?;
        }

        // Phase 3: update state
        ctx.accounts.stream.status = StreamStatus::Cancelled;

        emit!(StreamCancelled {
            stream: ctx.accounts.stream.key(),
            creator: ctx.accounts.creator.key(),
            unvested_returned: unvested,
        });

        Ok(())
    }
}

fn calculate_vested(stream: &StreamAccount, now: i64) -> u64 {
    if now <= stream.start_time {
        return 0;
    }
    if now >= stream.end_time {
        return stream.amount;
    }
    match stream.vesting_type {
        VestingType::Linear => {
            let elapsed = (now - stream.start_time) as u128;
            let total = (stream.end_time - stream.start_time) as u128;
            ((stream.amount as u128) * elapsed / total) as u64
        }
        VestingType::Cliff => {
            if let Some(cliff) = stream.cliff_time {
                if now >= cliff {
                    stream.amount
                } else {
                    0
                }
            } else {
                stream.amount
            }
        }
    }
}

// ─── Account Structs ───────────────────────────────────────────────────────

#[derive(Accounts)]
#[instruction(amount: u64, start_time: i64, end_time: i64, cliff_time: Option<i64>, vesting_type: VestingType)]
pub struct CreateStream<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    /// CHECK: only used as pubkey reference for PDA seeds — no ownership check needed
    pub recipient: UncheckedAccount<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = creator,
        space = StreamAccount::LEN,
        seeds = [b"stream", creator.key().as_ref(), recipient.key().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub stream: Account<'info, StreamAccount>,

    #[account(
        init,
        payer = creator,
        token::mint = mint,
        token::authority = stream,
        seeds = [b"vault", stream.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = creator,
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"stream", creator.key().as_ref(), recipient.key().as_ref(), mint.key().as_ref()],
        bump = stream.bump,
        has_one = creator,
        has_one = recipient,
        has_one = mint,
    )]
    pub stream: Account<'info, StreamAccount>,

    /// CHECK: validated via has_one on stream
    pub creator: UncheckedAccount<'info>,

    #[account(mut)]
    pub recipient: Signer<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [b"vault", stream.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = stream,
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = recipient,
        associated_token::mint = mint,
        associated_token::authority = recipient,
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelStream<'info> {
    #[account(
        mut,
        seeds = [b"stream", creator.key().as_ref(), recipient.key().as_ref(), mint.key().as_ref()],
        bump = stream.bump,
        has_one = creator,
        has_one = recipient,
        has_one = mint,
    )]
    pub stream: Account<'info, StreamAccount>,

    #[account(mut)]
    pub creator: Signer<'info>,

    /// CHECK: validated via has_one on stream
    pub recipient: UncheckedAccount<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [b"vault", stream.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = stream,
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = creator,
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = recipient,
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

// ─── Data Structures ──────────────────────────────────────────────────────

#[account]
pub struct StreamAccount {
    pub creator: Pubkey,            // 32
    pub recipient: Pubkey,          // 32
    pub mint: Pubkey,               // 32
    pub vault: Pubkey,              // 32
    pub amount: u64,                // 8
    pub claimed_amount: u64,        // 8
    pub start_time: i64,            // 8
    pub end_time: i64,              // 8
    pub cliff_time: Option<i64>,    // 9
    pub vesting_type: VestingType,  // 1
    pub status: StreamStatus,       // 1
    pub bump: u8,                   // 1
                                    // padding: 64
}

impl StreamAccount {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 9 + 1 + 1 + 1 + 64;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VestingType {
    Linear,
    Cliff,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum StreamStatus {
    Active,
    Completed,
    Cancelled,
}

// ─── Events ───────────────────────────────────────────────────────────────

#[event]
pub struct StreamCreated {
    pub stream: Pubkey,
    pub creator: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub start_time: i64,
    pub end_time: i64,
}

#[event]
pub struct Withdrawn {
    pub stream: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
}

#[event]
pub struct StreamCancelled {
    pub stream: Pubkey,
    pub creator: Pubkey,
    pub unvested_returned: u64,
}

// ─── Errors ───────────────────────────────────────────────────────────────

#[error_code]
pub enum VeztraError {
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("End time must be after start time")]
    InvalidTimeRange,
    #[msg("Cliff time must be between start and end time")]
    InvalidCliffTime,
    #[msg("Stream is not active")]
    StreamNotActive,
    #[msg("Cliff period not reached yet")]
    CliffNotReached,
    #[msg("Nothing to withdraw at this time")]
    NothingToWithdraw,
}
