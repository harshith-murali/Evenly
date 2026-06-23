import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { cn, Pill } from "@/components/ui";
import { type AvatarMember, MemberAvatarStack } from "@/components/member-avatar-stack";

export function GroupCard({
  id,
  name,
  category,
  totalCents,
  balanceCents,
  members,
  tone
}: {
  id: string;
  name: string;
  category: string;
  totalCents: number;
  balanceCents: number;
  members: AvatarMember[];
  tone: string;
}) {
  return (
    <Link
      className="hover-lift block w-full max-w-full rounded-[2rem] border border-line bg-cloud p-5 shadow-soft"
      href={`/groups/${id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={cn("h-16 w-16 rounded-full", tone)} />
        <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-6">
        <Pill className="px-3 py-1 text-xs">{category}</Pill>
        <h3 className="mt-4 text-2xl font-black tracking-normal sm:text-[1.65rem]">{name}</h3>
        <p className="mt-1 text-sm text-ink/60">{formatMoney(totalCents)} tracked this month</p>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <MemberAvatarStack members={members} />
        <div className="min-w-0 text-left sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink/45">Balance</p>
          <p className={cn("break-words text-lg font-black", balanceCents < 0 ? "text-rose-950" : "text-ink")}>
            {formatMoney(balanceCents)}
          </p>
        </div>
      </div>
    </Link>
  );
}
