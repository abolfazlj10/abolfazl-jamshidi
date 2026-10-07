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
  title: 'پروژه‌ها · ابوالفضل جمشیدی',
  description: 'پروژه‌های ابوالفضل جمشیدی، همراه با لینک اجرا و کد منبع.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>{children}</body>
    </html>
  );
}
