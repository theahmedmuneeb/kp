"use client";
import React, { useEffect, useRef, useState } from "react";
import { RiArrowLeftLine, RiShoppingCart2Line } from "@remixicon/react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGeneralStore } from "@/store/general";
import { Button } from "../ui/button";
import { CreditCard, Frown, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { useCartStore } from "@/store/cart";
import { AnimatePresence, motion } from "framer-motion";
import { CartContent } from "@/types/strapi";
import { getCart } from "@/lib/fetch";
import { toast } from "sonner";
import isObjectsEqual from "fast-deep-equal";

export default function CartHeader() {
  const router = useRouter();
  const { mobileNavigationMenuOpen } = useGeneralStore();
  const {
    cart,
    removeFromCart: zRemoveFromCart,
    clearCart: zClearCart,
    setCart: zSetCart,
  } = useCartStore();

  const [cartHeaderOpen, setCartHeaderOpen] = useState(false);
  const [cartContent, setCartContent] = useState<CartContent | null>(null);
  const [cartLoading, setCartLoading] = useState(false);

  const latestRequestId = useRef(0);

  const loadCart = async (loading = true) => {
    setCartLoading(loading && true);
    const requestId = ++latestRequestId.current;
    const cartData = await getCart(cart);

    if (requestId !== latestRequestId.current) return;

    setCartContent(cartData);
    setCartLoading(false);

    if (cartData) {
      const newCart = cartData.map((item) => ({
        id: item.id,
        size: item.size.id,
        quantity: item.quantity,
      }));

      if (!isObjectsEqual(newCart, cart)) {
        zSetCart(newCart);
        toast.info(
          "Your cart has been updated to reflect the latest changes in availability."
        );
      }
    }
  };

  const handleRemoveFromCart = (id: number, size: number) => {
    zRemoveFromCart(id, size);
    setCartContent(
      cartContent?.filter(
        (item) => !(item.id === id && item.size.id === size)
      ) || []
    );
  };

  useEffect(() => {
    if (cartHeaderOpen) {
      loadCart(false);
    }
  }, [cart]);

  return (
    <Sheet
      open={cartHeaderOpen}
      onOpenChange={() => {
        setCartHeaderOpen(!cartHeaderOpen);
        if (!cartHeaderOpen) {
          loadCart();
        } else {
          setTimeout(() => {
            setCartContent(null);
          }, 200);
        }
      }}
    >
      <SheetTrigger
        className="cursor-pointer"
        disabled={mobileNavigationMenuOpen}
      >
        <RiShoppingCart2Line className="size-9 text-secondary" />
      </SheetTrigger>
      <SheetContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        hidden={mobileNavigationMenuOpen}
        className="bg-background w-full [&>button:first-of-type]:hidden gap-0"
      >
        <SheetHeader className="flex flex-row items-center text-xl">
          <SheetClose className="cursor-pointer">
            <RiArrowLeftLine />
          </SheetClose>
          <SheetTitle className="flex-grow text-secondary font-montserrat text-center">
            Cart
            {!cartLoading && cartContent && cartContent.length > 0 && (
              <> ({cartContent.length})</>
            )}
          </SheetTitle>
          {/* Clear Cart */}
          <div className="size-6">
            {!cartLoading && cartContent && cartContent.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger className="cursor-pointer">
                  <Trash2 className="text-destructive" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl lg:text-2xl">
                      Clear Cart
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-montserrat">
                      Are you sure you want to remove all items from your cart?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-montserrat uppercase">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="text-accent bg-destructive hover:bg-destructive/80 font-montserrat uppercase"
                      onClick={() => {
                        zClearCart();
                        setCartContent([]);
                      }}
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </SheetHeader>
        {cartLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2
              className="size-12 animate-spin ease-in-out"
              strokeWidth={2}
            />
          </div>
        ) : cartContent && cartContent.length > 0 ? (
          <>
            <div className="h-full flex flex-col pl-2">
              <ScrollArea
                className="h-[calc(100dvh-142px)]"
                scrollBarClassName="bg-secondary rounded-none"
              >
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 1 },
                    show: {
                      opacity: 1,
                      transition: {
                        delayChildren: 0.1,
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  <AnimatePresence mode="sync">
                    {cartContent.map((item) => (
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          show: { opacity: 1, y: 0 },
                        }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        layout
                        className="grid grid-cols-12 p-2 mr-2 last:mb-1 border-b last:border-0 border-secondary"
                        key={`${item.id}-${item.size.id}`}
                      >
                        <div className="col-span-2">
                          <AspectRatio ratio={1}>
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={() => {
                                setCartHeaderOpen(false);
                              }}
                            >
                              <Image
                                fill
                                src={item.image.url}
                                alt={item.title}
                                className="object-contain"
                              />
                            </Link>
                          </AspectRatio>
                        </div>
                        <div className="col-span-6 flex flex-col justify-center mx-2">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => {
                              setCartHeaderOpen(false);
                            }}
                          >
                            <div
                              className="text-sm font-semibold leading-3.5 break-all overflow-hidden text-ellipsis uppercase"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item.title}
                            </div>
                          </Link>
                          <div className="text-xs font-semibold text-muted-foreground mt-0.5">
                            ${item.price} x {item.quantity} —{" "}
                            <span className="uppercase text-secondary/80">
                              ({item.size.title})
                            </span>
                          </div>
                        </div>
                        <div className="col-span-3 text-sm leading-3.5 font-semibold font-montserrat m-auto break-all">
                          ${item.total}
                        </div>
                        {/* Remove Button */}
                        <button
                          className="flex items-center text-destructive cursor-pointer h-fit my-auto ml-auto"
                          onClick={() => {
                            handleRemoveFromCart(item.id, item.size.id);
                          }}
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </ScrollArea>
            </div>
            <div className="border-t-2 border-t-secondary py-3 px-2 grid grid-cols-2 gap-4">
              <div className="pl-1">
                <span className="block text-xl font-bold uppercase">Total</span>
                <span className="block text-lg font-montserrat font-semibold">
                  $ {cartContent.reduce((i, j) => i + (j?.total || 0), 0)}
                </span>
              </div>
              <div className="flex flex-col justify-center items-end">
                <Button
                  className="!px-4 uppercase"
                  onClick={() => {
                    router.push("/checkout");
                    setTimeout(() => {
                      setCartHeaderOpen(false);
                    }, 1000);
                  }}
                >
                  <CreditCard strokeWidth={2} className="size-6 md:size-7" />{" "}
                  Checkout
                </Button>
              </div>
            </div>
          </>
        ) : cartContent && cartContent.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center gap-4">
            <div className="bg-secondary/40 rounded-full p-5">
              <ShoppingBag className="size-7" />
            </div>
            <div className="font-semibold font-montserrat uppercase">
              Your cart is empty
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center gap-4">
            <div className="text-red-700 bg-red-700/30 rounded-full p-5">
              <Frown className="size-7" />
            </div>
            <div className="text-red-700 font-semibold font-montserrat uppercase">
              Something went wrong
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
