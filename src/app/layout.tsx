import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Property Intelligence Console',
  description: 'Fetch & explore property management firm data by city.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}