import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Đối nhân xử thế",
  description: "Thuật đối nhân xử thế, ứng xử trong cuộc sống",
  openGraph: {
    title: "Đối nhân xử thế",
    description: "Thuật đối nhân xử thế, ứng xử trong cuộc sống",
    url: "https://ungxu.soft.io.vn",
    siteName: "Đối nhân xử thế",
    images: [
      {
        url: "https://ungxu.soft.io.vn/1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Đối nhân xử thế",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
