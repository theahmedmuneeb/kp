import React from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useGlobals } from "@/lib/fetch";

export default async function Footer() {
  const globals = await useGlobals();

  return (
    <>
      <Separator orientation="horizontal" className="bg-primary !h-1.5" />
      <div className="flex text-accent bg-secondary px-4 lg:px-16 pt-20 pb-16">
        <div className="w-1/2">
          <h1 className="text-xl lg:text-5xl font-bold">BRANDS BY KP</h1>
        </div>
        <div className="w-1/2">
          {globals.data.footerLinks && globals.data.footerLinks.length > 0 && (
            <ul className="text-xl lg:text-4xl font-semibold">
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
