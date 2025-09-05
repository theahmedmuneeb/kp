"use client";
import { Product } from "@/types/strapi";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";
import { ScrollBar } from "../ui/scroll-area";
import { useProductStore } from "@/store/product";

export default function ProductWholesaleRates({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { selectedSize } = useProductStore();

  const size = product.sizes.find((s) => s.id === selectedSize);
  if (!size) throw new Error("Size not found");

  const wholesale =
    size.wholesale && size.wholesale.length > 0
      ? size.wholesale
      : product.wholesale;

  return (
    <div
      className={`flex flex-col items-center md:gap-2 border-3 border-[#3288C3] p-10 lg:px-12 ${className}`}
    >
      <ScrollArea className="w-full">
        <div className="grid grid-cols-[1fr_auto] gap-3 gap-y-2 w-full max-w-2xs mx-auto">
          {[...new Map(wholesale.map((i) => [i.quantity, i])).values()]
            .sort((a, b) => a.quantity - b.quantity)
            .map((i, idx, arr) => {
              const isLast = idx === arr.length - 1;
              const start = i.quantity;
              const end = !isLast ? arr[idx + 1].quantity - 1 : undefined;

              const range = isLast
                ? `${start}+`
                : start === end
                ? `${start}`
                : `${start} ‒ ${end}`;

              return (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-[#3288C3]">
                    <span className="whitespace-nowrap">{range}</span>
                    <div className="flex-grow border-t-2 border-[#3288C3] min-w-6" />
                  </div>
                  <span
                    className={`text-xl lg:text-2xl font-semibold text-[#3288C3] ${
                      idx === arr.length - 1 ? "pb-2" : ""
                    }`}
                  >
                    ${i.price}
                  </span>
                </React.Fragment>
              );
            })}
        </div>
        <ScrollBar scrollBarClassName="bg-[#3288C3]" orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
