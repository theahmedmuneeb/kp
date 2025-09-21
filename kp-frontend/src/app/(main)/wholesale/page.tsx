import React from "react";
import { getUser } from "@/lib/fetch";
import WholesaleLoginForm from "@/components/app/wholesale-login-form";
import WholesaleDashboard from "@/components/app/wholesale-dashboard";
import { api } from "@/utils/api";
import { WholesalePage } from "@/types/strapi";
import { meta } from "@/lib/meta";
import { Metadata } from "next";

async function fetchWholesale() {
  const { success, data: page } = await api.get<WholesalePage>(
    `/wholesale?populate=seo.openGraph`
  );

  if (!success || !page.data) {
    throw new Error("Failed to fetch wholesale page");
  }

  return page;
}

export const generateMetadata = async (): Promise<Metadata> => {
  const page = await fetchWholesale();
  return meta(page.data.seo, "wholesale");
}

export default async function Wholesale() {
  const page = await fetchWholesale();
  const user = await getUser();

  return (
    <main>
      {!user ? <WholesaleLoginForm page={page} /> : <WholesaleDashboard user={user} />}
    </main>
  );
}
