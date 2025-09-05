"use client";
import { User } from "@/types/strapi";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useUser = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.jwt) {
        setUser(null);
        return;
      }

      const res = await api.get<User>("/users/me", {}, session.jwt);
      if (res.success && !res.data.blocked && res.data.confirmed) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [session]);

  return user;
};
