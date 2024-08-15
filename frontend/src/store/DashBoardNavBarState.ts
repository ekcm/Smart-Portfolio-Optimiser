import { create } from "zustand";

type DashBoardNavBarState = {
    mainState: "Main" | "Empty" | "Portfolio";
    setMainState: (state: "Main" | "Empty" | "Portfolio") => void;
}

export const useDashBoardNavBarStore = create<DashBoardNavBarState>((set) => ({
    mainState: "Main",
    setMainState: (state) => set({ mainState: state }),
}))