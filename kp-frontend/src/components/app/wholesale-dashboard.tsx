"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { Loader2, LogOut } from "lucide-react";

export default function WholesaleDashboard({
  user,
}: {
  user: { email: string };
}) {
  const [loggingOut, setLoggingOut] = React.useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 py-7 lg:px-20 lg:py-28 uppercase">
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl font-semibold font-montserrat">
          You are logged in as
        </span>
        <span className="md:text-xl font-medium font-montserrat">
          {user.email}
        </span>
      </div>
      <Button
        onClick={() => {
          signOut({ redirect: true, callbackUrl: "/wholesale" });
          setLoggingOut(true);
        }}
        className="mt-10 uppercase"
        variant="destructive"
        disabled={loggingOut}
      >
        {!loggingOut ? (
          <>
            <LogOut strokeWidth={3} className="size-5" /> Logout
          </>
        ) : (
          <><Loader2 strokeWidth={3} className="size-5 animate-spin" /> Logging out...</>
        )}
      </Button>
    </div>
  );
}
