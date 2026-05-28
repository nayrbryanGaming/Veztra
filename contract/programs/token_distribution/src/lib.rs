use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

declare_id!("GarNqFaBLcyhb3knGu7s9qkESPJvVD7wHKDakWbCWiVC");

#[program]
pub mod token_distribution {
    use super::*;

    /// Create a new vesting stream. Locks tokens into a PDA vault.
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
        stream.milestone_unlocked = false;

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
            vesting_type_label: match stream.vesting_type {
                VestingType::Linear => "linear".to_string(),
                VestingType::Cliff => "cliff".to_string(),
                VestingType::Milestone => "milestone".to_string(),
            },
        });

        Ok(())
    }

    /// Withdraw vested tokens. Only the recipient can call this.
    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let clock = Clock::get()?;
        let now = clock.unix_timestamp;

        let (creator_key, recipient_key, mint_key, bump, claimable, new_claimed, completed) = {
            let stream = &ctx.accounts.stream;

            // Check stream status
            match stream.status {
                StreamStatus::Cancelled => return err!(VeztraError::AlreadyCancelled),
                StreamStatus::Completed => return err!(VeztraError::FullyVested),
                StreamStatus::Active => {}
            }

            // Cliff guard
            if let Some(cliff) = stream.cliff_time {
                require!(now >= cliff, VeztraError::CliffNotReached);
            }

            // Milestone guard
            if matches!(stream.vesting_type, VestingType::Milestone) {
                require!(stream.milestone_unlocked, VeztraError::MilestoneNotUnlocked);
            }

            // Stream expiry check
            if now > stream.end_time + 60 * 60 * 24 * 365 {
                // 1-year grace period; flag expired streams
                return err!(VeztraError::StreamExpired);
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

    /// Cancel a stream. Only the creator can call this.
    /// Vested-but-unclaimed tokens go to recipient; unvested tokens return to creator.
    pub fn cancel_stream(ctx: Context<CancelStream>) -> Result<()> {
        let clock = Clock::get()?;
        let now = clock.unix_timestamp;

        let (creator_key, recipient_key, mint_key, bump, unclaimed_vested, unvested) = {
            let stream = &ctx.accounts.stream;

            match stream.status {
                StreamStatus::Cancelled => return err!(VeztraError::AlreadyCancelled),
                StreamStatus::Completed => return err!(VeztraError::FullyVested),
                StreamStatus::Active => {}
            }

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

        ctx.accounts.stream.status = StreamStatus::Cancelled;

        emit!(StreamCancelled {
            stream: ctx.accounts.stream.key(),
            creator: ctx.accounts.creator.key(),
            unvested_returned: unvested,
        });

        Ok(())
    }

    /// Unlock a milestone stream. Only the creator can call this.
    /// Once unlocked, the recipient can withdraw the full amount.
    pub fn unlock_milestone(ctx: Context<UnlockMilestone>) -> Result<()> {
        let stream = &mut ctx.accounts.stream;

        require!(
            matches!(stream.vesting_type, VestingType::Milestone),
            VeztraError::NotMilestoneStream
        );

        match stream.status {
            StreamStatus::Cancelled => return err!(VeztraError::AlreadyCancelled),
            StreamStatus::Completed => return err!(VeztraError::FullyVested),
            StreamStatus::Active => {}
        }

        require!(!stream.milestone_unlocked, VeztraError::MilestoneAlreadyUnlocked);

        stream.milestone_unlocked = true;

        emit!(MilestoneUnlocked {
            stream: stream.key(),
            creator: ctx.accounts.creator.key(),
            recipient: stream.recipient,
        });

        Ok(())
    }
}

// ── Vested amount calculation ─────────────────────────────────────────────

fn calculate_vested(stream: &StreamAccount, now: i64) -> u64 {
    if now <= stream.start_time {
        return 0;
    }
    if now >= stream.end_time {
        return stream.amount;
    }
    match stream.vesting_type {
        VestingType::Linear => {
            // Cliff: no tokens until cliff_time, then linear from start
            if let Some(cliff) = stream.cliff_time {
                if now < cliff {
                    return 0;
                }
            }
            let elapsed = (now - stream.start_time) as u128;
            let total = (stream.end_time - stream.start_time) as u128;
            ((stream.amount as u128) * elapsed / total) as u64
        }
        VestingType::Cliff => {
            // All-or-nothing: nothing until cliff_time, then 100%
            if let Some(cliff) = stream.cliff_time {
                if now >= cliff { stream.amount } else { 0 }
            } else {
                stream.amount
            }
        }
        VestingType::Milestone => {
            // All-or-nothing: nothing until milestone_unlocked
            if stream.milestone_unlocked { stream.amount } else { 0 }
        }
    }
}

// ── Account Contexts ──────────────────────────────────────────────────────

#[derive(Accounts)]
#[instruction(amount: u64, start_time: i64, end_time: i64, cliff_time: Option<i64>, vesting_type: VestingType)]
pub struct CreateStream<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    /// CHECK: only used as pubkey reference for PDA seeds
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

#[derive(Accounts)]
pub struct UnlockMilestone<'info> {
    #[account(
        mut,
        seeds = [b"stream", creator.key().as_ref(), recipient.key().as_ref(), mint.key().as_ref()],
        bump = stream.bump,
        has_one = creator,
    )]
    pub stream: Account<'info, StreamAccount>,

    #[account(mut)]
    pub creator: Signer<'info>,

    /// CHECK: used only for PDA seed — validated via has_one indirectly
    pub recipient: UncheckedAccount<'info>,

    pub mint: Account<'info, Mint>,
}

