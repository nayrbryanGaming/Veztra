import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SolanaWalletProvider } from '@/components/wallet/WalletProvider'
import { QueryProvider } from './QueryProvider'
import { Toaster } from 'react-hot-toast'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Vestra — Programmable Token Distribution Infrastructure',
  description: 'Flexible vesting infrastructure, powered onchain. Manage token allocation, milestone unlocks, and treasury distribution with transparency on Solana.',
  openGraph: {
    title: 'Vestra — Programmable Token Distribution',
    description: 'Flexible vesting infrastructure, powered onchain.',
    siteName: 'Vestra',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <QueryProvider>
          <SolanaWalletProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#110E1F',
                  color: '#F8F6FF',
                  border: '1px solid #1E1A35',
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: '14px',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: { primary: '#14F195', secondary: '#03000A' },
                  duration: 4000,
                },
                error: {
                  iconTheme: { primary: '#FF4D4D', secondary: '#03000A' },
                  duration: 6000,
                },
              }}
            />
          </SolanaWalletProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
