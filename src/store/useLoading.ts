import { create } from "zustand";

interface Loading {
  isLoading: boolean;
  setLoading: (a: boolean) => void;
}

export const useLoading = create<Loading>((set) => ({
  isLoading: false,
  setLoading: (a) => set({ isLoading: a }),
}));
