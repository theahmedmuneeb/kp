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
      "/global?populate=logo&populate=navigation&populate=navigation.items&populate=mobileNavigation&populate=headerButton&populate=footerLinks&populate=footerBrands.image&populate=product&populate=product.sizeChart"
    );
    if (res.success) {
      globalsData = res.data as Globals;
    }
  }
  if (!globalsData) throw "Internal Server Error";
  return globalsData;
};

export const getUser = async (req?: Request): Promise<User | null> => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) return null;
  const res = await api.get<User>("/users/me", {}, session?.jwt || "");

  if (res.success) {
    if (res.data.blocked || !res.data.confirmed) return null;
    return res.data;
  }
  return null;
};

export const getCart = async (raw: CartItem[] | undefined, intentId?: string): Promise<{ cart: CartContent | null, intent: Intent, deliveryCharges: number }> => {
  if (!raw || raw.length === 0) return { cart: [], intent: undefined, deliveryCharges: -1 };
  try {
    const res = await axios.post<{ cart: CartContent | null, intent: Intent, deliveryCharges: number }>("/api/cart", {
      cart: raw,
      intentId
    });
    return { cart: res.data.cart, intent: res.data.intent || undefined, deliveryCharges: res.data.deliveryCharges };
  } catch (_) {
    return { cart: null, intent: undefined, deliveryCharges: -1 };
  }
};

export type Intent = {
  id: string;
  clientSecret: string | undefined;
  amount: number
} | undefined;
