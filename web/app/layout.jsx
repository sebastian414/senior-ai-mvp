export const metadata = {
  title: "Asistent pre seniorov (MVP)"
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
