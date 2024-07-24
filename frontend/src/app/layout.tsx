import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ViewTransitions } from "next-view-transitions";
import Providers from "@/utils/providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "@/components/layout/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UBS Portfolio Optimizer",
  description: "Optimize your portfolios with UBS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className="flex flex-col min-h-screen">
        <body className={inter.className}>
          <main className="">
            <Providers>
              {children}
            </Providers>
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              limit={5}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              theme="colored"
              />
          </main>
        </body>
      </html>
    </ViewTransitions>
  );
}
