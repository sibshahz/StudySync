"use client";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { getUserToken } from "@/app/actions/user";
import { postLogout } from "@/lib/api/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const token = await getUserToken();

      if (!user && !token) {
        setUser(null);
        router.replace("/login");
      }
    };
    getData();
  }, [user]);

  return <div>{children}</div>;
};

export default AuthLayout;
