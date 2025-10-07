import QuoteForm from "@/components/app/quote-form";
import { useGlobals } from "@/lib/fetch";
import { meta } from "@/lib/meta";
import { QuotePage } from "@/types/strapi";
import { api } from "@/utils/api";
import { Instagram } from "lucide-react";
import { Metadata } from "next";
import React from "react";

export const revalidate = false;

async function fetchQuotePage(): Promise<QuotePage> {
  const { success, data: quote } = await api.get<QuotePage>(
    "/get-quote?populate=seo.openGraph"
  );
  if (!success || !quote.data) {
    throw new Error("Failed to fetch quote page");
  }
  return quote;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchQuotePage();
  return meta(page.data.seo, "get-quote");
}

export default async function Quote() {
  const globals = await useGlobals();
  const page = await fetchQuotePage();

  return (
    <main className="flex flex-col lg:flex-row w-full uppercase">
      {/* Left Side */}
      <div className="flex lg:w-1/2 bg-background">
        <div className="flex flex-col gap-5 lg:gap-10 w-full max-w-2xl mx-auto px-5 py-8 lg:p-16 xl:px-20 xl:py-28">
          <h1
            className="text-2xl md:text-4xl lg:text-3xl xl:text-4xl font-extrabold leading-7.5 md:leading-9 xl:leading-10"
            dangerouslySetInnerHTML={{ __html: page.data.heading }}
          />
          <span className="font-montserrat font-semibold text-base md:text-lg leading-4 md:leading-5">
            {page.data.content}
          </span>
          {page.data.showContactInfo && (
            <div className="hidden lg:block font-montserrat font-semibold text-lg leading-5.5">
              <p>Questions? Feel free to reach out</p>
              <a
                className="flex items-center w-fit"
                href={`https://www.instagram.com/${globals.data.instagram}`}
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
      </div>
      {/* Right Form */}
      <div className="flex text-accent bg-secondary w-full lg:w-1/2">
        <div className="flex flex-col gap-12 py-10 w-full max-w-2xl mx-auto">
          <QuoteForm />
          {page.data.showContactInfo && (
            <div className="lg:hidden font-montserrat text-primary font-semibold text-base md:text-lg leading-5.5 px-4 md:px-5 mx-auto">
              <p>Questions? Feel free to reach out</p>
              <a
                className="flex items-center w-fit"
                href={`https://www.instagram.com/${globals.data.instagram}`}
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
      </div>
    </main>
  );
}
