import { CheckCircle2, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { Button, Card, Pill } from "@/components/ui";
import { getMember, settlementSuggestions } from "@/lib/data";
import { formatMoney } from "@/lib/money";

export default function SettlementsPage() {
  return (
    <AppShell title="Settlements">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Pill active>Minimum transfer plan</Pill>
              <h2 className="mt-3 text-2xl font-black">Settle everything in {settlementSuggestions.length} moves</h2>
            </div>
            <Button>
              <Send className="h-4 w-4" />
              Send reminders
            </Button>
          </div>
          <div className="mt-6 grid gap-3">
            {settlementSuggestions.length ? (
              settlementSuggestions.map((suggestion) => {
                const from = getMember(suggestion.fromUserId);
                const to = getMember(suggestion.toUserId);
                return (
                  <article className="hover-lift flex flex-col gap-4 rounded-[1.5rem] border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between" key={`${from.id}-${to.id}`}>
                    <div>
                      <p className="text-sm text-ink/55">{from.name} pays {to.name}</p>
                      <p className="mt-1 text-2xl font-black">{formatMoney(suggestion.amountCents)}</p>
                    </div>
                    <Pill>Pending</Pill>
                  </article>
                );
              })
            ) : (
              <EmptyState
                description="Settlements will be calculated once real expenses and balances exist."
                title="No settlements yet"
              />
            )}
          </div>
        </Card>
        <Card>
          <Pill>History</Pill>
          <div className="mt-5 grid gap-3">
            <div className="flex items-center gap-3 rounded-[1.5rem] border border-line bg-white p-4">
              <CheckCircle2 className="h-5 w-5 text-ink/35" />
              <span className="text-sm font-semibold text-ink/55">No settlement history yet.</span>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
