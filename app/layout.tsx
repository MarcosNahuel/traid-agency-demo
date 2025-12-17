import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Centro de Control - MarIA S.A.",
  description: "CRM Postventa Multi-Canal con IA - Tu aliado gamer desde 2018",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-100">
        {children}
        <Footer />
      </body>
    </html>
  );
}
