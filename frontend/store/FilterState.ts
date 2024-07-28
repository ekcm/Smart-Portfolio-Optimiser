import { create } from "zustand";

type FilterState = {
    portfolioName: string;
    riskAppetite: "No Filter" | "Low" | "Medium" | "High";
    triggeredAlerts: boolean;
    setPortfolioName: (name: string) => void;
    setRiskAppetite: (state: "No Filter" | "Low" | "Medium" | "High") => void;
    setTriggeredAlerts: (state: boolean) => void;
    resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    portfolioName: '',
    riskAppetite: "No Filter",
    triggeredAlerts: false,
    setPortfolioName: (name) => set({ portfolioName: name }),
    setRiskAppetite: (state) => set({ riskAppetite: state }),
    setTriggeredAlerts: (state) => set({ triggeredAlerts: state }),
    resetFilters: () => set({ portfolioName: '', riskAppetite: 'No Filter', triggeredAlerts: false }),
}))