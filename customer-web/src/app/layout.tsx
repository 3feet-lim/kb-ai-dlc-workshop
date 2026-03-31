import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";

export const metadata: Metadata = {
  title: "테이블오더",
  description: "테이블에서 간편하게 주문하세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 max-w-lg mx-auto min-h-screen">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
