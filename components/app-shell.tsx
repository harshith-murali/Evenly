import {
  CreditCard,
  Home,
  LogOut,
  Plus,
  Settings,
  UsersRound
} from "lucide-react";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Pill } from "@/components/ui";
import { settlementSuggestions } from "@/lib/data";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/groups", label: "Groups", icon: UsersRound },
  { href: "/expenses/new", label: "Add expense", icon: Plus },
  { href: "/settlements", label: "Settlements", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] rounded-[2rem] border border-line bg-cloud p-5 shadow-soft lg:flex lg:flex-col">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-lg font-black text-white">E</span>
            <span className="text-xl font-black">Evenly</span>
          </Link>
          <nav className="mt-10 grid gap-2">
            {nav.map((item) => (
              <Link
                className="focus-ring flex items-center gap-3 rounded-pill px-4 py-3 text-sm font-semibold text-ink/70 transition hover:bg-white hover:text-ink"
                href={item.href}
                key={item.href}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto rounded-[1.5rem] bg-paper p-4">
            <p className="text-sm font-bold">June settles cleanly</p>
            <p className="mt-1 text-sm text-ink/60">
              {settlementSuggestions.length
                ? `${settlementSuggestions.length} suggested transfers can close every group balance.`
                : "No open settlements yet."}
            </p>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="mb-5 flex flex-col gap-4 rounded-[2rem] border border-line bg-cloud/90 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Pill className="px-3 py-1 text-xs">Personal workspace</Pill>
              <h1 className="mt-3 text-3xl font-black tracking-normal text-ink sm:text-4xl">{title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(23,23,23,0.18)] transition hover:-translate-y-0.5 sm:min-w-36"
                href="/expenses/new"
              >
                <Plus className="h-4 w-4" />
                Add expense
              </Link>
              <SignOutButton redirectUrl="/sign-in">
                <button className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-pill border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </SignOutButton>
              <div className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white">
                <UserButton
                  userProfileUrl="/settings"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9"
                    }
                  }}
                />
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-20 grid grid-cols-5 rounded-pill border border-line bg-cloud/95 p-2 shadow-soft backdrop-blur lg:hidden">
        {nav.map((item) => (
          <Link className="grid place-items-center rounded-pill px-2 py-3 text-xs font-semibold" href={item.href} key={item.href}>
            <item.icon className="h-4 w-4" />
            <span className="sr-only">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
