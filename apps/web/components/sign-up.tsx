"use client"

import { useActionState, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signUp } from "../actions/auth"

export default function SignUp() {
  const [state, action, isPending] = useActionState(signUp, null)
  const [hasReferral, setHasReferral] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">Create your account to get started</CardDescription>
        </CardHeader>
        <form action={action}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasReferral"
                name="hasReferral"
                checked={hasReferral}
                onCheckedChange={(checked) => setHasReferral(checked as boolean)}
              />
              <Label htmlFor="hasReferral" className="text-sm">
                I have a referral code
              </Label>
            </div>

            {hasReferral && (
              <div className="space-y-2">
                <Label htmlFor="signUpCode">Sign Up Code</Label>
                <Input
                  id="signUpCode"
                  name="signUpCode"
                  type="text"
                  placeholder="Enter your referral code"
                  required={hasReferral}
                />
              </div>
            )}

            {state && (
              <div className={`text-sm text-center ${state.success ? "text-green-600" : "text-red-600"}`}>
                {state.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating Account..." : "Sign Up"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
