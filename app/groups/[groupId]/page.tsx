import { Download, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AmountBubble, Button, Card, Pill } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { ExpenseCard } from "@/components/expense-card";
import { MemberAvatarStack } from "@/components/member-avatar-stack";
import { inviteFriends } from "@/lib/group-actions";
import { getCurrentUserGroup } from "@/lib/group-queries";
import { formatMoney } from "@/lib/money";
import { markSettlementPaid } from "@/lib/settlement-actions";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const group = await getCurrentUserGroup(groupId);

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

  const inviteFriendsForGroup = inviteFriends.bind(null, group.id);
  const memberById = new Map(group.members.map((member) => [member.id, member]));
  const groupExpenses = group.expenses.map((expense) => ({
    amountCents: expense.amountCents,
    category: expense.category?.name ?? "Expense",
    date: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(expense.expenseDate),
    id: expense.id,
    paidByName: expense.paidBy.name,
    paidByUserId: expense.paidByUserId,
    title: expense.title,
    tone: "bg-mint"
  }));

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
              <MemberAvatarStack members={group.members} size="lg" />
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
              {group.settlementSuggestions.length ? (
                group.settlementSuggestions.map((settlement) => (
                  <article className="rounded-[1.5rem] border border-line bg-white p-4" key={`${settlement.fromUserId}-${settlement.toUserId}`}>
                    <p className="text-sm font-bold">
                      {memberById.get(settlement.fromUserId)?.name ?? "Member"} pays{" "}
                      {memberById.get(settlement.toUserId)?.name ?? "Member"}
                    </p>
                    <p className="mt-1 text-2xl font-black">{formatMoney(settlement.amountCents)}</p>
                    <form action={markSettlementPaid} className="mt-4">
                      <input name="amountCents" type="hidden" value={settlement.amountCents} />
                      <input name="fromUserId" type="hidden" value={settlement.fromUserId} />
                      <input name="groupId" type="hidden" value={group.id} />
                      <input name="toUserId" type="hidden" value={settlement.toUserId} />
                      <button className="focus-ring inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-pill bg-ink px-4 py-2 text-sm font-semibold text-white" type="submit">
                        Mark settled
                      </button>
                    </form>
                  </article>
                ))
              ) : (
                <p className="rounded-[1.5rem] border border-line bg-white p-4 text-sm font-semibold text-ink/55">
                  No suggested transfers yet.
                </p>
              )}
            </div>
          </Card>
          <Card>
            <Pill>Settlement history</Pill>
            <div className="mt-5 grid gap-2">
              {group.settlements.length ? (
                group.settlements.map((settlement) => (
                  <div className="rounded-[1.25rem] border border-line bg-white p-3 text-sm font-semibold" key={settlement.id}>
                    {settlement.fromUser.name} paid {settlement.toUser.name}
                    <span className="ml-2 font-black">{formatMoney(settlement.amountCents)}</span>
                  </div>
                ))
              ) : (
                <p className="rounded-[1.25rem] border border-line bg-white p-3 text-sm font-semibold text-ink/55">
                  No settlements recorded yet.
                </p>
              )}
            </div>
          </Card>
          <Card>
            <Pill>Members</Pill>
            <div className="mt-5 flex items-center justify-between">
              <MemberAvatarStack members={group.members} size="lg" />
              <Pill>{group.members.length} people</Pill>
            </div>
          </Card>
          <Card>
            <Pill>Invitations</Pill>
            <h2 className="mt-3 text-2xl font-black">Invite friends</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Add emails here to create pending invitations for this group.
            </p>
            <form action={inviteFriendsForGroup} className="mt-5 grid gap-3">
              <textarea
                className="min-h-24 rounded-[1.25rem] border border-line bg-white px-4 py-3 text-sm outline-none"
                name="inviteEmails"
                placeholder="friend@example.com, another@example.com"
              />
              <Button>
                <Send className="h-4 w-4" />
                Invite
              </Button>
            </form>
            <div className="mt-5 grid gap-2">
              {group.invitations.length ? (
                group.invitations.map((invitation) => (
                  <div className="rounded-[1.25rem] border border-line bg-white p-3 text-sm font-semibold" key={invitation.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span>{invitation.email}</span>
                      <Pill className="px-3 py-1 text-xs">
                        {invitation.accepted ? "accepted" : invitation.deliveryStatus}
                      </Pill>
                    </div>
                    {invitation.deliveryError ? (
                      <p className="mt-2 text-xs leading-5 text-rose-950">
                        Email failed: {invitation.deliveryError.slice(0, 160)}
                      </p>
                    ) : null}
                    <p className="mt-2 break-all text-xs text-ink/50">
                      Invite link: {(process.env.APP_BASE_URL ?? "http://localhost:3000")}/invite/{invitation.token}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-[1.25rem] border border-line bg-white p-3 text-sm font-semibold text-ink/55">
                  No pending invites.
                </p>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
