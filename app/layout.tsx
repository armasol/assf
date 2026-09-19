import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'tipped — Twitch creator launchpad on Pons',
  description: 'Launch creator-linked tokens on Pons for Twitch communities on Robinhood Chain.',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logotwitch-RVMQJk7F2Shbt9HBAVjuK0wVsmheoL.png',
    shortcut: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logotwitch-RVMQJk7F2Shbt9HBAVjuK0wVsmheoL.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
