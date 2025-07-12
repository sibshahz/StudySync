"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postLogin } from "@/lib/api/auth";
import { redirect, useRouter } from "next/navigation";
import { useAuth, User } from "./auth-provider";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { user, setUser } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const router = useRouter();
  React.useEffect(() => {
    if (user !== null) {
      router.refresh(); // Refresh state
      router.push("/dashboard");
    }
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const result: any = await postLogin({ email, password });
    console.log("Result: ", result);

    if (result.status !== 200) {
      setUser(null);
      setErrorMessage(
        result.data?.message || "Login failed. Please try again."
      );
      return;
    } else {
      setUser(result.data as User);
      setErrorMessage(null);
      console.log("Login successful:", result.data);
      router.refresh();
      router.replace("/dashboard"); // Redirect client-side
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
