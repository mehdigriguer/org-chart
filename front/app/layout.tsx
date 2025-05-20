// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { Plus_Jakarta_Sans as plusJakartaSans } from "next/font/google";

const plusJakarta = plusJakartaSans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={plusJakarta.className}>
      <head>
        <title>Org Chart Demo</title>
      </head>
      <body className="relative overflow-hidden">
        <div
          className="
            fixed inset-0
            -z-5
            bg-gradient-to-br
            from-cyan-100
            via-blue-50
            to-sky-100
          "
        />
        {children}
      </body>
    </html>
  );
}
