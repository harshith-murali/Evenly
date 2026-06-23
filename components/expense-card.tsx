import { ReceiptText } from "lucide-react";
import { getMember } from "@/lib/data";
import { formatMoney } from "@/lib/money";
import { cn, Pill } from "@/components/ui";

export function ExpenseCard({
  title,
  category,
  amountCents,
  paidByUserId,
  date,
  tone,
  compact
}: {
  title: string;
  category: string;
  amountCents: number;
  paidByUserId: string;
  date: string;
  tone: string;
  compact?: boolean;
}) {
  const member = getMember(paidByUserId);

  return (
    <article className="hover-lift flex min-w-0 max-w-full flex-col gap-4 rounded-[1.5rem] border border-line bg-white/75 p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-4">
        <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-full", tone)}>
          <ReceiptText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-black text-ink sm:text-base">{title}</h3>
            {!compact && <Pill className="px-3 py-1 text-xs">{category}</Pill>}
          </div>
          <p className="mt-1 text-sm text-ink/60">Paid by {member.name} · {date}</p>
        </div>
      </div>
      <p className="text-left text-base font-black text-ink sm:ml-auto sm:text-right">{formatMoney(amountCents)}</p>
    </article>
  );
}
