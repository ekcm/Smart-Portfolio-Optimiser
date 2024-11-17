"use client";

import { useEffect } from "react";
import { useDashBoardNavBarStore } from "../../../store/DashBoardNavBarState";
import Filter from "@/components/dashboard/Filter";
import { Button } from "@/components/ui/button";
import { useDashboardFilterStore } from "../../../store/DashBoardFilterState";
import Portfolios from "@/components/dashboard/Portfolios";

export default function DashBoard() {
  const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
  const resetFilters = useDashboardFilterStore((state) => state.resetFilters);
  const setPortfolioName = useDashboardFilterStore((state) => state.setPortfolioName);

  const handleReset = () => {
    resetFilters();
  }

  useEffect(() => {
    setDashBoardNavBarState("Main");
    setPortfolioName("");
  });

  return (
    <main 
      className="flex flex-col justify-between pt-6 px-24 gap-6"
    >
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Portfolios under your management</h1>
        <Button variant="ghost" onClick={handleReset}>Reset Filters</Button>
      </div>
      <Filter />
      <Portfolios />
    </main>
);
}
