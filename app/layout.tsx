import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono, Inter, Barlow_Condensed } from 'next/font/google';
import IntroAnimation from '@/components/IntroAnimation';
import ScrollHint from '@/components/ScrollHint';
import AnimatedLineBackground from '@/components/AnimatedLineBackground';
import CursorDepression from '@/components/CursorDepression';
import FullscreenToggle from '@/components/FullscreenToggle';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-condensed',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LSR — Portfolio',
  description: '暗黑极简风格的个人作品集网站',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} ${barlowCondensed.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Serif+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <AnimatedLineBackground />
        </div>
        <IntroAnimation />
        <CursorDepression />
        <ScrollHint />
        <FullscreenToggle />
        <div id="site" style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
