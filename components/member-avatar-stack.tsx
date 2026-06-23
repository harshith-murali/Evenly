import { getMember } from "@/lib/data";
import { cn } from "@/components/ui";

export function MemberAvatarStack({
  ids,
  size = "md"
}: {
  ids: string[];
  size?: "sm" | "md" | "lg";
}) {
  if (ids.length === 0) {
    return <span className="text-sm font-semibold text-ink/50">No members</span>;
  }

  const dimensions = size === "sm" ? "h-8 w-8 text-[11px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs";

  return (
    <div className="flex -space-x-2">
      {ids.map((id) => {
        const member = getMember(id);
        return (
          <span
            aria-label={member.name}
            className={cn(
              "grid shrink-0 place-items-center rounded-full border-2 border-cloud font-black text-ink",
              dimensions,
              member.color
            )}
            key={id}
            title={member.name}
          >
            {member.initials}
          </span>
        );
      })}
    </div>
  );
}
