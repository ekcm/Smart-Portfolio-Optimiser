"use client";


import DashBoardNavBar from "@/components/layout/DashBoardNavBar";
import { ReactNode } from "react";

function DashBoardLayout({ children }: { children: ReactNode }) {
  return (
    <>
        <DashBoardNavBar />
        <div className="flex-grow">{children}</div>
    </>
  );
}

export default DashBoardLayout;