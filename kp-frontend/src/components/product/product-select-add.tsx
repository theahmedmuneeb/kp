"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/types/strapi";
import { useCartStore } from "@/store/cart";
import { useProductStore } from "@/store/product";

export default function ProductSelectAdd({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0].id);
  const [quantity, setQuantity] = useState<string>("1");

  const { setSelectedSize: zSetSelectedSize } = useProductStore();

  useEffect(() => {
    zSetSelectedSize(selectedSize);
  }, [selectedSize]);

  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      size: selectedSize,
      quantity: Number(quantity),
    });
  };

  const setProductQuantity = (value: string | number) => {
    setQuantity(
      String(Math.min(9999, Math.max(1, parseInt(String(value), 10) || 1)))
    );
  };
  return (
    <>
      {/* Price */}
      <span className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-semibold mt-2 inline-block">
        $
        {product.sizes.find((size) => size.id === selectedSize)?.price ??
          product.price}
      </span>
      {/* Size selection */}
      <div className="flex flex-wrap gap-3 md:gap-4 mt-4 md:mt-7 select-none">
        {product.sizes &&
          product.sizes.map((size, idx) => (
            <button
              key={idx}
              className={`h-11 w-14  flex justify-center items-center p-2 border-4 border-secondary text-xl  font-bold uppercase cursor-pointer hover:bg-secondary/20 transition duration-100 ${
                size.id === selectedSize ? "!bg-secondary text-accent" : ""
              }`}
              onClick={() => setSelectedSize(size.id)}
            >
              {size.title}
            </button>
          ))}
      </div>
      {/* Add to cart */}
      <div className="flex flex-row mt-7 gap-5">
        <div className="flex flex-row gap-2">
          <Button
            className="border-4 border-secondary h-full size-10 hover:bg-secondary/20"
            variant="ghost"
            size="icon"
            onClick={() => setProductQuantity(Number(quantity) - 1)}
          >
            <Minus strokeWidth={4} />
          </Button>
          <Input
            type="number"
            className="w-16 h-10 p-1 !text-lg font-bold !ring-0 border-4 !border-secondary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onBlur={(e) => setProductQuantity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setProductQuantity(e.currentTarget.value);
              }
            }}
          />
          <Button
            className="border-4 border-secondary size-10 hover:bg-secondary/20"
            variant="ghost"
            size="icon"
            onClick={() => {
              setProductQuantity(Number(quantity) + 1);
            }}
          >
            <Plus strokeWidth={4} />
          </Button>
        </div>
        <Button
          className="text-accent uppercase h-10"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </>
  );
}
