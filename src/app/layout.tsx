import type { Metadata } from "next";
import { Georama } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const georama = Georama({
  variable: "--font-georama",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PerfectPair - Find Your Perfect Match",
  description: "Premium matchmaking service to help you find your life partner. Join thousands of couples who found love through PerfectPair.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${georama.variable} antialiased`}
        style={{ fontFamily: "'Georama', sans-serif" }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
