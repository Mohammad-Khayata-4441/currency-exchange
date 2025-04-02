import type { Metadata } from "next";
import { Zain } from "next/font/google";
import "./globals.css";

const almarai = Zain({
  subsets: ["arabic"],
  weight: ["300", "400", "700"],
  variable: "--font-almarai",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${almarai.variable} ${almarai.className}  antialiased`}>
        {children}
      </body>
    </html>
  );
}
