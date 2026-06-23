import { AppShell } from "@/components/app-shell";
import { AddExpenseForm } from "@/components/add-expense-form";
import { getCurrentUserGroups } from "@/lib/group-queries";

export const dynamic = "force-dynamic";

export default async function NewExpensePage() {
  const groups = await getCurrentUserGroups();

  return (
    <AppShell title="Add expense">
      <AddExpenseForm groups={groups.map((group) => ({ id: group.id, members: group.members, name: group.name }))} />
    </AppShell>
  );
}
