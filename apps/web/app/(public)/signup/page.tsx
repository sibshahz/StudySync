import { GraduationCap } from "lucide-react";
import Link from "next/link";
import SignUpForm from "@/components/auth/sign-up-form";

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-bold">StudySync</span>
        </Link>
        <SignUpForm />
      </div>
    </div>
  );
}
