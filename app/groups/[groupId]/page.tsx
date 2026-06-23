import { Download, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AmountBubble, Button, Card, Pill } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { ExpenseCard } from "@/components/expense-card";
import { MemberAvatarStack } from "@/components/member-avatar-stack";
import { expenses, getGroup, settlementSuggestions } from "@/lib/data";
import { formatMoney } from "@/lib/money";

export default async function GroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const group = getGroup(groupId);

  if (!group) {
    return (
      <AppShell title="Group">
        <EmptyState
          actionHref="/groups"
          actionLabel="Back to groups"
          description="Create or fetch a real group before opening its detail page."
          title="Group not found"
        />
      </AppShell>
    );
  }

  const groupExpenses = expenses.filter((expense) => expense.groupId === group.id);

  return (
    <AppShell title={group.name}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="grid gap-5">
          <Card className="bubble-field">
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Pill active>{group.category}</Pill>
                <h2 className="mt-5 text-4xl font-black tracking-normal">{group.name}</h2>
                <p className="mt-2 text-ink/60">{formatMoney(group.totalCents)} in tracked spending this month.</p>
              </div>
              <MemberAvatarStack ids={group.members} size="lg" />
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            <AmountBubble label="Total spend" tone={group.tone} value={formatMoney(group.totalCents)} />
            <AmountBubble label="Your balance" tone="bg-mint" value={formatMoney(group.balanceCents)} />
            <AmountBubble label="Open bills" tone="bg-butter" value={String(groupExpenses.length)} />
          </div>
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Pill>Expenses</Pill>
                <h2 className="mt-3 text-2xl font-black">Group history</h2>
              </div>
              <Button variant="secondary">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
            <div className="mt-5 grid gap-3">
              {groupExpenses.length ? (
                groupExpenses.map((expense) => <ExpenseCard {...expense} key={expense.id} />)
              ) : (
                <EmptyState
                  actionHref="/expenses/new"
                  actionLabel="Add expense"
                  description="This group has no expenses yet."
                  title="No group expenses"
                />
              )}
            </div>
          </Card>
        </section>

        <aside className="grid gap-5">
          <Card>
            <Pill>Settlements</Pill>
            <h2 className="mt-3 text-2xl font-black">Suggested transfers</h2>
            <div className="mt-5 grid gap-3">
              {settlementSuggestions.length ? (
                settlementSuggestions.slice(0, 3).map((settlement) => (
                  <article className="rounded-[1.5rem] border border-line bg-white p-4" key={`${settlement.fromUserId}-${settlement.toUserId}`}>
                    <p className="text-sm font-bold">{settlement.fromUserId} pays {settlement.toUserId}</p>
                    <p className="mt-1 text-2xl font-black">{formatMoney(settlement.amountCents)}</p>
                  </article>
                ))
              ) : (
                <p className="rounded-[1.5rem] border border-line bg-white p-4 text-sm font-semibold text-ink/55">
                  No suggested transfers yet.
                </p>
              )}
            </div>
            <Button className="mt-5 w-full">
              <Send className="h-4 w-4" />
              Settle up
            </Button>
          </Card>
          <Card>
            <Pill>Members</Pill>
            <div className="mt-5 flex items-center justify-between">
              <MemberAvatarStack ids={group.members} size="lg" />
              <Pill>{group.members.length} people</Pill>
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
