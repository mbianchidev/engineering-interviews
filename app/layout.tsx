import type { Metadata } from "next";
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/space-grotesk';
import "./globals.css";
import SiteHeader from './components/SiteHeader';

export const metadata: Metadata = {
  title: "Engineering Interview Practice",
  description: "Practice engineering interviews with questions on software, coding, platforms, SRE, and observability. Think through your answers, one question at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SiteHeader />
        <main id="main-content" className="main-content" tabIndex={-1}>{children}</main>
        <footer className="site-footer page-width">
          <p>Question-first. No answer keys. Just your reasoning.</p>
          <a href="https://github.com/mbianchidev/engineering-interviews">View on GitHub</a>
        </footer>
      </body>
    </html>
  );
}
