import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useGlobals } from "@/lib/fetch";
import { meta } from "@/lib/meta";
import { AboutUs } from "@/types/strapi";
import { api } from "@/utils/api";
import { Instagram } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";
import sanitize from "sanitize-html";

async function fetchAbout(): Promise<AboutUs> {
  const { success, data: about } = await api.get<AboutUs>(
    "/about?populate=image&populate=seo.openGraph"
  );

  if (!success || !about) {
    throw new Error("Failed to fetch about page");
  }

  return about;
}

export const generateMetadata = async (): Promise<Metadata> => {
  const page = await fetchAbout();
  return meta(page.data.seo, "about");
};

export default async function About() {
  const globals = await useGlobals();
  const page = await fetchAbout();

  return (
    <main className="flex flex-col lg:flex-row gap-3 lg:gap-7 xl:gap-10 px-4 lg:px-10 xl:px-20 pt-6 pb-12 lg:py-20 xl:py-28 uppercase max-w-7xl mx-auto">
      <div className="lg:w-1/2">
        <h1 className="text-4xl lg:text-[40px] font-extrabold">
          {page.data.heading}
        </h1>
        <div className="mt-7 lg:mt-10 xl:mt-14 text-lg lg:text-xl leading-5 lg:leading-6 font-semibold font-montserrat">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitize(page.data.content || ""),
            }}
          />
          <br />
          {page.data.showContactInfo && (
            <div>
              <p>Questions? Feel free to reach out</p>
              <a
                className="flex items-center w-fit"
                href={`https://instagram.com/${globals.data.instagram}`}
                target="_blank"
              >
                <Instagram className="size-4.5 lg:size-5" />@
                {globals.data.instagram}
              </a>
              <a
                className="flex items-center w-fit"
                href={`mailto:${globals.data.email}`}
                target="_blank"
              >
                {globals.data.email}
              </a>
            </div>
          )}
        </div>
        <br />
        {page.data.showContactInfo && (
          <a
            className="inline-block w-fit"
            href={`https://instagram.com/${globals.data.instagram}`}
            target="_blank"
          >
            <Instagram className="size-8" />
          </a>
        )}
      </div>
      <div className="lg:w-1/2 flex flex-col items-center">
        <Image
          width={400}
          height={500}
          src={page.data.image.url}
          alt={page.data.image.alternativeText || page.data.heading}
          className="object-cover select-none pointer-events-none mt-6"
        />
        <div className="text-3xl md:text-4xl lg:text-[40px] xl:text-5xl font-extrabold italic mt-5 lg:mt-3">
          {page.data.textUnderImage}
        </div>
      </div>
    </main>
  );
}
