"use client";
import React, { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Globals } from "@/types/strapi";
import { RiCloseFill, RiMenuFill } from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useGeneralStore } from "@/store/general";

export function NavigationMenu({ globals }: { globals: Globals }) {
  const [submenuOpen, setSubmenuOpen] = React.useState<{
    [key: string]: boolean;
  }>({});
  return (
    <div className="hidden lg:flex flex-row gap-6 items-center font-extrabold text-2xl text-secondary">
      {globals.data.navigation.map((item, idx) => {
        if ("items" in item) {
          return (
            <Popover
              key={idx}
              open={submenuOpen[idx]}
              onOpenChange={(open) =>
                setSubmenuOpen({ ...submenuOpen, [idx]: open })
              }
            >
              <PopoverTrigger
                onMouseEnter={() =>
                  setSubmenuOpen({ ...submenuOpen, [idx]: true })
                }
                onMouseLeave={() =>
                  setSubmenuOpen({ ...submenuOpen, [idx]: false })
                }
              >
                <span className="flex items-center gap-1">
                  {item.title}
                  <ChevronDown
                    className={`transform transition duration-150 ${
                      submenuOpen[idx] ? "rotate-180" : ""
                    }`}
                    strokeWidth={3}
                  />
                </span>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto px-0 py-2 border-0 shadow-md text-accent font-extrabold text-xl"
                side="bottom"
                sideOffset={12}
                align="center"
                onMouseEnter={() =>
                  setSubmenuOpen({ ...submenuOpen, [idx]: true })
                }
                onMouseLeave={() =>
                  setSubmenuOpen({ ...submenuOpen, [idx]: false })
                }
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {/* Menu Pointer */}
                <div className="w-full absolute -top-3 left-0 flex justify-center">
                  <div className="w-0 h-0 border-x-16 border-b-16 border-transparent border-b-secondary" />
                </div>
                {/* Menu Content */}
                {item.items
                  .filter((subItem) => subItem.title)
                  .map((subitem, subidx, items) => (
                    <React.Fragment key={subidx}>
                      <div className="text-center py-3 px-4">
                        <Link
                          href={subitem.href}
                          target={subitem.blank ? "_blank" : undefined}
                          rel={
                            subitem.blank ? "noopener noreferrer" : undefined
                          }
                          onClick={() =>
                            setSubmenuOpen({ ...submenuOpen, [idx]: false })
                          }
                        >
                          {subitem.title}
                        </Link>
                      </div>
                      {/* Separator */}
                      {subidx < items.length - 1 && (
                        <Separator
                          orientation="horizontal"
                          className="h-1 bg-background"
                        />
                      )}
                    </React.Fragment>
                  ))}
              </PopoverContent>
            </Popover>
          );
        } else {
          return (
            item.title && (
              <Link
                key={idx}
                href={item.href}
                target={item.blank ? "_blank" : undefined}
                rel={item.blank ? "noopener noreferrer" : undefined}
              >
                {item.title}
              </Link>
            )
          );
        }
      })}
    </div>
  );
}

export function MobileNavigationMenu({ globals }: { globals: Globals }) {
  const { mobileNavigationMenuOpen, setMobileNavigationMenuOpen } =
    useGeneralStore();

  useEffect(() => {
    const mainElement = document.querySelector("main");

    if (mobileNavigationMenuOpen) {
      document.body.style.overflow = "hidden";
      if (mainElement) {
        mainElement.style.pointerEvents = "none";
        mainElement.style.userSelect = "none";
      }
    } else {
      document.body.style.overflow = "";
      if (mainElement) {
        mainElement.style.pointerEvents = "";
        mainElement.style.userSelect = "";
      }
    }
  }, [mobileNavigationMenuOpen]);

  useEffect(() => {
    document.querySelector("header a img")?.addEventListener("click", () => {
      setMobileNavigationMenuOpen(false);
    });
  }, []);

  return (
    <Popover
      open={mobileNavigationMenuOpen}
      onOpenChange={setMobileNavigationMenuOpen}
    >
      <PopoverTrigger asChild>
        <button className="flex items-center justify-center cursor-pointer lg:hidden">
          <AnimatePresence mode="wait" initial={false}>
            {!mobileNavigationMenuOpen ? (
              <motion.span
                key="menu"
                initial={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                className="inline-block cursor-pointer lg:hidden"
              >
                <RiMenuFill className="size-9 text-secondary" />
              </motion.span>
            ) : (
              <motion.span
                key="close"
                initial={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                exit={{
                  scale: 0,
                  opacity: 0,
                }}
                className="inline-block cursor-pointer lg:hidden"
              >
                <RiCloseFill className="size-9 text-secondary" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={15}
        onInteractOutside={(e) => e.preventDefault()}
        className="w-screen md:w-md border-0 p-0 lg:hidden"
      >
        <div className="w-0 h-0 border-x-16 border-b-16 border-transparent border-b-secondary absolute -top-3.5 right-3.5" />
        <ScrollArea className="h-[calc(100dvh-64px)] text-accent">
          <ul className="flex flex-col justify-center text-center mt-2 text-2xl font-bold">
            {globals.data.mobileNavigation.map(
              (item, idx) =>
                item.title && (
                  <React.Fragment key={idx}>
                    <li>
                      <Link
                        onClick={() => setMobileNavigationMenuOpen(false)}
                        className="p-4 block max-w-[calc(100dvw-32px)] truncate mx-auto"
                        href={item.href}
                        target={item.blank ? "_blank" : undefined}
                        rel={item.blank ? "noopener noreferrer" : undefined}
                      >
                        {item.title}
                      </Link>
                    </li>
                    <Separator orientation="horizontal" className="!h-1" />
                  </React.Fragment>
                )
            )}
          </ul>
          {globals.data.headerButton.title && (
            <Link
              href={globals.data.headerButton.href}
              target={globals.data.headerButton.blank ? "_blank" : undefined}
              rel={
                globals.data.headerButton.blank
                  ? "noopener noreferrer"
                  : undefined
              }
              onClick={() => setMobileNavigationMenuOpen(false)}
            >
              <Button className="w-full !text-2xl !p-4">
                {globals.data.headerButton.title}
              </Button>
            </Link>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
