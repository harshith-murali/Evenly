import { Download, Plus } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AmountBubble, Button, Card, Pill } from "@/components/ui";
import { CategoryChart } from "@/components/category-chart";
import { EmptyState } from "@/components/empty-state";
import { ExpenseCard } from "@/components/expense-card";
import { GroupCard } from "@/components/group-card";
import { activity } from "@/lib/data";
import { getCurrentUserGroups, getCurrentUserRecentExpenses } from "@/lib/group-queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const groups = await getCurrentUserGroups();
  const expenses = await getCurrentUserRecentExpenses();

  return (
    <AppShell title="Dashboard">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <AmountBubble label="You are owed" tone="bg-mint" value="₹0.00" />
            <AmountBubble label="You owe" tone="bg-rose" value="₹0.00" />
            <AmountBubble label="Active groups" tone="bg-sky" value={String(groups.length)} />
          </div>
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Pill>Recent expenses</Pill>
                <h2 className="mt-3 text-2xl font-black">Latest activity</h2>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary">
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
                <Link className="inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-white" href="/expenses/new">
                  <Plus className="h-4 w-4" />
                  Add
                </Link>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {expenses.length ? (
                expenses.map((expense) => <ExpenseCard {...expense} key={expense.id} />)
              ) : (
                <EmptyState
                  actionHref="/expenses/new"
                  actionLabel="Add expense"
                  description="New expenses will appear here after you connect real group and expense data."
                  title="No expenses yet"
                />
              )}
            </div>
          </Card>
          <div className="grid gap-5 md:grid-cols-2">
            {groups.length ? (
              groups.map((group) => <GroupCard {...group} key={group.id} />)
            ) : (
              <EmptyState
                actionHref="/groups"
                actionLabel="Create group"
                description="Groups will show up here once they are created from real app data."
                title="No groups yet"
              />
            )}
          </div>
        </section>

        <aside className="grid content-start gap-5">
          <Card className="min-h-0">
            <Pill>Categories</Pill>
            <h2 className="mt-3 text-2xl font-black">Month shape</h2>
            <CategoryChart />
            <div className="flex flex-wrap gap-2">
              {["Home", "Food", "Travel", "Fun"].map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
          </Card>
          <Card className="min-h-0">
            <Pill>Settlement activity</Pill>
            <div className="mt-5 grid gap-3">
              {activity.length ? (
                activity.map((item) => (
                  <div className="rounded-[1.25rem] border border-line bg-white p-4 text-sm font-semibold" key={item}>
                    {item}
                  </div>
                ))
              ) : (
                <p className="rounded-[1.25rem] border border-line bg-white p-4 text-sm font-semibold text-ink/55">
                  No activity yet.
                </p>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
