import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pyae Thi La — Equipment Technician",
  description: "Equipment operations, reliability, and technical discipline in Singapore.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
