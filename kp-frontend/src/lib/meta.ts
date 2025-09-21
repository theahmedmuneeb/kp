import { Seo } from "@/types/strapi";
import { Metadata } from "next";
import { useGlobals } from "./fetch";

export const meta = async (config: Seo, path: string): Promise<Metadata> => {
    const globals = await useGlobals();

    return {
        title: config.metaTitle,
        description: config.metaDescription,
        keywords: config.keywords,
        robots: config.metaRobots || "index, follow",
        alternates: {
            canonical: config.canonicalURL || `${process.env.NEXT_PUBLIC_SITE_URL}${path ? `/${path}` : ""}`,
        },
        openGraph: {
            title: config.openGraph?.ogTitle || config.metaTitle,
            description: config.openGraph?.ogDescription || config.metaDescription,
            url: config.openGraph?.ogURL || `${process.env.NEXT_PUBLIC_SITE_URL}${path ? `/${path}` : ""}`,
            images: {
                url: config.openGraph?.ogImage?.url || config.metaImage?.url || globals.data.logo.url,
                width: config.openGraph?.ogImage?.width || config.metaImage?.width || globals.data.logo.width || undefined,
                height: config.openGraph?.ogImage?.height || config.metaImage?.height || globals.data.logo.height || undefined,
                alt: config.openGraph?.ogImage?.alternativeText || config.metaImage?.alternativeText || globals.data.logo.alternativeText || "",
            },
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: config.openGraph?.ogTitle || config.metaTitle,
            description: config.openGraph?.ogDescription || config.metaDescription,
            images: {
                url: config.openGraph?.ogImage?.url || config.metaImage?.url || globals.data.logo.url,
                width: config.openGraph?.ogImage?.width || config.metaImage?.width || globals.data.logo.width || undefined,
                height: config.openGraph?.ogImage?.height || config.metaImage?.height || globals.data.logo.height || undefined,
                alt: config.openGraph?.ogImage?.alternativeText || config.metaImage?.alternativeText || globals.data.logo.alternativeText || "",
            }
        },
    };
}