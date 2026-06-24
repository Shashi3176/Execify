import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Layout from "@/components/Layout";
import { ToastProvider } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Execify - Process-managed Code Execution",
  description: "Online code execution platform with process management and job queuing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100`}
      >
        <ToastProvider>
          <Layout>{children}</Layout>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
