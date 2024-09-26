import { create } from "zustand";

type FinanceNewsFilterState = {
    newsName: string;
    newsRating: number;
    newsDate: Date;
    setNewsName: (name: string) => void;
    setNewsRating: (rating: number) => void;
    setNewsDate: (date: string) => void;
    resetFilters: () => void;
}

export const useFinanceNewsFilterStore = create<FinanceNewsFilterState>((set) => ({
    newsName: '',
    newsRating: 5,
    newsDate: new Date(),
    setNewsName: (name: string) => set({ newsName: name }),
    setNewsRating: (rating: number) => set({ newsRating: rating }),
    setNewsDate: (date: string) => set({ newsDate: new Date(date) }),
    resetFilters: () => set({ newsName: '', newsRating: 0, newsDate: new Date() }),
}))