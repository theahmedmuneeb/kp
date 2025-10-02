import React from "react";
import { api } from "@/utils/api";
import { WholesalePage } from "@/types/strapi";
import { meta } from "@/lib/meta";
import { Metadata } from "next";
import WholesaleLoginForm from "@/components/app/wholesale-login-form";
import WholesaleDashboard from "@/components/app/wholesale-dashboard";
import { getUser } from "@/lib/fetch";
import { unstable_cache } from "next/cache";

export const revalidate = false;

async function fetchWholesale() {
  const { success, data: wholesalePage } = await api.get<WholesalePage>(
    `/wholesale?populate=seo.openGraph`
  );

  if (!success || !wholesalePage.data) {
    throw new Error("Failed to fetch wholesale page");
  }

  return wholesalePage;
}

const getPage = unstable_cache(fetchWholesale, ["wholesale-page"], {
  revalidate: false,
});

export const generateMetadata = async (): Promise<Metadata> => {
  const page = await getPage();
  return meta(page.data.seo, "wholesale");
};

export default async function Wholesale() {
  const page = await getPage();
  const user = await getUser();

  return (
    <main>
      {!user ? (
        <WholesaleLoginForm page={page} />
      ) : (
        <WholesaleDashboard user={user} />
      )}
    </main>
  );
}
