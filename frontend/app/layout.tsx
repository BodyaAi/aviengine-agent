import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "AviEngine — Enterprise автопилот Авито",
  description: "Премиальная платформа для публикации, обновления и уникализации объявлений Авито через официальные API.",
  metadataBase: new URL("https://aviengine.local")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} min-h-screen bg-ink-950 font-sans text-white antialiased`}>{children}</body>
    </html>
  );
}
