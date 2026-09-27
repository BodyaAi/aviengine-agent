import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "./fonts/inter-latin-ext-normal.woff2" },
    { path: "./fonts/inter-cyrillic-normal.woff2" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AviEngine — Enterprise автопилот Авито",
  description: "Премиальная платформа для публикации, обновления и уникализации объявлений Авито через официальные API.",
  metadataBase: new URL("https://aviengine.local")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} min-h-screen bg-ink-950 font-sans text-white antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
