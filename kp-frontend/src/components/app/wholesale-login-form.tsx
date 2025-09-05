"use client";
import React from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { ChevronRight, Loader2Icon } from "lucide-react";
import Link from "next/link";

type WholesaleLoginFormData = {
  email: string;
  password: string;
};

export default function WholesaleLoginForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const { register, handleSubmit } = useForm<WholesaleLoginFormData>();

  // Form Handlers
  const handleLogin = async (data: WholesaleLoginFormData) => {
    setSubmitting(true);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.ok && !res.error && res.status < 400) {
      toast.success("Login successful!");
      return;
    }

    if (res?.error === "CredentialsSignin") {
      toast.error("Invalid email or password.");
    } else if (res?.error === "BLOCKED") {
      toast.error("Your account has been blocked.");
    } else if (res?.error === "NOT_CONFIRMED") {
      toast.error("Your account is not confirmed.");
    } else if (res?.error === "SERVER_ERROR") {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error("Login failed. Please try again.");
    }

    setSubmitting(false);
  };

  const handleInvalid = (err: FieldErrors<WholesaleLoginFormData>) => {
    toast.info(
      err.email?.message || err.password?.message || "Invalid form data"
    );
  };

  return (
    <div className="py-20">
      <div className="flex flex-col gap-5 lg:gap-7 max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-center uppercase">
          Wholesale Login
        </h1>
        <span className="text-base font-semibold inline-block uppercase">
          Brand Owners Get Wholesale Pricing on All Blank by KP Products. Sign
          Up Today. Its Fast and Free.
        </span>
        <form
          onSubmit={handleSubmit(handleLogin, handleInvalid)}
          className="flex flex-col gap-6 relative"
        >
          <div>
            <label
              className={`text-xl font-semibold uppercase inline-block mb-1.5 ${
                submitting ? "opacity-60" : ""
              }`}
              htmlFor="login-email"
            >
              Email:
            </label>
            <Input
              className="ring-[3px] ring-primary/80 focus-visible:ring-primary border-0 !text-lg font-semibold ml-1 w-[calc(100%-7px)]"
              type="email"
              id="login-email"
              disabled={submitting}
              {...register("email", {
                required: "email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          <div>
            <label
              className={`text-xl font-semibold uppercase inline-block mb-1.5 ${
                submitting ? "opacity-60" : ""
              }`}
              htmlFor="login-password"
            >
              Password:
            </label>
            <Input
              className="ring-[3px] ring-primary/80 focus-visible:ring-primary border-0 !text-lg font-semibold ml-1 w-[calc(100%-7px)]"
              type="password"
              id="login-password"
              disabled={submitting}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Invalid password format",
                },
              })}
            />
          </div>
          <Button
            className="!text-2xl font-bold uppercase mt-2 min-w-3xs mx-auto"
            disabled={submitting}
            type="submit"
          >
            {submitting ? (
              <Loader2Icon className="animate-spin !size-6" strokeWidth={2} />
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <Link
          href="/wholesale/register"
          className="flex items-center gap-2 text-xl font-bold uppercase w-fit mx-auto mt-3"
        >
          <span>Sign up</span> <ChevronRight strokeWidth={3} />
        </Link>
      </div>
    </div>
  );
}
