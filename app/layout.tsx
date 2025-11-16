import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Engineering Interview Practice",
  description: "Practice technical interview questions across DevOps, Backend, Frontend, and more engineering topics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
