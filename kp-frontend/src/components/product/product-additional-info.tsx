import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Zoom from "react-medium-image-zoom";
import { Product, ProductWholesalePrice } from "@/types/strapi";
import { getUser, useGlobals } from "@/lib/fetch";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { marked } from "marked";
import { Separator } from "../ui/separator";
import ProductWholesaleRates from "./product-wholesale-rates";

export default async function ProductAdditionalInfo({
  product,
}: {
  product: Product;
}) {
  const globals = await useGlobals();
  const user = await getUser();

  return (
    <div className="mt-4 md:mt-6">
      <Accordion type="single" collapsible className="w-full">
        {/* Wholesale Price */}
        {user && product.wholesale && product.wholesale.length > 0 && (
          <AccordionItem
            value="wholesale-price"
            className="border-b-4 border-secondary"
          >
            <AccordionTrigger className="text-xl lg:text-2xl font-bold uppercase py-2 lg:py-3 hover:no-underline justify-start items-center gap-3 [&_svg]:stroke-4 [&_svg]:size-5 lg:[&_svg]:size-6 !lg:[&_svg]:text-secondary">
              Price Breaks
            </AccordionTrigger>
            <AccordionContent className="text-base font-medium uppercase pb-2 py-2 ">
              <ProductWholesaleRates
                product={product}
                className="font-montserrat md:max-w-4/5 mx-auto"
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {/* Size Chart */}
        {(product.additional.sizeChart || globals.data.product.sizeChart) && (
          <AccordionItem
            value="size-chart"
            className="border-b-4 border-secondary"
          >
            <AccordionTrigger className="text-xl lg:text-2xl font-bold uppercase py-2 lg:py-3 hover:no-underline justify-start items-center gap-3 [&_svg]:stroke-4 [&_svg]:size-5 lg:[&_svg]:size-6 !lg:[&_svg]:text-secondary">
              Size Chart
            </AccordionTrigger>
            <AccordionContent className="text-base font-medium uppercase pb-2">
              <Zoom zoomMargin={30}>
                <Image
                  fill
                  src={
                    product.additional.sizeChart?.url ||
                    globals.data.product.sizeChart.url
                  }
                  alt="Size Chart"
                  className="!static md:!w-4/5 py-1 mx-auto"
                />
              </Zoom>
            </AccordionContent>
          </AccordionItem>
        )}
        {/* Wash Instructions */}
        {(product.additional.washInstructions ||
          globals.data.product.washInstructions) && (
          <AccordionItem
            value="wash-instructions"
            className="border-b-4 border-secondary"
          >
            <AccordionTrigger className="text-xl lg:text-2xl font-bold uppercase py-2 lg:py-3 hover:no-underline justify-start items-center gap-3 [&_svg]:stroke-4 [&_svg]:size-5 lg:[&_svg]:size-6 !lg:[&_svg]:text-secondary">
              Wash Instructions
            </AccordionTrigger>
            <AccordionContent className="text-base font-montserrat font-medium uppercase pb-2">
              {product.additional.washInstructions ||
                globals.data.product.washInstructions}
            </AccordionContent>
          </AccordionItem>
        )}
        {/* Shipping */}
        {(product.additional.shippingInfo ||
          globals.data.product.shippingInfo) && (
          <AccordionItem
            value="shipping-info"
            className="border-b-4 border-secondary"
          >
            <AccordionTrigger className="text-xl lg:text-2xl font-bold uppercase py-2 lg:py-3 hover:no-underline justify-start items-center gap-3 [&_svg]:stroke-4 [&_svg]:size-5 lg:[&_svg]:size-6 !lg:[&_svg]:text-secondary">
              Shipping
            </AccordionTrigger>
            <AccordionContent className="text-base font-montserrat font-medium uppercase pb-2">
              {product.additional.shippingInfo ||
                globals.data.product.shippingInfo}
            </AccordionContent>
          </AccordionItem>
        )}
        {/* fabric Information */}
        {(product.additional.fabricInfo || globals.data.product.fabricInfo) && (
          <AccordionItem
            value="fabric-info"
            className="border-b-4 border-secondary"
          >
            <AccordionTrigger className="text-xl lg:text-2xl font-bold uppercase py-2 lg:py-3 hover:no-underline justify-start items-center gap-3 [&_svg]:stroke-4 [&_svg]:size-5 lg:[&_svg]:size-6 !lg:[&_svg]:text-secondary">
              Fabric Information
            </AccordionTrigger>
            <AccordionContent className="text-base font-montserrat font-medium uppercase pb-2">
              {product.additional.fabricInfo || globals.data.product.fabricInfo}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      <Separator className="!h-1 bg-secondary" />
      {product.description && (
        <div
          className="text-xl lg:text-2xl leading-5.5 lg:leading-7 font-montserrat font-semibold mt-2"
          dangerouslySetInnerHTML={{
            __html: marked(product.description, { breaks: true }),
          }}
        />
      )}
    </div>
  );
}
