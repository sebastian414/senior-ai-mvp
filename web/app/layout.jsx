import "./globals.css";

export const metadata = {
  title: "Zdravio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  );
}