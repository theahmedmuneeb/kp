import React from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { FeaturedComponent1, FeaturedComponent2 } from "@/types/strapi";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

export function FeaturedProductSection1({
  item,
}: {
  item: FeaturedComponent1;
}) {
  return (
    <div className="flex flex-col gap-10 px-4 pt-10 pb-16 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:p-10 gap-8 md:gap-12">
        <div className="lg:w-1/2">
          {item.image && (
            <AspectRatio ratio={794 / 886}>
              <Image
                fill
                alt={item.image.alternativeText || item.image.name || "Image"}
                src={item.image.url}
              />
            </AspectRatio>
          )}
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center gap-10 md:gap-14">
          {item.heading && (
            <h1
              className="text-2xl md:text-[40px] leading-7 md:leading-10 font-bold"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(item.heading),
              }}
            />
          )}
          <div className="flex flex-col gap-3 lg:gap-5 text-lg md:text-2xl font-montserrat font-semibold">
            {item.features
              .filter((listItem) => listItem.text)
              .map((listItem, idx) => (
                <span key={idx}>{listItem.text}</span>
              ))}
          </div>
          <div>
            {item.infoButton && item.infoButton.title && (
              <Link
                href={item.infoButton.href}
                target={item.infoButton.blank ? "_blank" : undefined}
                rel={item.infoButton.blank ? "noopener noreferrer" : undefined}
              >
                <Button className="self-start !font-extrabold">{item.infoButton.title}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Variants */}
      {item.variants && item.variants.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-7">
          {item.variants.map((variant, idx) => {
            // Link Wrapper
            const LinkWrapper = ({ children }: { children: React.ReactNode }) =>
              variant && variant.href ? (
                <Link href={variant.href}>{children}</Link>
              ) : (
                <>{children}</>
              );

            return (
              <div
                key={idx}
                className={`w-full ${
                  idx === item.variants.length - 1 &&
                  item.variants.length % 2 !== 0
                    ? "col-span-2"
                    : ""
                } lg:col-span-1`}
              >
                <AspectRatio ratio={794 / 886}>
                  <LinkWrapper>
                    <Image
                      fill
                      alt={
                        variant.image.alternativeText ||
                        variant.image.name ||
                        "Image"
                      }
                      src={variant.image.url}
                    />
                  </LinkWrapper>
                </AspectRatio>
                {variant.title && (
                  <LinkWrapper>
                    <h2 className="text-lg md:text-3xl font-montserrat font-semibold text-center mt-2 md:mt-3">
                      {variant.title}
                    </h2>
                  </LinkWrapper>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Action Button */}
      {item.actionButton && item.actionButton.title && (
        <div className="flex justify-center md:mt-6">
          <Link
            href={item.actionButton.href}
            target={item.actionButton.blank ? "_blank" : undefined}
            rel={item.actionButton.blank ? "noopener noreferrer" : undefined}
          >
            <Button className="!text-2xl !font-extrabold">{item.actionButton.title}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function FeaturedProductSection2({
  item,
}: {
  item: FeaturedComponent2;
}) {
  return (
    <div className="bg-secondary">
      <div className="flex flex-col text-accent px-4 md:px-20 py-5 md:pt-16 md:pb-18 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
        {/* Upper */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
          <div className="md:w-1/2 py-8 md:py-14 text-end md:text-start">
            <h1
              className="text-3xl md:text-2xl lg:text-5xl font-bold"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.heading) }}
            />
            <div
              className="mt-10 md:mt-14 lg:mt-16 text-xl lg:text-3xl font-montserrat font-medium lg:font-semibold"
              dangerouslySetInnerHTML={{
                __html: marked.parse(item.description, {
                  breaks: true,
                }),
              }}
            />
          </div>
          <div className="md:w-1/2">
            {item.image && (
              <AspectRatio ratio={794 / 886}>
                <Image
                  fill
                  alt={item.image.alternativeText || item.image.name || "Image"}
                  src={item.image.url}
                />
              </AspectRatio>
            )}
          </div>
        </div>
        {/* Variants */}
        {item.variants && item.variants.length > 0 && (
          <div className="grid grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {item.variants.map((variant, idx) => (
              <AspectRatio key={idx} ratio={794 / 886}>
                {variant.href ? (
                  <Link href={variant.href}>
                    <Image
                      fill
                      alt={
                        variant.image.alternativeText ||
                        variant.image.name ||
                        "Image"
                      }
                      src={variant.image.url}
                    />
                  </Link>
                ) : (
                  <Image
                    fill
                    alt={
                      variant.image.alternativeText ||
                      variant.image.name ||
                      variant.title ||
                      "Image"
                    }
                    src={variant.image.url}
                  />
                )}
              </AspectRatio>
            ))}
          </div>
        )}
        {/* Action Button */}
        {item.actionButton && (
          <div className="flex justify-center mt-2">
            <Link
              href={item.actionButton.href}
              target={item.actionButton.blank ? "_blank" : undefined}
              rel={item.actionButton.blank ? "noopener noreferrer" : undefined}
            >
              <Button className="!text-2xl !font-extrabold">{item.actionButton.title}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
