import { UserProfile } from "@clerk/nextjs";
import { AppShell } from "@/components/app-shell";
import { Card, Pill } from "@/components/ui";

export default function SettingsPage() {
  return (
    <AppShell title="Profile settings">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden p-3 sm:p-5">
          <UserProfile
            routing="hash"
            appearance={{
              variables: {
                colorPrimary: "#171717",
                colorBackground: "#fbfaf7",
                borderRadius: "1.25rem"
              },
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none border-0 bg-transparent",
                navbar: "rounded-[1.5rem] border border-[#e7e0d6] bg-white",
                pageScrollBox: "rounded-[1.5rem] border border-[#e7e0d6] bg-white"
              }
            }}
          />
        </Card>
        <Card>
          <Pill active>Clerk profile</Pill>
          <h2 className="mt-4 text-2xl font-black">Account controls</h2>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Profile details, passwords, connected accounts, active sessions, and security settings now come from Clerk.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Pill>Secure sessions</Pill>
            <Pill>Email verified</Pill>
            <Pill>Profile</Pill>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
