import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ViewTransitions } from "next-view-transitions";
import Providers from "@/utils/providers";
import "react-toastify/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";

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
              stacked
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
