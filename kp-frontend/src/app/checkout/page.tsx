import { useGlobals } from "@/lib/fetch";
import Link from "next/link";
import React from "react";
import CheckoutComponent  from "@/components/app/checkout";
import { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const globals = await useGlobals();
  return {
    title: `Checkout | ${globals.data.title}`,
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default async function Checkout() {
  const globals = await useGlobals();
  return (
    <>
      <header className="py-2 px-3 lg:px-5 border-b-2 border-b-primary">
        <div className="flex items-center max-w-7xl mx-auto">
          <Link href="/" className="inline-block">
            <img
              src={globals.data.logo.url}
              alt={globals.data.title}
              width={42}
              height={42}
            />
          </Link>
        </div>
      </header>
      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-62px)] max-w-7xl mx-auto">
        <CheckoutComponent />
      </main>
    </>
  );
}
