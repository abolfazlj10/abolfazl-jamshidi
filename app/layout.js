import { NavigationProvider } from './navigation';
import localFont from 'next/font/local';
import './globals.css';
import { Entrance, Header, PageMotion } from './interactions';
import projects from '../data/projects.json';

const vazirmatn = localFont({
  src: [
    { path: './fonts/Vazirmatn-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/Vazirmatn-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-persian',
});

export const metadata = {
  title: 'Abolfazl Jamshidi | Front-end Developer',
  description: 'Front-end developer in Tehran building product interfaces and interactive brand websites with React, Next.js, and TypeScript. Explore selected projects and professional experience.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" data-scroll-behavior="smooth">
      <body className={vazirmatn.variable}>
        <Entrance />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <NavigationProvider>
          <Header projectCount={projects.length} archiveCount={projects.length} />
          <PageMotion>{children}</PageMotion>
        </NavigationProvider>
      </body>
    </html>
  );
}
