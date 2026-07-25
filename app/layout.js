import './globals.css';

export const metadata = {
  title: 'NjangiGuard',
  description: 'AI-powered mobile money fraud protection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
