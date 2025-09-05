"use client";
import React from "react";
import WholesaleLoginForm from "./wholesale-login-form";
import { signOut } from "next-auth/react";
import { useUser } from "@/hooks/useUser";

export default function WholesaleDashboard({}) {
  const user = useUser();
  if (!user) return <WholesaleLoginForm />;
  return (
    <div>
      Welcome {user.username}{" "}
      <button onClick={() => signOut({ redirect: false })}>Logout</button>
    </div>
  );
}
