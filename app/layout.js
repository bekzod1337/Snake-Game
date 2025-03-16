import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Montserrat({
  weight: ["400", "700"],
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  weight: ["400", "700"],
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Snake Game",
  description: "Created by Bekzod",
  icons: "/favico.png",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
