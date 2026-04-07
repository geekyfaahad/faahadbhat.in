import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Faahad Bhat (Geeky Faahad) - Full Stack Developer",
  description:
    "Full Stack Developer specializing in Python (Flask, Django) and JavaScript (React).",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
