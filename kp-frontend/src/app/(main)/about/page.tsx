import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Instagram } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <main className="flex flex-col lg:flex-row gap-3 lg:gap-7 xl:gap-10 px-4 lg:px-10 xl:px-20 pt-6 pb-12 lg:py-20 xl:py-28 uppercase max-w-7xl mx-auto">
      <div className="lg:w-1/2">
        <h1 className="text-4xl lg:text-[40px] font-extrabold">About us</h1>
        <div className="mt-7 lg:mt-10 xl:mt-14 text-lg lg:text-xl leading-5 lg:leading-6 font-semibold font-montserrat">
          <p>
            At KP, we specialize in jumbo prints, unique locations, and jobs
            that most print shops won’t touch — all with no minimum order
            requirements. Along with printing, we offer our own in-house blanks
            (BlanksByKP) and have our own clothing brand (Disruptive).
          </p>
          <br />
          <p>
            Come see what sets us apart and why our prints consistently stand
            out from the competition.
          </p>
          <br />
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
          <span className="block"></span>
        </div>
        <br />
        <a
          className="inline-block w-fit"
          href="https://www.instagram.com/mc.provisions"
          target="_blank"
        >
          <Instagram className="size-8" />
        </a>
      </div>
      <div className="lg:w-1/2 flex flex-col items-center">
        <Image
          width={400}
          height={500}
          src="https://i.ibb.co/NdkfY9YH/about-us.png"
          alt="cover the earth"
          className="object-cover select-none pointer-events-none mt-6"
        />
        <div className="text-3xl md:text-4xl lg:text-[40px] xl:text-5xl font-extrabold italic mt-5 lg:mt-3">
          KOBE’SPROVISIONS
        </div>
      </div>
    </main>
  );
}
