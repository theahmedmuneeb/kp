import React from "react";

export default function Hero() {
  return (
    <div className="px-5 py-6 max-w-7xl mx-auto">
      <div className="aspect-549/886 md:aspect-640/303">
        <div className="h-full bg-[url(/images/hero-bg-mobile.jpg)] md:bg-[url(/images/hero-bg.jpg)] bg-cover bg-no-repeat">
          <div className="h-full md:w-1/2 lg:w-1/3 pl-3 flex flex-col justify-end md:justify-center md:items-end">
            <div className="flex flex-col gap-4 mb-16 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-[40px] leading-7 md:leading-8 lg:leading-9 font-bold">
                NO MINIMUM
                <br />
                SCREEN PRINTING
              </h1>
              <span className="text-xs md:text-sm font-semibold leading-4 font-montserrat">
                7+ years and thousands of garments printed.
                <br />
                We do jobs that other shops simply wonʼt touch.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
