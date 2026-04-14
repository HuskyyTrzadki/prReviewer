import type { Metadata } from "next";
import { Inter, PT_Serif } from "next/font/google";
import "./globals.css";
import Script from "next/dist/client/script";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  display: "swap",
  style: ["normal", "italic"],
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PR Reviewer Photo Aid",
  description: "Repository pull request evaluator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ptSerif.variable} h-full antialiased`}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
            <Script
                src="//unpkg.com/react-grab/dist/index.global.js"
                crossOrigin="anonymous"
                strategy="beforeInteractive"
            />
        )}
      </head>
      <body className="min-h-full bg-white text-navy">{children}</body>
    </html>
  );
}
