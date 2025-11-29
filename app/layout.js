import './globals.css';

export const metadata = {
  title: 'Suporte Fácil | Sistema SaaS Moderno (Com Conclusão)',
  description: 'Sistema de suporte técnico com chat e conclusão de chamado.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body>
        {children}
      </body>
    </html>
  );
}