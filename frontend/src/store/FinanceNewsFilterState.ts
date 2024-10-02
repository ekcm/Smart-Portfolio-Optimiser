import { create } from "zustand";

type FinanceNewsFilterState = {
    newsName: string;
    newsRating: number;
    newsDate: Date | null;
    setNewsName: (name: string) => void;
    setNewsRating: (rating: number) => void;
    setNewsDate: (date: Date | null) => void;
    resetFilters: () => void;
}

export const useFinanceNewsFilterStore = create<FinanceNewsFilterState>((set) => ({
    newsName: '',
    newsRating: 0,
    newsDate: null,  // Set the default value to null
    setNewsName: (name: string) => set({ newsName: name }),
    setNewsRating: (rating: number) => set({ newsRating: rating }),
    setNewsDate: (date: Date | null) => set({ newsDate: date }),
    resetFilters: () => set({ newsName: '', newsRating: 0 , newsDate: null }),
}));