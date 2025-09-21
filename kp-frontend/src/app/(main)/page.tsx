import {
  FeaturedProductSection1,
  FeaturedProductSection2,
} from "@/components/app/featured-product-sections";
import Hero from "@/components/app/hero";
import Testimonials from "@/components/app/testimonials";
import { meta } from "@/lib/meta";
import { Homepage } from "@/types/strapi";
import { api } from "@/utils/api";
import { type Metadata } from "next";

export const revalidate = false;

async function fetchHomepage(): Promise<Homepage> {
  const { success, data: home } = await api.get<Homepage>(
    "/homepage?populate=featured&populate=featured.image&populate=featured.infoButton&populate=featured.variants&populate=featured.actionButton&populate=featured.features&populate=featured.variants.image&populate=heroBgImage&populate=heroBgImageDesktop&populate=testimonials&populate=seo.openGraph"
  );

  if (!success || !home) {
    throw new Error("Failed to get homepage");
  }
  return home;
}

export async function generateMetadata(): Promise<Metadata> {
  const home = await fetchHomepage();
  return {
    ...(await meta(home.data.seo, "")),
    title: {
      absolute: home.data.seo.metaTitle,
    },
  };
}

export default async function Home() {
  const home = await fetchHomepage();

  return (
    <main>
      <Hero home={home} />
      <Testimonials home={home} />
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
