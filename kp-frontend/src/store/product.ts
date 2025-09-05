import { create } from "zustand";

type ProductStore = {
  selectedSize: number;
  setSelectedSize: (size: number) => void;
};

export const useProductStore = create<ProductStore>()((set) => ({
  selectedSize: 0,
  setSelectedSize: (size) => set(() => ({ selectedSize: size })),
}));
