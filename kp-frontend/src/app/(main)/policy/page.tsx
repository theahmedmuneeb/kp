import { Policy } from "@/types/strapi";
import { api } from "@/utils/api";
import React from "react";

export default async function Services() {
  const { success, data: res } = await api.get<Policy>(
    "/policy?populate=policy.items"
  );

  if (!success || !res || !res.data)
    throw new Error("Failed to fetch policy page");

  const policies = res.data.policy;

  return (
    <main className="flex flex-col gap-6 lg:gap-8 xl:gap-12 px-4 lg:px-10 xl:px-20 pt-6 pb-12 lg:py-20 xl:py-28 uppercase max-w-7xl mx-auto">
      {policies.map((policy, idx) => (
        <div key={idx} className="flex flex-col gap-5 lg:gap-8 xl:gap-12">
          <h1 className="text-2xl md:text-3xl lg:text-[40px] leading-6.5 md:leading-8.5 lg:leading-none font-extrabold">
            {policy.title}
          </h1>
          <div className="leading-5 font-semibold font-montserrat lg:grid grid-cols-3">
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 xl:gap-10">
              <div className="flex flex-col gap-4">
                {policy.items
                  .slice(0, Math.floor(policy.items.length / 2))
                  .map((item, idx) => (
                    <div key={idx}>
                      {idx + 1}.{item.text}
                    </div>
                  ))}
              </div>
              <div className="flex flex-col gap-4">
                {policy.items
                  .slice(
                    Math.floor(policy.items.length / 2),
                    policy.items.length
                  )
                  .map((item, idx) => (
                    <div key={idx}>
                      {Math.floor(policy.items.length / 2) + idx + 1}.{item.text}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
