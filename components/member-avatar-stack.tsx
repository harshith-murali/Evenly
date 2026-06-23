import { getMember } from "@/lib/data";
import { cn } from "@/components/ui";

export type AvatarMember = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export function MemberAvatarStack({
  ids,
  members,
  size = "md"
}: {
  ids?: string[];
  members?: AvatarMember[];
  size?: "sm" | "md" | "lg";
}) {
  const people = members ?? ids?.map((id) => getMember(id)) ?? [];

  if (people.length === 0) {
    return <span className="text-sm font-semibold text-ink/50">No members</span>;
  }

  const dimensions = size === "sm" ? "h-8 w-8 text-[11px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs";

  return (
    <div className="flex -space-x-2">
      {people.map((member) => {
        return (
          <span
            aria-label={member.name}
            className={cn(
              "grid shrink-0 place-items-center rounded-full border-2 border-cloud font-black text-ink",
              dimensions,
              member.color
            )}
            key={member.id}
            title={member.name}
          >
            {member.initials}
          </span>
        );
      })}
    </div>
  );
}
