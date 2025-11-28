import './globals.css';

export const metadata = {
  title: 'Suporte Fácil - Login',
  description: 'Sistema de suporte técnico',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#fff' }}>
        {children}
      </body>
    </html>
  );
}