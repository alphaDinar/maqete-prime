import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WishListContextProvider } from "./contexts/wishListContext";
import { CartContextProvider } from "./contexts/cartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maqete",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartContextProvider>
          <WishListContextProvider>
            {children}
          </WishListContextProvider>
        </CartContextProvider>
      </body>
    </html>
  );
}
