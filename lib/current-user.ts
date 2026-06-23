import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function ensureCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${clerkUser.id}@clerk.local`;
  const name = clerkUser.fullName ?? clerkUser.username ?? email.split("@")[0] ?? "Evenly user";

  return prisma.user.upsert({
    where: { id: clerkUser.id },
    update: {
      email,
      image: clerkUser.imageUrl,
      name
    },
    create: {
      id: clerkUser.id,
      email,
      image: clerkUser.imageUrl,
      name
    }
  });
}
