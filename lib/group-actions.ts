"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

function parseInviteEmails(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];

  return Array.from(
    new Set(
      value
        .split(/[\s,]+/)
        .map((email) => email.trim().toLowerCase())
        .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    )
  );
}

function inviteExpiry() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  return expiresAt;
}

export async function createGroup(formData: FormData) {
  const user = await ensureCurrentUser();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "Friends").trim() || "Friends";
  const emails = parseInviteEmails(formData.get("inviteEmails"));

  if (!name) {
    throw new Error("Group name is required.");
  }

  const group = await prisma.group.create({
    data: {
      category,
      name,
      invitations: {
        create: emails.map((email) => ({
          email,
          expiresAt: inviteExpiry(),
          token: crypto.randomUUID()
        }))
      },
      members: {
        create: {
          role: "owner",
          userId: user.id
        }
      }
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/groups");
  redirect(`/groups/${group.id}`);
}

export async function inviteFriends(groupId: string, formData: FormData) {
  const user = await ensureCurrentUser();
  const emails = parseInviteEmails(formData.get("inviteEmails"));

  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: user.id
      }
    }
  });

  if (!membership) {
    throw new Error("You must be a group member to invite friends.");
  }

  if (emails.length) {
    await prisma.invitation.createMany({
      data: emails.map((email) => ({
        email,
        expiresAt: inviteExpiry(),
        groupId,
        token: crypto.randomUUID()
      }))
    });
  }

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
}
