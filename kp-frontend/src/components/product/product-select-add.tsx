"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Minus, Plus } from "lucide-react";
import { Product } from "@/types/strapi";
import { useCartStore } from "@/store/cart";
import { useProductStore } from "@/store/product";
import axios from "axios";
import { toast } from "sonner";

export default function ProductSelectAdd({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<number>(
    product.sizes.find((size) => size.stock > 0)?.id || -1
  );
  const [quantity, setQuantity] = useState<string>("1");
  const [adding, setAdding] = useState<boolean>(false);

  const { setSelectedSize: zSetSelectedSize } = useProductStore();

  const { cart = [], addToCart } = useCartStore();

  useEffect(() => {
    zSetSelectedSize(selectedSize);
  }, [selectedSize]);

  useEffect(() => {
    const cartItem = cart.find(
      (i) => i.id === product.id && i.size === selectedSize
    );

    if (cartItem) {
      setQuantity(cartItem.quantity.toString());
    }
  }, [cart, selectedSize]);

  useEffect(() => {
    const cartItem = cart.find(
      (i) => i.id === product.id && i.size === selectedSize
    );

    if (!cartItem) {
      setQuantity("1");
    }
  }, [selectedSize]);

  const handleAddToCart = async () => {
    if (selectedSize < 1) return;
    setAdding(true);

    try {
      const { data: stock } = await axios.post("/api/cart/add", {
        id: product.id,
        size: selectedSize,
        quantity: Number(quantity),
      });

      if (!stock || typeof stock !== "number")
        return toast.error("Failed to add to cart");

      if (stock < Number(quantity)) {
        addToCart({
          id: product.id,
          size: selectedSize,
          quantity: stock,
        });
        toast.info(
          `Only ${stock} items were added to your cart due to availability.`
        );
      } else {
        addToCart({
          id: product.id,
          size: selectedSize,
          quantity: Number(quantity),
        });
        toast.success("Item added to your cart");
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
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
      <div
        className={`flex flex-wrap gap-2 md:gap-3 lg:gap-4 mt-4 md:mt-7 select-none ${
          adding ? "pointer-events-none" : ""
        }`}
      >
        {product.sizes &&
          product.sizes.map((size, idx) => (
            <button
              disabled={size.stock === 0}
              key={idx}
              className={`h-11 w-14 flex justify-center items-center p-2 border-4 border-secondary text-lg  font-bold uppercase cursor-pointer hover:bg-secondary/20 disabled:bg-secondary/20 disabled:text-secondary/80 disabled:border-secondary/80 disabled:cursor-not-allowed transition duration-100 relative ${
                size.id === selectedSize ? "!bg-secondary text-accent" : ""
              }`}
              onClick={() => setSelectedSize(size.id)}
            >
              {size.title}
              {size.stock === 0 && (
                <span className="absolute text-destructive/65 text-3xl pointer-events-none">
                  ✕
                </span>
              )}
            </button>
          ))}
      </div>
      {/* Add to cart */}
      {product.sizes.some((size) => size.stock > 0) && (
        <div
          className={`flex flex-row mt-7 gap-3 md:gap-5 ${
            adding ? "opacity-90 pointer-events-none" : ""
          }`}
        >
          <div className="flex flex-row gap-1.5">
            <Button
              disabled={adding}
              className="border-4 border-secondary h-full size-10 hover:bg-secondary/20"
              variant="ghost"
              size="icon"
              onClick={() => setProductQuantity(Number(quantity) - 1)}
            >
              <Minus strokeWidth={4} />
            </Button>
            <Input
              disabled={adding}
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
              type="button"
              disabled={adding}
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
            disabled={adding}
            className="text-accent uppercase h-10 text-base"
            onClick={handleAddToCart}
          >
            {adding && (
              <Loader2 strokeWidth={3} className="size-5 animate-spin" />
            )}
            {cart.some((i) => i.id === product.id && i.size === selectedSize)
              ? adding
                ? "Updating..."
                : "Update Cart"
              : adding
              ? "Adding..."
              : "Add to Cart"}
          </Button>
        </div>
      )}
    </>
  );
}
