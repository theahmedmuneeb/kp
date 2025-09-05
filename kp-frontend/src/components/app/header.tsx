import React from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { MobileNavigationMenu, NavigationMenu } from "./navigation-menu";
import { useGlobals } from "@/lib/fetch";
import CartHeader from "./cart-header";

export default async function Header() {
  const globals = await useGlobals();

  return (
    <>
      <header className="flex flex-row justify-between bg-background px-3 py-2.5">
        <div className="flex flex-row gap-10">
          {/* Logo */}
          <Link href="/">
            <Image
              src={globals.data.logo.url}
              alt={globals.data.title}
              width={42}
              height={42}
            />
          </Link>
          {/* Navigation menu */}
          <NavigationMenu globals={globals} />
        </div>
        <div className="flex flex-row items-center gap-6 md:gap-10">
          {/* Header Button */}
          {globals.data.headerButton.title && (
            <Link
              className="hidden lg:inline-block"
              href={globals.data.headerButton.href}
              target={globals.data.headerButton.blank ? "_blank" : undefined}
              rel={
                globals.data.headerButton.blank
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              <Button className="text-xl !font-extrabold">
                {globals.data.headerButton.title}
              </Button>
            </Link>
          )}
          {/* Cart */}
          <CartHeader />
          {/* Mobile Menu */}
          <MobileNavigationMenu globals={globals} />
        </div>
      </header>
      <Separator
        orientation="horizontal"
        className="bg-primary !h-1 !md:h-1.5"
      />
    </>
  );
}
