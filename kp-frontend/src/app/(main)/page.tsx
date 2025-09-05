export const revalidate = false;

import {
  FeaturedProductSection1,
  FeaturedProductSection2,
} from "@/components/app/featured-product-sections";
import Hero from "@/components/app/hero";
import Testimonials from "@/components/app/testimonials";
import { Homepage } from "@/types/strapi";
import { api, ApiResponse } from "@/utils/api";

export default async function Home() {
  const { success, data: home } = (await api.get(
    "/homepage?populate=featured&populate=featured.image&populate=featured.infoButton&populate=featured.variants&populate=featured.actionButton&populate=featured.features&populate=featured.variants.image"
  )) as ApiResponse<Homepage>;

  if (!success || !home) {
    throw new Error("Failed to get homepage");
  }

  return (
    <main>
      <Hero />
      <Testimonials />
      {home.data.featured &&
        home.data.featured.length > 0 &&
        home.data.featured.map((featured, idx) => {
          if (
            featured.__component === "kp.featured-1" &&
            "features" in featured
          ) {
            return <FeaturedProductSection1 item={featured} key={idx} />;
          } else if (
            featured.__component === "kp.featured-2" &&
            "description" in featured
          ) {
            return <FeaturedProductSection2 item={featured} key={idx} />;
          }
        })}
    </main>
  );
}
