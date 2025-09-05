import { ProductWholesalePrice } from "@/types/strapi";

const getWholesalePrice = (
  range: ProductWholesalePrice[],
  quantity: number
): number | undefined =>
  range?.reduce<ProductWholesalePrice | undefined>(
    (best, r) =>
      r.quantity <= quantity && r.quantity > (best?.quantity ?? 0) ? r : best,
    undefined
  )?.price;

export default getWholesalePrice;
