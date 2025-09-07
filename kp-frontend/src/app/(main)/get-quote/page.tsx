import QuoteForm from "@/components/app/quote-form";
import { Instagram } from "lucide-react";
import React from "react";

export default function Contact() {
  return (
    <main className="flex flex-col lg:flex-row w-full uppercase">
      {/* Left Side */}
      <div className="flex lg:w-1/2 bg-background">
        <div className="flex flex-col gap-5 lg:gap-10 w-full max-w-2xl mx-auto px-5 py-8 lg:p-16 xl:px-20 xl:py-28">
          <h1 className="text-3xl md:text-4xl xl:text-[40px] font-extrabold leading-7.5 md:leading-9 xl:leading-10">
            High quality
            <br />
            screen printing
            <br />
            with no minimums
          </h1>
          <span className="font-montserrat font-semibold text-base md:text-lg leading-4 md:leading-5">
            Submit your quote and our team will reach out in the next few days.
          </span>
          <div className="hidden lg:block font-montserrat font-semibold text-lg leading-5.5">
            <p>Questions? Feel free to reach out</p>
            <a
              className="flex items-center w-fit"
              href="https://www.instagram.com/mc.provisions"
              target="_blank"
            >
              <Instagram className="size-4.5 lg:size-5" />
              @mc.provisions
            </a>
            <a
              className="flex items-center w-fit"
              href="mailto:provisionsmcp@gmail.com"
              target="_blank"
            >
              provisionsmcp@gmail.com
            </a>
          </div>
        </div>
      </div>
      {/* Right Form */}
      <div className="flex text-accent bg-secondary w-full lg:w-1/2">
        <div className="py-10 w-full max-w-2xl mx-auto">
          <QuoteForm />
        </div>
      </div>
    </main>
  );
}
