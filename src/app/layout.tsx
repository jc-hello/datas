import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Crypto Correlation Terminal",
  description: "Multi-exchange crypto correlation dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="font-mono antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
