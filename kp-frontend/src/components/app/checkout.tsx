"use client";
import React, { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { CartContent } from "@/types/strapi";
import { getCart } from "@/lib/fetch";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useCheckoutStore } from "@/store/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form";
import isObjectsEqual from "fast-deep-equal";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckoutForm = {
  email: string;
  name: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
};

export default function Checkout() {
  const [loading, setLoading] = useState(true);
  const [cartContent, setCartContent] = useState<CartContent>([]);
  const [deliveryCharges, setDeliveryCharges] = useState<number>(-1);

  const firstRender = useRef(true);

  const { cart, setCart } = useCartStore();
  const { intent, setIntent } = useCheckoutStore();

  const router = useRouter();

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  const loadCart = async () => {
    setLoading(true);
    const cartData = await getCart(cart, intent?.id || "");
    if (!cartData.cart || !Array.isArray(cartData.cart)) {
      toast.error("Something went wrong. Please try again.");
      router.replace("/");
      return;
    }

    setCartContent(cartData.cart);
    setIntent(cartData.intent);
    setDeliveryCharges(cartData.deliveryCharges);

    // Sync cart if there are any changes
    if (cartData.cart) {
      const newCart = cartData.cart?.map((item) => ({
        id: item.id,
        size: item.size.id,
        quantity: item.quantity,
      }));

      if (newCart && !isObjectsEqual(newCart, cart)) {
        setCart(newCart);
        toast.info(
          "Your cart has been updated to reflect the latest changes in availability."
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (cart && cart.length > 0) {
      loadCart();
    } else {
      router.push("/");
    }
  }, [cart]);

  return (
    <>
      <div className="basis-[55%]">
        {intent && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: intent?.clientSecret,
              paymentMethodCreation: "manual",
              appearance: {
                theme: "flat",
                variables: {
                  borderRadius: "0px",
                  colorPrimary: "#6A341A",
                  colorBackground: "#E4E4E4",
                  colorDanger: "#e7000b",
                  fontFamily: '"Montserrat", sans-serif',
                },
                rules: {
                  ".Block": {
                    color: "#000000",
                    backgroundColor: "#E4E4E4",
                    boxShadow: "none",
                  },
                  ".AccordionItem": {
                    backgroundColor: "#E4E4E4",
                    fontSize: "18px",
                    color: "#6A341A !important",
                    paddingLeft: "0",
                    paddingRight: "0",
                  },
                  ".Input": {
                    boxShadow: "none",
                    border: "3px solid #F2763A",
                    fontWeight: "600",
                    color: "#6A341A",
                    padding: "12px",
                  },
                  ".Input::placeholder": {
                    color: "#6a7282",
                  },
                  ".Input:focus": {
                    borderColor: "#F2763A",
                    boxShadow: "none",
                  },
                  ".Input--invalid": {
                    borderColor: "#e7000b",
                    boxShadow: "none",
                    outline: "none",
                  },
                  ".Label": {
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#6A341A",
                    marginBottom: "4px",
                  },
                },
              },
              fonts: [
                {
                  cssSrc:
                    "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap",
                },
              ],
            }}
          >
            <CheckoutForm
              loading={loading}
              cartContent={cartContent}
              deliveryCharges={deliveryCharges}
            />
          </Elements>
        )}
        <div
          className={`h-full flex-row justify-center items-center gap-4 p-10 ${
            loading ? "flex" : "hidden"
          }`}
        >
          <span>
            <Loader2 className="animate-spin" />
          </span>
          Loading...
        </div>
      </div>
      <Separator orientation="vertical" className="!w-0.5 bg-primary !h-auto" />
      <div className="basis-[45%]">
        {loading ? (
          <div className="lg:flex flex-col gap-4 px-5 lg:p-10 hidden">
            <div className="flex flex-row gap-5">
              <Skeleton className="size-16" />
              <div className="flex-1 flex flex-col justify-center gap-1.5">
                <div className="flex flex-row justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-row justify-between items-center"
              >
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <div className="flex flex-row justify-between items-center">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        ) : (
          <OrderSummary
            cartContent={cartContent}
            deliveryCharges={deliveryCharges}
            className="hidden lg:flex"
            state={true}
          />
        )}
      </div>
    </>
  );
}

export const OrderSummary = ({
  cartContent,
  deliveryCharges = 0,
  className,
  state,
}: {
  cartContent: CartContent;
  deliveryCharges: number;
  className?: string;
  state?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn("flex flex-col gap-6 px-5 lg:p-10 uppercase", className)}
    >
      {typeof state !== "boolean" && (
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">Order Summary</span>
          <button
            onClick={() => {
              setOpen(!open);
            }}
            className="flex items-center font-montserrat font-semibold uppercase text-sm cursor-pointer"
            type="button"
          >
            {open ? (
              <>
                hide <ChevronUp className="ml-1" size={18} />
              </>
            ) : (
              <>
                show <ChevronDown className="ml-1" size={18} />
              </>
            )}
          </button>
        </div>
      )}
      {(state || open) && (
        <div className="flex flex-col gap-3">
          {cartContent.map((item) => (
            <div
              className="flex flex-row gap-4 lg:gap-5"
              key={`${item.id}-${item.size.id}`}
            >
              <div className="size-16">
                <AspectRatio ratio={1}>
                  <Image
                    fill
                    src={item.image.url}
                    alt={item.title}
                    className="object-cover"
                  />
                  <Badge className="text-xs font-montserrat bg-[#3288C3] rounded-full absolute top-0 right-0 translate-x-1/4 -translate-y-1/4">
                    {item.quantity}
                  </Badge>
                </AspectRatio>
              </div>
              <div className="flex-1 grid grid-cols-4">
                <div className="col-span-3 flex flex-col gap-1.5 justify-center flex-1 font-montserrat font-semibold">
                  <div
                    className="text-sm leading-3.5 break-all overflow-hidden text-ellipsis"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.title}
                  </div>
                  <div className="text-sm  text-gray-500">
                    {item.size.title}
                  </div>
                </div>
                <span className="text-sm font-semibold leading-4 break-all ml-auto">
                  ${item.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Bill info */}
      <div className="flex flex-col gap-2">
        {/* Subtotal */}
        <div className="flex flex-row justify-between items-center font-semibold">
          <span>Subtotal · {cartContent.length} items</span>
          <span>
            ${cartContent.reduce((acc, item) => acc + item.total, 0).toFixed(2)}
          </span>
        </div>
        {/* Shipping */}
        <div className="flex flex-row justify-between items-center font-semibold">
          <span>Shipping</span>
          <span>${deliveryCharges.toFixed(2)}</span>
        </div>
      </div>
      {/* Total */}
      <div className="flex flex-row justify-between items-center font-bold text-lg">
        <span>Total</span>
        <span>
          $
          {(
            cartContent.reduce((acc, item) => acc + item.total, 0) +
            (deliveryCharges < 0 ? 0 : deliveryCharges)
          ).toFixed(2)}
        </span>
      </div>
    </div>
  );
};
