import { create } from "zustand";

type DashBoardNavBarState = {
    mainState: "Main" | "Empty" | "Portfolio" | "Rulelogger";
    setMainState: (state: "Main" | "Empty" | "Portfolio" | "Rulelogger") => void;
}

export const useDashBoardNavBarStore = create<DashBoardNavBarState>((set) => ({
    mainState: "Main",
    setMainState: (state) => set({ mainState: state }),
}))