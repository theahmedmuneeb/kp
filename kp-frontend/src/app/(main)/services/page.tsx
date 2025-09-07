import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ServiceItem, Services as ServicesType } from "@/types/strapi";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { api } from "@/utils/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Services() {
  const { success, data } = await api.get<ServicesType>(
    "/service?populate=serviceSection1.items.image&populate=serviceSection2.items.image&populate=features&populate=ctaButton"
  );

  if (!success || !data.data)
    throw new Error("Failed to fetch services page data");

  const page = data.data;

  return (
    <main className="uppercase pt-10">
      {/* services 1 */}
      <div className="px-4 lg:px-5 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold">
            {page.serviceSection1.heading}
          </h1>
          <span className="inline-block font-montserrat text-lg leading-6 font-semibold mt-2">
            {page.serviceSection1.description}
          </span>
          <ServiceCarousel
            className="mt-5"
            items={page.serviceSection1.items}
          />
        </div>
      </div>
      {/* Services 2 */}
      <div className="text-accent bg-secondary px-4 lg:px-5 pt-14 pb-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold">
            {page.serviceSection2.heading}
          </h1>
          <span className="inline-block font-montserrat text-lg leading-6 font-semibold mt-2">
            {page.serviceSection2.description}
          </span>
          <ServiceCarousel
            className="mt-5 lg:mt-7"
            items={page.serviceSection2.items}
          />
        </div>
      </div>
      {/* Features */}
      <div className="text-accent bg-secondary px-4 lg:px-5 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-[40px] lg:text-5xl font-extrabold text-center">
            {page.featuresHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 lg:mt-14">
            {page.features.map((feature, idx) => (
              <Card
                key={idx}
                className="text-accent bg-secondary font-semibold text-base leading-4.5 shadow-none border-4 lg:border-6 border-primary rounded-none pt-4 pb-16"
              >
                <CardHeader className="text-2xl font-extrabold text-center px-4">
                  {feature.title}
                </CardHeader>
                <CardContent className="font-montserrat px-4">
                  {feature.content}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="text-accent bg-secondary px-4 lg:px-5 pt-20 pb-24">
        <div className="flex flex-col items-center max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-[40px] lg:text-5xl font-extrabold text-center">
            {page.ctaHeading}
          </h1>
          <Link
            href={page.ctaButton.href}
            target={page.ctaButton.blank ? "_blank" : undefined}
            rel={page.ctaButton.blank ? "noopener noreferrer" : undefined}
            className="mt-6"
          >
            <Button className="uppercase font-extrabold lg:mt-10">
              {page.ctaButton.title}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export function ServiceCarousel({
  items,
  className,
}: {
  items: ServiceItem[];
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
            <CarouselItem
              key={idx}
              className="basis-3/4 md:basis-1/3 lg:basis-1/4 pl-4"
            >
              <div>
                <AspectRatio ratio={1}>
                  <Image
                    fill
                    src={item.image.formats.medium.url || item.image.url}
                    alt={
                      item.image.alternativeText ||
                      item.title ||
                      "Service Image"
                    }
                    className="object-cover"
                  />
                </AspectRatio>
                <h3 className="text-xl lg:text-xl xl:text-2xl font-extrabold leading-7 mt-2">
                  {item.title}
                </h3>
                <span className="inline-block text-sm md:text-base leading-4.5 font-montserrat font-semibold mt-1">
                  {item.description}
                </span>
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
