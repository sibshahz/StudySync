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
import { redirect } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postRegister } from "@/lib/api/auth";
import { useAuth, User } from "./auth-provider";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const { setUser } = useAuth();

  React.useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError(true);
      console.log("Passwords do not match");
    } else {
      setError(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (error) {
      return;
    } else {
      const result: any = await postRegister({
        email,
        password,
        confirmPassword,
      });
      if (result.status !== 201) {
        console.error("Failed to signup:", result);
        return;
      } else {
        setUser(result.data as User);
        console.log("SIGNEDUP: ", result.data);
        redirect("/dashboard");
      }
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
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                  </div>
                  <Input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirm-password"
                    type="password"
                    required
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm">
                    Passwords do not match.
                  </div>
                )}
                <Button type="submit" className="w-full">
                  Signup
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Sign in
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
