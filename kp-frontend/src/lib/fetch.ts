import { CartContent, Globals, User } from "@/types/strapi";
import { api } from "@/utils/api";
import nextAuthOptions from "./auth/next-auth-options";
import { getServerSession } from "next-auth";
import axios from "axios";
import { CartItem } from "@/store/cart";

let globalsData: Globals | null = null;
export const useGlobals = async () => {
  if (!globalsData) {
    const res = await api.get(
      "/global?populate=logo&populate=navigation&populate=navigation.items&populate=mobileNavigation&populate=headerButton&populate=footerLinks&populate=product&populate=product.sizeChart"
    );
    if (res.success) {
      globalsData = res.data as Globals;
    }
  }
  if (!globalsData) throw "Internal Server Error";
  return globalsData;
};

export const getUser = async (): Promise<User | null> => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) return null;
  const res = await api.get<User>("/users/me", {}, session?.jwt || "");

  if (res.success) {
    if (res.data.blocked || !res.data.confirmed) return null;
    return res.data;
  }
  return null;
};

export const getCart = async (raw: CartItem[]): Promise<CartContent | null> => {
  if (!raw || raw.length === 0) return [];
  try {
    const res = await axios.post<CartContent>("/api/cart", raw);
    return res.data || null;
  } catch (_) {
    return null;
  }
};
