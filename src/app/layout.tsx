import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OceanSite 海洋信息展示",
    template: "%s | OceanSite",
  },
  description: "海洋主题应用：实时洋流、物种检索、珊瑚健康指数",
  metadataBase: new URL("https://oceansite.example.com"),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "OceanSite 海洋信息展示",
    description: "实时洋流、物种检索、珊瑚健康指数",
    type: "website",
    url: "https://oceansite.example.com",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "OceanSite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OceanSite 海洋信息展示",
    description: "实时洋流、物种检索、珊瑚健康指数",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased ocean-bg bg-slate-950 text-slate-100`}>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
