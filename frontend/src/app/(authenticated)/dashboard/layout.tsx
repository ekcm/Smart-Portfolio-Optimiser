"use client";

import { ReactNode } from "react";

function DashBoardLayout({ children }: { children: ReactNode }) {
  return (
    <>
        <div className="flex-grow">{children}</div>
    </>
  );
}

export default DashBoardLayout;