import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  size: number;
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, size: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find(
            (p) => p.id === item.id && p.size === item.size
          );
          let newCart;
          if (existing) {
            newCart = state.cart.map((p) =>
              p.id === item.id && p.size === item.size ? item : p
            );
          } else {
            newCart = [...state.cart, item];
          }
          return { cart: newCart };
        }),

      removeFromCart: (id, size) =>
        set((state) => ({
          cart: state.cart.filter((p) => !(p.id === id && p.size === size)),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "kp-cart",
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "kp-cart" && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed?.state) {
          useCartStore.setState(parsed.state);
        }
      } catch (err) {
        console.error("Failed to sync cart across tabs:", err);
      }
    }
  });
}
