import React from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useGlobals } from "@/lib/fetch";
import Image from "next/image";

export default async function Footer() {
  const globals = await useGlobals();

  return (
    <>
      <Separator orientation="horizontal" className="bg-primary !h-1.5" />
      <div className="flex flex-col md:flex-row gap-10 md:gap-7 text-accent bg-secondary px-4 lg:px-16 pt-20 pb-16">
        {globals.data.footerBrands && globals.data.footerBrands.length > 0 && (
          <div className="md:w-1/2">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold mb-5">
              BRANDS BY KP
            </h1>
            <div className="flex flex-col flex-wrap content-start">
              {globals.data.footerBrands.map((brand, idx) => (
                <div key={idx} className="self-stretch flex flex-col items-center">
                  {brand.title && brand.title.startsWith("[T]") && (
                    <Link href={brand.href || "#"}>
                      <span className="font-montserrat font-semibold text-sm">
                        {brand.title.replace(/^\[T\]/, "")}
                      </span>
                    </Link>
                  )}
                  <Link href={brand.href || "#"}>
                    <Image
                      className="object-contain !size-20 md:!size-24"
                      src={brand.image.url}
                      alt={brand.title || "Brand Logo"}
                      width={96}
                      height={96}
                    />
                  </Link>
                  {brand.title && !brand.title.startsWith("[T]") && (
                    <Link href={brand.href || "#"}>
                      <span className="font-montserrat font-semibold text-sm">
                        {brand.title}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="md:w-1/2">
          {globals.data.footerLinks && globals.data.footerLinks.length > 0 && (
            <ul className="text-xl lg:text-4xl font-semibold font-montserrat uppercase">
              {globals.data.footerLinks
                .filter((link) => link.title)
                .map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      target={link.blank ? "_blank" : undefined}
                      rel={link.blank ? "noopener noreferrer" : undefined}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
