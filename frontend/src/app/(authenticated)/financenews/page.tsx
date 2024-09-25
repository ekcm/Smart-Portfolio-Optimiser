"use client";

import AllNews from "@/components/financenews/AllNews";
import { useDashBoardNavBarStore } from "../../../store/DashBoardNavBarState";
import { useEffect } from "react";
import FinanceNewsFilter from "@/components/financenews/FinanceNewsFilter";
import { Button } from "@/components/ui/button";
import { useFinanceNewsFilterStore } from "../../../store/FinanceNewsFilterState";

export default function FinanceNews() {
  const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  const resetFilters = useFinanceNewsFilterStore((state) => state.resetFilters);

  const handleReset = () => {
    resetFilters();
  }
  
  useEffect(() => {
    setDashBoardNavBarState("Empty");
  });

  return (
    <main className="flex flex-col justify-between pt-6 px-24 gap-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Finance News</h1>
        <Button variant="ghost" onClick={handleReset}>Reset Filters</Button>
      </div>
        <FinanceNewsFilter />
        <AllNews />
    </main>
  );
}
