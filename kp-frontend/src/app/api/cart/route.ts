import { getUser } from "@/lib/fetch";
import { CartItem } from "@/store/cart";
import { CartItems } from "@/types/strapi";
import { api } from "@/utils/api";
import getWholesalePrice from "@/utils/get-wholesale-price";
import { NextResponse } from "next/server";

import {
  array,
  gtValue,
  integer,
  minLength,
  number,
  object,
  pipe,
  parse,
  ltValue,
} from "valibot";

const cartSchema = pipe(
  array(
    object({
      id: pipe(number(), integer(), gtValue(0)),
      size: pipe(number(), integer(), gtValue(0)),
      quantity: pipe(number(), integer(), gtValue(0), ltValue(10000)),
    })
  ),
  minLength(1)
);

export const POST = async (req: Request) => {
  const body = (await req.json()) as CartItem[];
  parse(cartSchema, body);

  const user = await getUser();
  let wholesale = false;
  if (user && !user.blocked && user.confirmed) {
    wholesale = true;
  }

  const rawCart = body.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i.id === item.id && i.size === item.size)
  );

  const query =
    body.map((item) => `filters[id][$in]=${item.id}`).join("&") +
    "&populate=images&populate=sizes&populate=wholesale&populate=sizes.wholesale";

  const { success, data } = await api.get<CartItems>(`/products?${query}`);

  if (!success || !data || !data.data)
    throw new Error("Failed to fetch products");

  const products = data.data;

  const cart = rawCart
    .map((item) => {
      const product = products.find(
        (p) => item.id === p.id && p.sizes.some((s) => s.id === item.size)
      );
      if (product) {
        const size = product.sizes.find((s) => s.id === item.size);
        if (!size) throw new Error("Size not found");

        const sizePrice = size.price ?? product.price;
        const wholesaleRange =
          size.wholesale && size.wholesale.length > 0
            ? size.wholesale
            : product.wholesale;
        const productPrice = wholesale
          ? getWholesalePrice(wholesaleRange, item.quantity) ?? sizePrice
          : sizePrice;

        return {
          id: product.id,
          title: product.title,
          slug: product.slug,
          image: product.images[0].formats.thumbnail,
          price: productPrice,
          quantity: item.quantity,
          size: {
            id: size.id,
            title: size.title,
          },
          total: productPrice * item.quantity,
        };
      }
    })
    .filter((i) => i);

  return NextResponse.json(cart);
};
