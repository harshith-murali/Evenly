import { calculateBalances, simplifySettlements } from "@/lib/split";

export type Member = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export type GroupSummary = {
  id: string;
  name: string;
  category: string;
  totalCents: number;
  balanceCents: number;
  members: string[];
  tone: string;
};

export type ExpenseSummary = {
  id: string;
  groupId: string;
  title: string;
  category: string;
  amountCents: number;
  paidByUserId: string;
  date: string;
  tone: string;
  splits: { userId: string; amountCents: number }[];
};

export const members: Member[] = [];

export const groups: GroupSummary[] = [];

export const expenses: ExpenseSummary[] = [];

export const balances = calculateBalances(
  expenses.map((expense) => ({
    paidByUserId: expense.paidByUserId,
    splits: expense.splits
  }))
);

export const settlementSuggestions = simplifySettlements(balances);

export const activity: string[] = [];

export function getMember(id: string) {
  return (
    members.find((member) => member.id === id) ?? {
      id,
      name: "Unknown member",
      initials: "U",
      color: "bg-sky"
    }
  );
}

export function getGroup(id: string) {
  return groups.find((group) => group.id === id);
}
