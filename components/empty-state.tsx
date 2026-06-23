import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, Pill } from "@/components/ui";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <Card className="grid min-h-64 place-items-center border-dashed text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-butter">
          <Plus className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-2xl font-black">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">{description}</p>
        {actionHref && actionLabel ? (
          <Link className="mt-5 inline-flex rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-white" href={actionHref}>
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
