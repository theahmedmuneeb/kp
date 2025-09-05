"use client";
import React from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image as StrapiImage } from "@/types/strapi";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function ProductMeidaGallery({
  images,
  productTitle,
}: {
  images: StrapiImage[];
  productTitle: string;
}) {
  const [currentImage, setCurrentImage] = React.useState(0);
  return (
    <div>
      <AspectRatio ratio={1}>
        <Zoom zoomMargin={30}>
          <Image
            fill
            src={images[currentImage].url}
            alt={
              images[currentImage].alternativeText ||
              productTitle ||
              images[currentImage].name ||
              "product image"
            }
            priority
            className="object-cover"
          />
        </Zoom>
      </AspectRatio>
      {/* Images Carousel */}
      {images && images.length > 1 && (
        <Carousel className="mt-4 lg:mt-6">
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((image, idx) => (
              <CarouselItem
                key={idx}
                className="basis-1/3 pl-2 md:pl-4 cursor-pointer"
                onClick={() => setCurrentImage(idx)}
              >
                <AspectRatio ratio={1}>
                  <Image
                    fill
                    src={image.url}
                    alt={
                      image.alternativeText ||
                      productTitle ||
                      image.name ||
                      "product image"
                    }
                    className={`object-cover border-2 p-0.5 ${
                      idx === currentImage
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 3 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      )}
    </div>
  );
}
