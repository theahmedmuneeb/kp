import { cn } from "@/lib/utils";
import { Homepage } from "@/types/strapi";
import React from "react";
import sanitize from "sanitize-html";

export default function Hero({ home }: { home: Homepage }) {
  return (
    <div className="px-5 py-6 max-w-7xl mx-auto">
      <div className="aspect-549/886 md:aspect-640/303 relative">
        <div
          className="h-full bg-cover bg-center md:hidden"
          style={{ backgroundImage: `url(${home.data.heroBgImage.url})` }}
        />
        <img
          src={home.data.heroBgImageDesktop?.url || home.data.heroBgImage.url}
          alt="Hero Background"
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 h-full md:w-1/2 lg:w-1/3 pl-3 flex flex-col justify-end md:justify-center md:items-end">
          <div className="flex flex-col gap-4 mb-16 md:mb-0">
            <h1
              className={cn(
                "text-3xl md:text-4xl lg:text-[40px] leading-7 md:leading-8 lg:leading-9 font-extrabold",
                "md:text-3xl lg:text-4xl lg:leading-9"
              )}
              dangerouslySetInnerHTML={{
                __html: sanitize(home.data.heroTitle),
              }}
            />
            {/* on Montserrat md size also sm */}
            <span
              className="text-xs lg:text-sm font-semibold leading-4 font-montserrat"
              dangerouslySetInnerHTML={{
                __html: sanitize(home.data.heroDescription),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
