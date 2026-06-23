import { ArrowRight, Check, ReceiptText, Sparkles, UsersRound } from "lucide-react";
import Link from "next/link";
import { AmountBubble, Card, Pill } from "@/components/ui";

const trust = ["Roommates", "Trips", "Couples", "Teams"];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl content-between gap-10 rounded-[2.5rem] border border-line bg-cloud/80 p-5 shadow-soft sm:p-8">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-lg font-black text-white">E</span>
            <span className="text-xl font-black">Evenly</span>
          </Link>
          <div className="hidden flex-wrap gap-2 md:flex">
            {trust.map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(23,23,23,0.18)]"
            href="/sign-in"
          >
            Open app
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Pill active>Splitwise-style expense sharing</Pill>
            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-normal text-ink sm:text-6xl lg:text-7xl">
              Evenly
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-ink/65">
              A soft, social finance workspace for splitting bills, tracking balances, and settling up with less friction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-4 text-sm font-semibold text-white" href="/sign-in">
                Open app
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="inline-flex items-center rounded-pill border border-line bg-white px-6 py-4 text-sm font-semibold" href="/expenses/new">
                Add expense
              </Link>
            </div>
          </div>

          <div className="bubble-field grid gap-4 rounded-[2.25rem] border border-line bg-paper p-4 sm:grid-cols-[0.95fr_1.05fr]">
            <div className="relative z-10 grid gap-4">
              <AmountBubble label="You are owed" tone="bg-mint" value="₹0.00" />
              <AmountBubble label="You owe" tone="bg-rose" value="₹0.00" />
            </div>
            <Card className="relative z-10 p-4">
              <div className="flex items-center justify-between">
                <Pill>Live preview</Pill>
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="mt-5 grid gap-3">
                <article className="rounded-[1.5rem] border border-dashed border-line bg-white/75 p-5">
                  <Pill>No records yet</Pill>
                  <h2 className="mt-5 text-2xl font-black">Ready for real groups</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    Expenses and balances will appear here once your database-backed flows are connected.
                  </p>
                </article>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 pb-2 md:grid-cols-3">
          {[
            ["Multi-method splits", "Equal, custom, percentage, and share-based bills.", ReceiptText],
            ["Group balance clarity", "See who owes whom across homes, trips, and dinners.", UsersRound],
            ["Fast settlements", "Minimum-transfer suggestions keep everyone square.", Check]
          ].map(([title, copy, Icon]) => (
            <article className="rounded-[1.75rem] border border-line bg-white/70 p-5" key={title as string}>
              <Icon className="h-5 w-5" />
              <h2 className="mt-5 text-lg font-black">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">{copy as string}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
