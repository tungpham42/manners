import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Đối nhân xử thế - Quản trị",
  description: "Thuật đối nhân xử thế, ứng xử trong cuộc sống",
  openGraph: {
    title: "Đối nhân xử thế - Quản trị",
    description: "Thuật đối nhân xử thế, ứng xử trong cuộc sống",
    url: "https://ungxu.soft.io.vn/quan-tri",
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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
