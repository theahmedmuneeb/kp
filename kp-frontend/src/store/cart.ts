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
  setCart: (items: CartItem[]) => void;
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
      setCart: (items) => set({ cart: items }),
    }),
    {
      name: "kp-cart",
    }
  )
);

if (typeof window !== "undefined") {
  let prev = localStorage.getItem("kp-cart");

  const sync = (val: string | null) => {
    if (val && val !== prev) {
      prev = val;
      try {
        const parsed = JSON.parse(val);
        if (parsed?.state) useCartStore.setState(parsed.state);
      } catch { }
    }
  };

  window.addEventListener("storage", (e) => e.key === "kp-cart" && sync(e.newValue));
  setInterval(() => sync(localStorage.getItem("kp-cart")), 1000);
}
