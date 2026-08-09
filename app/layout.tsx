import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClearRead — Accessible Reading, Instantly",
  description:
    "Turn any dense text, PDF, or article into a simplified, accessible reading experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
