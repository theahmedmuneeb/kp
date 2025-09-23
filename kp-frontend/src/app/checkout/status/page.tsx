import React from "react";
import { api } from "@/utils/api";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { useGlobals } from "@/lib/fetch";

export const metadata: Metadata = {
  title: "Checkout Status",
  description: "Checkout status page",
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: Props) {
  const intent = (await searchParams).payment_intent;
  const globals = await useGlobals();

  if (!intent || typeof intent !== "string") {
    return (
      <main className="text-lg text-destructive min-h-screen flex items-center justify-center text-center p-5 lg:p-7">
        Invalid Request
      </main>
    );
  }

  const { success, data: orderData } = await api.get<any>(
    `/orders?filters[intent][$eq]=${intent}&fields=documentId`
  );

  if (!success || !orderData || !orderData.data) {
    return (
      <main className="text-lg min-h-screen flex items-center justify-center text-center p-5 lg:p-7">
        <p>
          Something went wrong. Please try again later or&nbsp;
          <a href="" className="text-blue-600 underline">
            refresh the page
          </a>
          .
        </p>
      </main>
    );
  }

  if (orderData.data.length === 0) {
    return (
      <main className="text-lg min-h-screen flex items-center justify-center text-center p-5 lg:p-7">
        <p>
          We couldn’t find any order matching this payment request. If you just
          completed a payment, please wait a few minutes and{" "}
          <a href="" className="text-blue-600 underline">
            refresh the page
          </a>
          . If the issue continues, feel free to reach out to our support team
          at{" "}
          <a
            href={`mailto:${globals.data.email}`}
            className="text-blue-600 underline"
          >
            {globals.data.email}
          </a>
          .
        </p>
      </main>
    );
  }

  const order = orderData?.data[0];
  redirect(`/order/${order.documentId}`);
}
