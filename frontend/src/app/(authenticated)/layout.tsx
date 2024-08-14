"use client";

import DashBoardNavBar from "@/components/layout/DashBoardNavBar";
import NavBar from "@/components/layout/NavBar";
import { ReactNode } from "react";

function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <DashBoardNavBar />
      <div className="flex-grow">{children}</div>
    </>
  );
}

export default AuthenticatedLayout;