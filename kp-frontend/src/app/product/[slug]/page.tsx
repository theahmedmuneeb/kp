import React from "react";
import Header from "@/components/app/header";
import Footer from "@/components/app/footer";
import { ProductPage } from "@/types/strapi";
import { api, ApiResponse } from "@/utils/api";
import { notFound } from "next/navigation";
import ProductMeidaGallery from "@/components/product/product-media-gallery";
import ProductInfo from "@/components/product/product-info";

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { success, data: productsData } = (await api.get(
    `/products?filters[slug][$eq]=${slug}&limit=1&populate=images&populate=sizes&populate=sizes.wholesale&populate=variants&populate=variants.images&populate=wholesale&populate=additional&populate=additional.sizeChart`
  )) as ApiResponse<ProductPage>;

  if (!success || !productsData.data || !Array.isArray(productsData.data)) {
    throw new Error("Failed to fetch product");
  }
  const product = productsData.data[0];
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
