import { create } from "zustand";

type CheckoutStore = {
  intent: {
    id: string;
    clientSecret: string | undefined;
  } | null | undefined;
  setIntent: (intent: { id: string; clientSecret: string | undefined } | null | undefined) => void;
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  intent: null,
  setIntent: (intent) => set({ intent }),
}));