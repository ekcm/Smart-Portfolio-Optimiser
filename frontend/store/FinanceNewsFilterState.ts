import { create } from "zustand";

type FinanceNewsFilterState = {
    newsName: string;
    newsSource: string;
    newsDate: string;
    setNewsName: (name: string) => void;
    setNewsSource: (source: string) => void;
    setNewsDate: (date: string) => void;
    resetFilters: () => void;
}

export const useFinanceNewsFilterStore = create<FinanceNewsFilterState>((set) => ({
    newsName: '',
    newsSource: '',
    newsDate: '',
    setNewsName: (name: string) => set({ newsName: name }),
    setNewsSource: (source: string) => set({ newsSource: source }),
    setNewsDate: (date: string) => set({ newsDate: date }),
    resetFilters: () => set({ newsName: '', newsSource: '', newsDate: '' }),
}))