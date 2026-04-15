import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "二郎マップ - ラーメン二郎 店舗ガイド",
  description:
    "ラーメン二郎の店舗情報・メニュー・来店フローをまとめたガイドサイト。初めての店舗でも迷わない。",
  openGraph: {
    title: "二郎マップ - ラーメン二郎 店舗ガイド",
    description:
      "ラーメン二郎の店舗情報・メニュー・来店フローをまとめたガイドサイト。",
    type: "website",
    locale: "ja_JP",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f5c518",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
