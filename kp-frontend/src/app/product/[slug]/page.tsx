import React from "react";
import Header from "@/components/app/header";
import Footer from "@/components/app/footer";
import { Product as ProductType, ProductPage } from "@/types/strapi";
import { api } from "@/utils/api";
import { notFound } from "next/navigation";
import ProductMeidaGallery from "@/components/product/product-media-gallery";
import ProductInfo from "@/components/product/product-info";
import { unstable_cache } from "next/cache";
import { Metadata } from "next";

// Fetch product
async function fetchProduct(slug: string): Promise<ProductType | null> {
  const { success, data: productsData } = await api.get<ProductPage>(
    `/products?filters[slug][$eq]=${slug}&limit=1&populate=images&populate=sizes&populate=sizes.wholesale&populate=variants&populate=variants.images&populate=wholesale&populate=additional&populate=additional.sizeChart&populate=seo.openGraph`
  );

  if (!success || !productsData.data || !Array.isArray(productsData.data)) {
    throw new Error("Failed to fetch product");
  }

  return productsData.data[0] || null;
}

// Cached product
const getProduct = (slug: string) => {
  return unstable_cache(() => fetchProduct(slug), ["product", slug], {
    revalidate: 30,
  });
};

// Metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = await getProduct((await params).slug)();
  if (!product) {
    return {
      title: "Page Not Found",
      description:
        "We couldn't find the page you're looking for. It might have been moved or doesn't exist.",
    };
  }

  return {
    title: product.seo.metaTitle,
    description: product.seo.metaDescription,
    keywords: product.seo.keywords,
    robots: product.seo.metaRobots || "index, follow",
    alternates: {
      canonical:
        product.seo.canonicalURL ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
    },
    openGraph: {
      title: product.seo.openGraph?.ogTitle || product.seo.metaTitle,
      description:
        product.seo.openGraph?.ogDescription || product.seo.metaDescription,
      url:
        product.seo.openGraph?.ogURL ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.slug}`,
      images: {
        url:
          product.seo.openGraph?.ogImage?.url ||
          product.seo.metaImage?.url ||
          product.images[0]?.url,
        width:
          product.seo.openGraph?.ogImage?.width ||
          product.seo.metaImage?.width ||
          product.images[0]?.width ||
          undefined,
        height:
          product.seo.openGraph?.ogImage?.height ||
          product.seo.metaImage?.height ||
          product.images[0]?.height ||
          undefined,
        alt: product.seo.metaTitle || product.title,
      },
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo.openGraph?.ogTitle || product.seo.metaTitle,
      description:
        product.seo.openGraph?.ogDescription || product.seo.metaDescription,
      images: {
        url:
          product.seo.openGraph?.ogImage?.url ||
          product.seo.metaImage?.url ||
          product.images[0]?.url,
        width:
          product.seo.openGraph?.ogImage?.width ||
          product.seo.metaImage?.width ||
          product.images[0]?.width,
        height:
          product.seo.openGraph?.ogImage?.height ||
          product.seo.metaImage?.height ||
          product.images[0]?.height,
        alt: product.seo.metaTitle || product.title,
      },
    },
  };
}

// Page component
export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug)();

  if (!product) {
    return notFound();
  }

  return (
    <>
      <Header />
      <main>
        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 max-w-7xl mx-auto px-4 lg:px-5 py-5 lg:py-7">
          {/* Product gallery */}
          <div className="lg:w-1/2">
            <ProductMeidaGallery
              productTitle={product.title}
              images={product.images}
            />
          </div>
          {/* Product Info */}
          <div className="lg:w-1/2">
            <ProductInfo product={product} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
