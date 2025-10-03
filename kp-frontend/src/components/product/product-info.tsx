import React from "react";
import { Product } from "@/types/strapi";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import ProductSelectAdd from "./product-select-add";
import ProductAdditionalInfo from "./product-additional-info";

export default async function ProductInfo({ product }: { product: Product }) {

  return (
    <div className="mt-2 lg:mt-14">
      {/* Product title */}
      {/* On lg text size 5xl */}
      <h1 className="text-[28px] leading-7 md:leading-9 lg:leading-10 md:text-4xl lg:text-[40px] font-bold uppercase">
        {product.title}OOOOOO
      </h1>
      {/* Price & Add to Cart */}
      <ProductSelectAdd product={product} />
      {/* variants */}
      {product.variants && product.variants.length > 0 && (
        <>
          <h3 className="text-2xl lg:text-3xl font-bold uppercase mt-6">
            Other colorways
          </h3>
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 lg:gap-7 mt-4">
            {product.variants.map((variant, idx) => (
              <div key={idx}>
                <AspectRatio ratio={1}>
                  <Link href={`/product/${variant.slug}`}>
                    <Image
                      fill
                      src={variant.images[0].formats.thumbnail.url}
                      alt={variant.titleAsVariant || variant.title}
                      className="object-cover"
                    />
                  </Link>
                </AspectRatio>
                <h2 className="font-montserrat font-semibold text-sm lg:text-base text-center uppercase mt-0.5">
                  <Link href={`/product/${variant.slug}`}>
                    {variant.titleAsVariant || variant.title}
                  </Link>
                </h2>
              </div>
            ))}
          </div>
        </>
      )}
      {/* Additional Info */}
      <ProductAdditionalInfo product={product} />
    </div>
  );
}
