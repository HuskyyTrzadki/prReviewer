import type { Metadata } from "next";
import { Inter, PT_Serif } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";

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

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
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
};

export default RootLayout;
