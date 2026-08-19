import './globals.css';

export const metadata = {
  title: 'Mini Design Canvas',
  description: 'A simple visual editor for creating and saving graphical compositions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
