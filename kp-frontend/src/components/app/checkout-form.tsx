"use client";
import React, { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { RiLock2Fill } from "@remixicon/react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import CountrySelect from "../ui/country-select";
import RegionSelect from "../ui/region-select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import axios from "axios";
import { useCheckoutStore } from "@/store/checkout";
import Stripe from "stripe";

type Props = {
  loading: boolean;
  // setLoading: (loading: boolean) => void;
};

export const checkoutFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email({
    error: (issue) =>
      issue.input ? "Invalid email address" : "Email is required",
  }),
  country: z.string("Country is required").min(1, "Country is required"),
  state: z.string("State is required").min(1, "State is required"),
  city: z
    .string()
    .min(3, "City must be at least 3 characters")
    .max(50, "City must be at most 50 characters"),
  zip: z
    .string()
    .regex(/^[0-9]+$/, "Zip Code can only contain numbers")
    .min(3, "Zip Code must be at least 3 digits")
    .max(10, "Zip Code must be at most 10 digits"),

  address: z.string().min(10, "Address must be at least 10 characters"),
});

type CheckoutForm = z.infer<typeof checkoutFormSchema>;

export default function CheckoutForm({ loading }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const { cart, clearCart, setCart } = useCartStore();
  const { intent: zIntent, setIntent } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
    shouldFocusError: false,
  });

  const stripe = useStripe();
  const elements = useElements();

  const handleCheckoutSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);
    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(submitError?.message || "An unexpected error occurred.");
      setSubmitting(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          name: data.name,
          email: data.email,
        },
      },
    });

    if (error || !paymentMethod) {
      toast.error(error?.message || "An unexpected error occurred.");
      setSubmitting(false);
      return;
    }

    try {
      const order = await axios.post("/api/checkout", {
        meta: data,
        cart,
        intentId: zIntent?.id,
        method: paymentMethod.id,
      });

      const intent: Stripe.Response<Stripe.PaymentIntent> = order.data.intent;

      if (intent.status === "succeeded") {
        toast.success("Payment successful! Redirecting...");
        clearCart();
        window.location.href = `/checkout/status?payment_intent=${intent.id}&payment_intent_client_secret=${intent.client_secret}`;
        return;
      }

      if (intent.status === "requires_action") {
        const { error: nextActionError, paymentIntent } =
          await stripe.handleNextAction({
            clientSecret: intent.client_secret || "",
          });

        if (nextActionError || !paymentIntent) {
          toast.error(
            nextActionError?.message || "An unexpected error occurred."
          );
          setSubmitting(false);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          toast.success("Payment successful! Redirecting...");
          clearCart();
          window.location.href = `/checkout/status?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}`;
          return;
        }
      }

      if (intent.status === "requires_payment_method") {
        toast.error("Payment failed. Please try another method.");
        setSubmitting(false);
        return;
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setCart(err.response.data.cart);
        setIntent(err.response.data.intent);
        toast.info(
          "Cart has been updated due to changes in product availability. Please try again."
        );
      } else {
        toast.error("Failed to create order. Please refresh or try again.");
      }
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  const handleCheckoutSubmitError = (err: FieldErrors<CheckoutForm>) => {
    toast.error(
      Object.values(err)[0]?.message || "Please fill all the fields correctly."
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handleCheckoutSubmit, handleCheckoutSubmitError)}
      className={`flex flex-col gap-3 font-montserrat px-4 md:px-5 lg:px-8 py-6 ${
        loading || submitting ? "pointer-events-none opacity-40" : ""
      }`}
    >
      {/* name */}
      <div className="flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="name">
          Name:
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          placeholder="Full Name"
          disabled={loading || submitting}
          className="p-2 outline-0 border-3 border-primary placeholder:text-gray-500 font-semibold w-full"
        />
      </div>
      {/* Email */}
      <div className="flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="email">
          Email:
        </label>
        <input
          {...register("email")}
          type="text"
          id="email"
          placeholder="Email Address"
          disabled={loading || submitting}
          className="p-2 outline-0 border-3 border-primary placeholder:text-gray-500 font-semibold w-full"
        />
      </div>
      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Country */}
        <div className="flex flex-col gap-0.5">
          <label className="font-semibold" htmlFor="country">
            Country:
          </label>
          <CountrySelect
            onChange={(value) => {
              setValue("country", value);
              setValue("state", undefined!);
            }}
            className="w-full !h-12 focus-visible:ring-0 border-3 border-primary focus-visible:border-primary cursor-pointer font-semibold"
          />
        </div>
        {/* State */}
        <div className="flex flex-col gap-0.5">
          <label className="font-semibold" htmlFor="state">
            State/Province:
          </label>
          <RegionSelect
            countryCode={watch("country")}
            onChange={(value) => {
              setValue("state", value);
            }}
            className="w-full !h-12 focus-visible:ring-0 border-3 border-primary focus-visible:border-primary cursor-pointer font-semibold"
          />
        </div>
        {/* City */}
        <div className="flex flex-col gap-0.5">
          <label className="font-semibold" htmlFor="city">
            City:
          </label>
          <input
            {...register("city")}
            type="text"
            id="city"
            placeholder="City"
            disabled={loading || submitting}
            className="p-2 outline-0 border-3 border-primary font-semibold placeholder:text-gray-500 w-full"
          />
        </div>
        {/* Zip code */}
        <div className="flex flex-col gap-0.5">
          <label className="font-semibold" htmlFor="zip">
            ZIP/Postal Code:
          </label>
          <input
            {...register("zip")}
            type="text"
            id="zip"
            placeholder="ZIP Code"
            disabled={loading || submitting}
            className="p-2 outline-0 border-3 border-primary font-semibold placeholder:text-gray-500 w-full"
          />
        </div>
        {/* Address */}
        <div className="flex flex-col gap-0.5 col-span-1 md:col-span-2">
          <label className="font-semibold" htmlFor="address">
            Address:
          </label>
          <input
            {...register("address")}
            type="text"
            id="address"
            placeholder="Street Address"
            disabled={loading || submitting}
            className="p-2 outline-0 border-3 border-primary font-semibold placeholder:text-gray-500 w-full"
          />
        </div>
      </div>
      {/* Payment */}
      <h2 className="text-xl lg:text-2xl font-semibold font-inter mt-2">
        Payment
      </h2>
      <PaymentElement />
      <Button type="submit" disabled={loading || submitting} className="mt-4">
        <RiLock2Fill className="stroke-3 mr-1 size-5" />
        {submitting ? "Processing..." : "Checkout"}
      </Button>
    </form>
  );
}
