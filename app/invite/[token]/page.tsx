import { UsersRound } from "lucide-react";
import { acceptInvitation } from "@/lib/group-actions";
import { prisma } from "@/lib/prisma";
import { Card, Pill } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = await prisma.invitation.findUnique({
    include: { group: true },
    where: { token }
  });
  const accept = acceptInvitation.bind(null, token);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-butter">
          <UsersRound className="h-6 w-6" />
        </span>
        <Pill active className="mt-6">Evenly invite</Pill>
        <h1 className="mt-5 text-4xl font-black tracking-normal">
          {invitation ? `Join ${invitation.group.name}` : "Invite not found"}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink/60">
          {invitation
            ? "Accept this invitation to join the group and start splitting shared expenses."
            : "This invitation may have expired or already been removed."}
        </p>
        {invitation ? (
          <form action={accept} className="mt-6">
            <button className="focus-ring inline-flex min-h-11 items-center justify-center rounded-pill bg-ink px-6 py-3 text-sm font-semibold text-white" type="submit">
              Accept invite
            </button>
          </form>
        ) : null}
      </Card>
    </main>
  );
}
