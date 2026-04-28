import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: { default: 'CragLog', template: '%s | CragLog' },
  description: 'Your rock climbing logbook. Log, discover, progress.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CragLog',
    startupImage: [],
  },
  icons: {
    icon: '/api/icon/192',
    apple: '/api/icon/192',
    shortcut: '/api/icon/192',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#6d5035',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#856440',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//tile.openstreetmap.org" />
        <link rel="apple-touch-icon" href="/api/icon/192" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CragLog" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
