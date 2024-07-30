"use client";

import AllNews from "@/components/financenews/AllNews";
import { useDashBoardNavBarStore } from "../../../../store/DashBoardNavBarState";
import { useEffect } from "react";

export default function FinanceNews() {
  const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);

  
  useEffect(() => {
    setDashBoardNavBarState("Main");
  }, []);

  return (
    <main className="flex flex-col justify-between pt-6 px-24 gap-6">
        <h1 className="text-3xl font-bold">Finance News</h1>
        <AllNews />
    </main>
  );
}
