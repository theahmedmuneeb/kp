"use client";
import React, { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { CartContent } from "@/types/strapi";
import { getCart } from "@/lib/fetch";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Badge } from "../ui/badge";
import CountrySelect from "../ui/country-select";
import RegionSelect from "../ui/region-select";

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
  const [submitting, setSubmitting] = useState(false);
  const [cartContent, setCartContent] = useState<CartContent>([]);

  const firstRender = useRef(true);

  const { cart } = useCartStore();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<CheckoutForm>({
    // resolver: zodResolver(QuoteFormSchema),
  });

  const loadCart = async () => {
    setLoading(true);
    const cartData = await getCart(cart);
    if (!cartData || !Array.isArray(cartData)) {
      toast.error("Something went wrong. Please try again.");
      router.replace("/");
      return;
    }
    setCartContent(cartData);
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
        <form
          className={`flex flex-col gap-3 font-montserrat px-4 md:px-5 lg:px-8 py-6 ${
            loading || submitting ? "pointer-events-none" : ""
          }`}
        >
          {/* name */}
          <div className="flex flex-col gap-0.5">
            <label className="font-semibold" htmlFor="name">
              Name:
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Full Name"
              disabled={loading || submitting}
              className="p-2 outline-0 border-3 border-primary placeholder:text-gray-500 font-semibold w-full"
            />
          </div>
          {/* Email */}
          <div className="flex flex-col gap-0.5">
            <label className="font-semibold" htmlFor="email">
              Email:
            </label>
            <input
              {...register("email")}
              type="text"
              id="email"
              placeholder="Email Address"
              disabled={loading || submitting}
              className="p-2 outline-0 border-3 border-primary placeholder:text-gray-500 font-semibold w-full"
            />
          </div>
          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Country */}
            <div className="flex flex-col gap-0.5">
              <label className="font-semibold" htmlFor="country">
                Country:
              </label>
              <CountrySelect
                onChange={(value) => {
                  setValue("country", value);
                }}
                className="w-full !h-12 focus-visible:ring-0 border-3 border-primary focus-visible:border-primary cursor-pointer font-semibold"
              />
            </div>
            {/* State */}
            <div className="flex flex-col gap-0.5">
              <label className="font-semibold" htmlFor="state">
                State/Province:
              </label>
              <RegionSelect
                countryCode={watch("country")}
                onChange={(value) => {
                  setValue("state", value);
                }}
                className="w-full !h-12 focus-visible:ring-0 border-3 border-primary focus-visible:border-primary cursor-pointer font-semibold"
              />
            </div>
            {/* City */}
            <div className="flex flex-col gap-0.5">
              <label className="font-semibold" htmlFor="city">
                City:
              </label>
              <input
                {...register("city")}
                type="text"
                id="city"
                placeholder="City"
                disabled={loading || submitting}
                className="p-2 outline-0 border-3 border-primary font-semibold placeholder:text-gray-500 w-full"
              />
            </div>
            {/* Zip code */}
            <div className="flex flex-col gap-0.5">
              <label className="font-semibold" htmlFor="zip">
                ZIP/Postal Code:
              </label>
              <input
                {...register("zip")}
                type="text"
                id="zip"
                placeholder="ZIP Code"
                disabled={loading || submitting}
                className="p-2 outline-0 border-3 border-primary font-semibold placeholder:text-gray-500 w-full"
              />
            </div>
            {/* Address */}
            <div className="flex flex-col gap-0.5 col-span-1 md:col-span-2">
              <label className="font-semibold" htmlFor="address">
                Address:
              </label>
              <input
                {...register("address")}
                type="text"
                id="address"
                placeholder="Street Address"
                disabled={loading || submitting}
                className="p-2 outline-0 border-3 border-primary font-semibold placeholder:text-gray-500 w-full"
              />
            </div>
          </div>
          <h2 className="text-xl lg:text-2xl font-semibold font-inter">Payment</h2>
        </form>
      </div>
      <Separator orientation="vertical" className="!w-0.5 bg-primary !h-auto" />
      <div className="basis-[45%]">
        {loading ? (
          <div className="flex flex-col gap-4 lg:p-10">
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
          <div className="flex flex-col gap-6 lg:p-10 uppercase">
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
            {/* Bill info */}
            <div className="flex flex-col gap-2">
              {/* Subtotal */}
              <div className="flex flex-row justify-between items-center font-semibold">
                <span>Subtotal · {cartContent.length} items</span>
                <span>
                  $
                  {cartContent
                    .reduce((acc, item) => acc + item.total, 0)
                    .toFixed(2)}
                </span>
              </div>
              {/* Shipping */}
              <div className="flex flex-row justify-between items-center font-semibold">
                <span>Shipping</span>
                <span>$1.00</span>
              </div>
            </div>
            {/* Total */}
            <div className="flex flex-row justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>
                $
                {(
                  cartContent.reduce((acc, item) => acc + item.total, 0) + 1
                ).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
