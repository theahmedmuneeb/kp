import { create } from "zustand";

type GeneralStore = {
  // Nav Menu
  mobileNavigationMenuOpen: boolean;
  setMobileNavigationMenuOpen: (open: boolean) => void;
};

export const useGeneralStore = create<GeneralStore>()((set) => ({
  // Nav Menu
  mobileNavigationMenuOpen: false,
  setMobileNavigationMenuOpen: (open) =>
    set(() => ({
      mobileNavigationMenuOpen: open,
    })),
}));
