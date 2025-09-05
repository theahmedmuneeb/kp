import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ServiceItem } from "@/types/strapi";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RiArrowRightSLine } from "@remixicon/react";

export default function Services() {
  return (
    <main className="uppercase pt-10">
      <div className="px-4 lg:px-5 pt-10 pb-8">
        <h1 className="text-4xl lg:text-[40px] font-extrabold">Services</h1>
        <span className="inline-block font-montserrat text-lg font-semibold mt-2">
          High quality printing with no minimums
        </span>
        <ServiceCarousel className="mt-5" items={[1, 2, 3, 4, 5]} />
      </div>
    </main>
  );
}

export function ServiceCarousel({
  items,
  className,
}: {
  items: number[];
  className?: string;
}) {
  return (
    <div className={`${className}`}>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {items.map((item, idx) => (
            <CarouselItem key={idx} className="basis-1/4 pl-4">
              <div>
                <AspectRatio ratio={1}>
                  <Image
                    fill
                    src="https://storage.kp.ahmedmuneeb.com/5001bfb908f1461cac22595a535c00a1_1_9b60d42b24.webp"
                    alt="Image"
                    className="object-cover"
                  />
                </AspectRatio>
                <h2 className="lg:text-xl xl:text-2xl font-extrabold leading-7 mt-2">SCREENPRINTING</h2>
                <span className="inline-block text-base leading-4.5 font-montserrat font-semibold mt-1">
                  RELIABLE, HIGH-QUALITY PRINTS DESIGNED TO HOLD UP OVER TIME.
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          hide
          className="left-5 text-secondary hover:text-secondary bg-transparent hover:bg-transparent border-0 rounded-none top-2/5"
        >
          <ChevronLeft strokeWidth={3} className="lg:size-24 shadow" />
        </CarouselPrevious>
        <CarouselNext
          hide
          className="right-5 text-secondary hover:text-secondary bg-transparent hover:bg-transparent border-0 rounded-none top-2/5"
        >
          <RiArrowRightSLine strokeWidth={10} className="lg:size-24 shadow" />
        </CarouselNext>
      </Carousel>
    </div>
  );
}
