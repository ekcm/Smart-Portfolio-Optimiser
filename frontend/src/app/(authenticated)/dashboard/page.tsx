"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../../store/DashBoardNavBarState";
import Filter from "@/components/dashboard/Filter";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "../../../../store/FilterState";

export default function DashBoard() {
  const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const handleReset = () => {
    resetFilters();
  }

  useEffect(() => {
    setDashBoardNavBarState("Main");
  }, []);

  return (
    <main 
      className="flex flex-col justify-between pt-6 px-24 gap-6"
    >
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Portfolios under your management</h1>
        <Button variant="ghost" onClick={handleReset}>Reset Filters</Button>
      </div>
      <Filter />
    </main>
);
}
