import { CheckCircle2, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { Button, Card, Pill } from "@/components/ui";
import { getCurrentUserSettlementOverview } from "@/lib/group-queries";
import { formatMoney } from "@/lib/money";
import { markSettlementPaid } from "@/lib/settlement-actions";

export const dynamic = "force-dynamic";

export default async function SettlementsPage() {
  const { settlements, suggestions } = await getCurrentUserSettlementOverview();

  return (
    <AppShell title="Settlements">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Pill active>Minimum transfer plan</Pill>
              <h2 className="mt-3 text-2xl font-black">Settle everything in {suggestions.length} moves</h2>
            </div>
            <Button>
              <Send className="h-4 w-4" />
              Send reminders
            </Button>
          </div>
          <div className="mt-6 grid gap-3">
            {suggestions.length ? (
              suggestions.map((suggestion) => (
                <article className="hover-lift flex flex-col gap-4 rounded-[1.5rem] border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between" key={`${suggestion.groupId}-${suggestion.fromUserId}-${suggestion.toUserId}`}>
                  <div>
                    <p className="text-sm text-ink/55">{suggestion.groupName}</p>
                    <p className="font-bold">{suggestion.fromName} pays {suggestion.toName}</p>
                    <p className="mt-1 text-2xl font-black">{formatMoney(suggestion.amountCents)}</p>
                  </div>
                  <form action={markSettlementPaid}>
                    <input name="amountCents" type="hidden" value={suggestion.amountCents} />
                    <input name="fromUserId" type="hidden" value={suggestion.fromUserId} />
                    <input name="groupId" type="hidden" value={suggestion.groupId} />
                    <input name="toUserId" type="hidden" value={suggestion.toUserId} />
                    <button className="focus-ring inline-flex min-h-10 items-center justify-center rounded-pill bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
                      Mark settled
                    </button>
                  </form>
                </article>
              ))
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
            {settlements.length ? (
              settlements.map((settlement) => (
                <div className="flex items-center gap-3 rounded-[1.5rem] border border-line bg-white p-4" key={settlement.id}>
                  <CheckCircle2 className="h-5 w-5 text-ink" />
                  <span className="text-sm font-semibold">
                    {settlement.fromName} paid {settlement.toName} {formatMoney(settlement.amountCents)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 rounded-[1.5rem] border border-line bg-white p-4">
                <CheckCircle2 className="h-5 w-5 text-ink/35" />
                <span className="text-sm font-semibold text-ink/55">No settlement history yet.</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
