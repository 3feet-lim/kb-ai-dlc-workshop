import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Table Order Admin",
  description: "매장 관리자 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
