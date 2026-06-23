import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Card, Pill } from "@/components/ui";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bubble-field min-h-[560px]">
          <div className="relative z-10">
            <Link className="flex items-center gap-3" href="/">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-lg font-black text-white">E</span>
              <span className="text-xl font-black">Evenly</span>
            </Link>
            <Pill active className="mt-10">Clerk authentication</Pill>
            <h1 className="mt-6 max-w-md text-5xl font-black tracking-normal">Sign in to Evenly</h1>
            <p className="mt-4 max-w-md text-lg leading-7 text-ink/65">
              Use your Clerk account to keep groups, expenses, and settlements attached to a real profile.
            </p>
          </div>
        </Card>
        <Card className="flex items-center justify-center">
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
        </Card>
      </div>
    </main>
  );
}
