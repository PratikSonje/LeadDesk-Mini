import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "LeadDesk Mini",
    template: "%s | LeadDesk"
  },
  description: "A secure, end-to-end inbound lead management system and digital experience.",
  openGraph: {
    title: "LeadDesk Mini",
    description: "A secure, end-to-end inbound lead management system and digital experience.",
    type: "website",
    locale: "en_US",
    siteName: "LeadDesk",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadDesk Mini",
    description: "A secure, end-to-end inbound lead management system and digital experience.",
  }
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
