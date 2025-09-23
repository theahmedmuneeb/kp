import { getUser } from "@/lib/fetch";
import { paymentIntent } from "@/lib/pay/intent";
import { CartItem } from "@/store/cart";
import { CartItems } from "@/types/strapi";
import { api } from "@/utils/api";
import getWholesalePrice from "@/utils/get-wholesale-price";
import { NextResponse } from "next/server";
import { parse, z } from "zod";

export const cartSchema = z.object({
  cart: z
    .array(
      z.object({
        id: z.number().int().gt(0),
        size: z.number().int().gt(0),
        quantity: z.number().int().gt(0).lt(10000),
      })
    )
    .min(1).refine(
      (items) =>
        new Set(items.map((i) => `${i.id}-${i.size}`)).size === items.length,
      { message: "Product–size combination must be unique" }
    ),
  intentId: z.string().optional()
});

export const POST = async (req: Request) => {
  const body = (await req.json()) as z.infer<typeof cartSchema>;
  parse(cartSchema, body);

  const user = await getUser();
  let wholesale = false;
  if (user && !user.blocked && user.confirmed) {
    wholesale = true;
  }

  const rawCart = body.cart.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i.id === item.id && i.size === item.size)
  );

  const query =
    body.cart.map((item) => `filters[id][$in]=${item.id}`).join("&") +
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
        if (!size || size.stock <= 0) return null;

        const sizePrice = size.price ?? product.price;
        const wholesaleRange =
          size.wholesale && size.wholesale.length > 0
            ? size.wholesale
            : product.wholesale;
        const productPrice = wholesale
          ? getWholesalePrice(wholesaleRange, item.quantity) ?? sizePrice
          : sizePrice;
        const quantity = item.quantity > size.stock ? size.stock : item.quantity;

        if (quantity <= 0) return null;

        return {
          id: product.id,
          title: product.title,
          slug: product.slug,
          image: product.images[0].formats.thumbnail,
          price: productPrice,
          quantity: quantity,
          size: {
            id: size.id,
            title: size.title,
          },
          total: productPrice * quantity,
        };
      }
    })
    .filter((i) => i);

  const deliveryCharges = cart.reduce((acc, item) => acc + item!.total, 0) > 200 ? 0 : cart.reduce((acc, item) => acc + item!.quantity, 0) <= 5 ? 12 : 30;

  let intent = null;
  if (typeof body.intentId === "string") {
    intent = await paymentIntent((cart.reduce((acc, item) => acc + item!.total, 0) + deliveryCharges) * 100, body.intentId);
  }

  return NextResponse.json({
    cart,
    ...(intent && {
      intent: {
        clientSecret: intent.client_secret,
        id: intent.id,
        amount: intent.amount
      }
    }),
    deliveryCharges
  });

};
