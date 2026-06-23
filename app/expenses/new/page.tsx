import { AppShell } from "@/components/app-shell";
import { AddExpenseForm } from "@/components/add-expense-form";

export default function NewExpensePage() {
  return (
    <AppShell title="Add expense">
      <AddExpenseForm />
    </AppShell>
  );
}
