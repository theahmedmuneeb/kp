import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGlobals } from "@/lib/fetch";
import { api } from "@/utils/api";
import { Check, Package, Timer, Truck, X } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Order Details",
  description: "Order details page",
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: Props) {
  const orderId = (await params).id;
  const globals = await useGlobals();

  const {
    success,
    status,
    data: orderData,
    message,
  } = await api.get<any>(`/orders/${orderId}`);

  if (!success || !orderData || !orderData.data) {
    if (status === 404) {
      return (
        <main className="bg-background text-lg min-h-screen flex items-center justify-center text-center p-5 lg:p-7">
          <p>
            We couldn’t find any order matching this order ID. If you just
            completed a payment, please check back shortly and{" "}
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
    return (
      <main className="bg-background text-lg text-destructive min-h-screen flex justify-center items-center px-5 lg:px-7">
        Something went wrong
      </main>
    );
  }

  const order = orderData.data;

  return (
    <main className="bg-background min-h-screen flex justify-center items-center p-5 lg:p-7">
      <Card
        className={`bg-background border-2 shadow-none w-full max-w-md my-6 lg:my-10 relative ${
          order.orderStatus === "pending"
            ? "border-yellow-500"
            : order.orderStatus === "failed"
            ? "border-destructive"
            : ["received", "processing", "shipped", "completed"].includes(
                order.orderStatus
              )
            ? "border-green-500"
            : "border-primary"
        }`}
      >
        <CardHeader className="text-center text-base lg:text-xl font-semibold">
          ID: {orderId}
        </CardHeader>
        <CardContent className="font-montserrat">
          <div className="space-y-2">
            {order.json &&
              Array.isArray(order.json) &&
              order.json.length > 0 && (
                <div className="">
                  <h2 className="font-semibold text-lg mb-2">Products</h2>
                  {order.json.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center gap-3 border-b border-b-muted/50 pb-2"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={item.image.url}
                          alt={item.title}
                          width={60}
                          height={60}
                          className="object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm md:text-base font-medium break-all">
                            {item.title} ({item.size.title})
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {item.quantity} x ${item.price}
                          </span>
                        </div>
                      </div>
                      <span className="text-muted-foreground">
                        ${item.total}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            <div className="flex justify-between">
              <span className="font-medium">Status</span>
              <span className="text-muted-foreground">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-muted-foreground">${order.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Shipping</span>
              <span className="text-muted-foreground">
                ${order.deliveryCharges}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount Paid</span>
              <span className="text-muted-foreground">${order.amountPaid}</span>
            </div>
            {order.trackingId && (
              <div className="flex justify-between">
                <span className="font-medium">Tracking ID</span>
                <span className="text-muted-foreground">
                  {order.trackingId}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Created At</span>
              <span className="text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          {order.orderStatus === "pending" && (
            <p className="mt-4 text-sm text-yellow-600 text-center">
              Awaiting payment. If you’ve just paid, please{" "}
              <a href="" className="text-blue-500 underline">
                refresh
              </a>{" "}
              the page to check the latest status. If the issue continues,{" "}
              <a
                href={`mailto:${globals.data.email}`}
                className="text-blue-500 underline"
              >
                contact our support team
              </a>
              .
            </p>
          )}
        </CardContent>
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-background rounded-full border-2 w-16 h-16 flex items-center justify-center ${
            ["received", "processing", "shipped", "completed"].includes(
              order.orderStatus
            )
              ? "text-green-500 border-green-500 "
              : order.orderStatus === "pending"
              ? "text-yellow-500 border-yellow-500"
              : order.orderStatus === "failed"
              ? "text-destructive border-destructive"
              : "text-primary border-primary"
          }`}
        >
          {["completed", "processing", "received"].includes(
            order.orderStatus
          ) ? (
            <Check className="size-7" />
          ) : order.orderStatus === "shipped" ? (
            <Truck className="size-7" />
          ) : order.orderStatus === "pending" ? (
            <Timer className="size-7" />
          ) : order.orderStatus === "failed" ? (
            <X className="size-7" />
          ) : (
            <Package className="size-7" />
          )}
        </div>
      </Card>
    </main>
  );
}
