import localFont from 'next/font/local';
import './globals.css';

const vazirmatn = localFont({
  src: [
    { path: './fonts/Vazirmatn-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/Vazirmatn-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
});

export const metadata = {
  title: 'Abolfazl Jamshidi | Web Developer',
  description: 'Brand websites, creative portfolios, and useful tools. Explore the selected web development projects of Abolfazl Jamshidi.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className={vazirmatn.className}>{children}</body>
    </html>
  );
}
