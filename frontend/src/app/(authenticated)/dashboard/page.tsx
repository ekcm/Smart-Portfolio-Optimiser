"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../store/DashBoardNavBarState";

export default function DashBoard() {
  const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  
  useEffect(() => {
    setDashBoardNavBarState("Main");
  }, []); 

  return (
    <main 
      // className="flex min-h-screen flex-col items-center justify-between p-24"
    >
      <h1>Dashboard</h1>
    </main>
);
}
