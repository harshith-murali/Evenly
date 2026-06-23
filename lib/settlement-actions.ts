"use server";

import { revalidatePath } from "next/cache";
import { ensureCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function markSettlementPaid(formData: FormData) {
  const user = await ensureCurrentUser();
  const groupId = String(formData.get("groupId") ?? "");
  const fromUserId = String(formData.get("fromUserId") ?? "");
  const toUserId = String(formData.get("toUserId") ?? "");
  const amountCents = Number(formData.get("amountCents") ?? 0);

  if (!groupId || !fromUserId || !toUserId || !Number.isFinite(amountCents) || amountCents <= 0) {
    throw new Error("Invalid settlement.");
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: user.id
      }
    }
  });

  if (!membership) {
    throw new Error("You must be a group member to settle this bill.");
  }

  await prisma.settlement.create({
    data: {
      amountCents,
      fromUserId,
      groupId,
      note: "Marked settled in Evenly",
      toUserId
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/settlements");
  revalidatePath(`/groups/${groupId}`);
}