// ── Data Structures ───────────────────────────────────────────────────────

#[account]
pub struct StreamAccount {
    pub creator: Pubkey,               // 32
    pub recipient: Pubkey,             // 32
    pub mint: Pubkey,                  // 32
    pub vault: Pubkey,                 // 32
    pub amount: u64,                   // 8
    pub claimed_amount: u64,           // 8
    pub start_time: i64,               // 8
    pub end_time: i64,                 // 8
    pub cliff_time: Option<i64>,       // 9
    pub vesting_type: VestingType,     // 1
    pub status: StreamStatus,          // 1
    pub bump: u8,                      // 1
    pub milestone_unlocked: bool,      // 1 (uses 1 byte from previous padding)
                                       // padding: 63
}

impl StreamAccount {
    // 8 discriminator + 32+32+32+32 + 8+8+8+8 + 9 + 1+1+1+1 + 63 padding = 244
    pub const LEN: usize = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 9 + 1 + 1 + 1 + 1 + 63;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum VestingType {
    Linear,
    Cliff,
    Milestone,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum StreamStatus {
    Active,
    Completed,
    Cancelled,
}

// ── Events ────────────────────────────────────────────────────────────────

#[event]
pub struct StreamCreated {
    pub stream: Pubkey,
    pub creator: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub vesting_type_label: String,
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

#[event]
pub struct MilestoneUnlocked {
    pub stream: Pubkey,
    pub creator: Pubkey,
    pub recipient: Pubkey,
}

// ── Errors ────────────────────────────────────────────────────────────────

#[error_code]
pub enum VeztraError {
    // Validation errors
    #[msg("Amount must be greater than zero")]
    InvalidAmount,                      // 6000
    #[msg("End time must be after start time")]
    InvalidTimeRange,                   // 6001
    #[msg("Cliff time must be between start and end times")]
    InvalidCliffTime,                   // 6002

    // Authorization errors
    #[msg("Unauthorized: only the stream creator can perform this action")]
    Unauthorized,                       // 6003

    // Stream state errors
    #[msg("Stream has already been cancelled")]
    AlreadyCancelled,                   // 6004
    #[msg("Stream is fully vested — nothing to cancel or withdraw")]
    FullyVested,                        // 6005
    #[msg("Nothing to withdraw at this time")]
    NothingToWithdraw,                  // 6006
    #[msg("Cliff period has not been reached yet")]
    CliffNotReached,                    // 6007
    #[msg("Stream has expired beyond the grace period")]
    StreamExpired,                      // 6008

    // Milestone errors
    #[msg("This stream is not a milestone-type stream")]
    NotMilestoneStream,                 // 6009
    #[msg("Milestone has already been unlocked")]
    MilestoneAlreadyUnlocked,           // 6010
    #[msg("Milestone has not been unlocked yet — creator must unlock first")]
    MilestoneNotUnlocked,               // 6011
}
