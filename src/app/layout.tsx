import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weymouth Dance Festival",
  description: "Searchable Weymouth dance festival programme",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
