import { Plus, Search, UsersRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { FormSubmitButton } from "@/components/form-submit-button";
import { GroupCard } from "@/components/group-card";
import { Card, Pill } from "@/components/ui";
import { createGroup } from "@/lib/group-actions";
import { getCurrentUserGroups } from "@/lib/group-queries";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const groups = await getCurrentUserGroups();

  return (
    <AppShell title="Groups">
      <Card className="mb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", "Roommates", "Travel", "Friends", "Settled"].map((filter, index) => (
              <Pill active={index === 0} key={filter}>{filter}</Pill>
            ))}
          </div>
          <label className="flex min-w-72 items-center gap-3 rounded-pill border border-line bg-white px-4 py-3 text-sm font-semibold">
            <Search className="h-4 w-4 text-ink/45" />
            <input className="w-full bg-transparent outline-none" placeholder="Search groups" />
          </label>
        </div>
      </Card>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <section className="grid content-start gap-5 md:grid-cols-2">
          {groups.length ? (
            groups.map((group) => <GroupCard {...group} key={group.id} />)
          ) : (
            <EmptyState
              description="Create your first group, invite friends, then start adding shared expenses."
              title="Your group list is empty"
            />
          )}
        </section>
        <Card>
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-butter">
              <UsersRound className="h-6 w-6" />
            </span>
            <div>
              <Pill active>Create group</Pill>
              <h2 className="mt-4 text-2xl font-black">Start a shared space</h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">
                Add a group name and invite friends by email. Invites are saved as pending rows in Postgres.
              </p>
            </div>
          </div>
          <form action={createGroup} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-bold">
              Group name
              <input
                className="rounded-[1.25rem] border border-line bg-white px-4 py-3 outline-none"
                name="name"
                placeholder="Weekend trip, roommates, team lunch"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Category
              <select className="rounded-[1.25rem] border border-line bg-white px-4 py-3 outline-none" name="category">
                <option>Roommates</option>
                <option>Travel</option>
                <option>Friends</option>
                <option>Couple</option>
                <option>Work</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Invite emails
              <textarea
                className="min-h-28 rounded-[1.25rem] border border-line bg-white px-4 py-3 outline-none"
                name="inviteEmails"
                placeholder="friend@example.com, another@example.com"
              />
            </label>
            <FormSubmitButton pendingLabel="Creating group...">
              <Plus className="h-4 w-4" />
              Create group
            </FormSubmitButton>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
