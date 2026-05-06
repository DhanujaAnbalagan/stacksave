import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StackSave — AI Spend Optimization for Engineering Teams",
  description:
    "StackSave helps startups and engineering teams audit their AI tool subscriptions, identify overspending, and discover smarter, cheaper alternatives — all in minutes.",
  keywords: [
    "AI spend optimization",
    "ChatGPT cost",
    "GitHub Copilot",
    "AI subscription audit",
    "startup tools",
  ],
  openGraph: {
    title: "StackSave — AI Spend Optimization",
    description:
      "Cut your AI tool costs without cutting capability. Run a free spend audit today.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

