import { Search, UsersRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { GroupCard } from "@/components/group-card";
import { Card, Pill } from "@/components/ui";
import { groups } from "@/lib/data";

export default function GroupsPage() {
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
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {groups.length ? groups.map((group) => <GroupCard {...group} key={group.id} />) : null}
        <Card className="grid min-h-80 place-items-center border-dashed text-center">
          <div>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-butter">
              <UsersRound className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-2xl font-black">Create a group</h2>
            <p className="mt-2 text-sm text-ink/60">Invite friends, add expenses, and let Evenly keep the math tidy.</p>
          </div>
        </Card>
        {!groups.length ? (
          <EmptyState
            description="Connect your database-backed group creation flow to populate this page."
            title="Your group list is empty"
          />
        ) : null}
      </div>
    </AppShell>
  );
}
