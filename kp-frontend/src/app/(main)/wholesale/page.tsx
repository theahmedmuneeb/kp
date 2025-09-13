import React from "react";
import { getUser } from "@/lib/fetch";
import WholesaleLoginForm from "@/components/app/wholesale-login-form";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import WholesaleDashboard from "@/components/app/wholesale-dashboard";

export default async function Wholesale() {
  const user = await getUser();

  return (
    <main>
      {!user ? (
        <WholesaleLoginForm />
      ) : (
        <WholesaleDashboard user={user} />
      )}
    </main>
  );
}
