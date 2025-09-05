import React from "react";
import { RiStarFill } from "@remixicon/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function Testimonials() {
  return (
    <div className="flex flex-col-reverse md:flex-col items-center px-4 py-4 md:py-8 max-w-7xl mx-auto">
      {/* Star Rating */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl md:text-[40px] font-bold text-center hidden md:block">
          TESTIMONIALS
        </h1>
        <div className="flex flex-row gap-3 md:gap-5 lg:gap-8 md:mt-8 *:size-11 md:*:size-16 *:stroke-primary">
          <RiStarFill />
          <RiStarFill />
          <RiStarFill />
          <RiStarFill />
          <RiStarFill />
        </div>
        <span className="text-xl md:text-2xl font-bold mt-4 md:mt-5 font-montserrat uppercase">
          on google
        </span>
      </div>
      {/* Review Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-10">
        <Card className="text-secondary font-montserrat font-semibold text-lg md:text-xl leading-5 md:leading-6 shadow-none border-4 lg:border-6 border-primary rounded-none py-4">
          <CardContent className="px-4">
            By far the best screen printer to work with. I felt like when I
            found Kobeʼs Provisions it was a Godsend, no joke. Great to work
            with, great service, great final products. He knows whatʼs up.
          </CardContent>
          <CardFooter className="mt-auto px-4 mb-7">-Ty A</CardFooter>
        </Card>
        <Card className="text-secondary font-montserrat font-semibold text-lg md:text-xl leading-5 md:leading-6 shadow-none border-4 lg:border-6 border-primary rounded-none py-4">
          <CardContent className="px-4">
            By far the best screen printer to work with. I felt like when I
            found Kobeʼs Provisions it was a Godsend, no joke. Great to work
            with, great service, great final products. He knows whatʼs up.
          </CardContent>
          <CardFooter className="mt-auto px-4 mb-7">-Ty A</CardFooter>
        </Card>
        <Card className="text-secondary font-montserrat font-semibold text-lg md:text-xl leading-5 md:leading-6 shadow-none border-4 lg:border-6 border-primary rounded-none py-4">
          <CardContent className="px-4">
            By far the best screen printer to work with. I felt like when I
            found Kobeʼs Provisions it was a Godsend, no joke. Great to work
            with, great service, great final products. He knows whatʼs up.
          </CardContent>
          <CardFooter className="mt-auto px-4 mb-7">-Ty A</CardFooter>
        </Card>
      </div>
    </div>
  );
}
