"use client";

import NavBar from "@/components/layout/NavBar";
import { ReactNode } from "react";

function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <div className="flex-grow">{children}</div>
    </>
  );
}

export default AuthenticatedLayout;