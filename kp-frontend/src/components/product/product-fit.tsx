"use client";
import { ProductFit as _ProductFit, ServiceItem } from "@/types/strapi";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";

export default function ProductFit({ fit }: { fit: _ProductFit[] | null }) {
  return (
    fit && (
      <div className="max-w-7xl mx-auto px-4 lg:px-5 py-8 lg:py-12 space-y-5">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center pb-2">
          HOW IT FITS
        </h1>
        {fit.map((item, idx) => (
          <ProductFitItem key={idx} item={item} />
        ))}
      </div>
    )
  );
}

export function ProductFitItem({
  item: { model, items },
  className,
}: {
  item: _ProductFit;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 uppercase ${className}`}>
      <h2 className="text-lg font-semibold">{model}</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {items.map((item, idx) => (
            <CarouselItem
              key={idx}
              className="basis-3/4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
            >
              <div>
                <AspectRatio ratio={1}>
                  <Image
                    fill
                    src={item.image.formats.medium.url || item.image.url}
                    alt={
                        item.image.alternativeText ||
                        item.size ||
                      "Model Image"
                    }
                    className="object-cover"
                  />
                </AspectRatio>
                <h3 className="text-xl lg:text-xl xl:text-2xl text-center font-extrabold leading-7 mt-2">
                  {item.size}
                </h3>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          hide
          size="default"
          className="size-auto !p-0 left-1 text-secondary hover:text-secondary bg-transparent hover:bg-transparent border-0 rounded-none top-2/5 drop-shadow-sm drop-shadow-accent"
        >
          <RiArrowLeftSLine className="size-16 lg:size-20 shadow" />
        </CarouselPrevious>
        <CarouselNext
          hide
          size="default"
          className="size-auto !p-0 right-0 text-secondary hover:text-secondary bg-transparent hover:bg-transparent border-0 rounded-none top-2/5 drop-shadow-sm drop-shadow-accent"
        >
          <RiArrowRightSLine className="size-16 lg:size-20 shadow" />
        </CarouselNext>
      </Carousel>
    </div>
  );
}
