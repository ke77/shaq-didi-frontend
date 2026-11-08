import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#e53935',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'ShaQ DIDI - Sign Up',
  description: 'ShaQ DIDI sign up and onboarding portal for Permanent Staff and National Service Personnel with food order dispatch coordination.',
  openGraph: {
    title: 'ShaQ DIDI - Sign Up',
    description: 'ShaQ DIDI sign up and onboarding portal for Permanent Staff and National Service Personnel with food order dispatch coordination.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ShaQ DIDI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="bg-slate-900/95 min-h-screen text-slate-800 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
