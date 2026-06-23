"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureCurrentUser } from "@/lib/current-user";
import { sendInvitationEmail } from "@/lib/email";
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

  const invitationData = emails.map((email) => ({
    email,
    expiresAt: inviteExpiry(),
    token: crypto.randomUUID()
  }));

  const group = await prisma.group.create({
    data: {
      category,
      name,
      invitations: {
        create: invitationData
      },
      members: {
        create: {
          role: "owner",
          userId: user.id
        }
      }
    }
  });

  await Promise.all(
    invitationData.map((invitation) =>
      sendInvitationEmail({
        email: invitation.email,
        groupName: group.name,
        token: invitation.token
      })
    )
  );

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
    const group = await prisma.group.findUnique({
      select: { name: true },
      where: { id: groupId }
    });
    const invitationData = emails.map((email) => ({
      email,
      expiresAt: inviteExpiry(),
      groupId,
      token: crypto.randomUUID()
    }));

    await prisma.invitation.createMany({
      data: invitationData
    });

    await Promise.all(
      invitationData.map((invitation) =>
        sendInvitationEmail({
          email: invitation.email,
          groupName: group?.name ?? "Evenly group",
          token: invitation.token
        })
      )
    );
  }

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
}

export async function acceptInvitation(token: string) {
  const user = await ensureCurrentUser();
  const invitation = await prisma.invitation.findUnique({
    include: {
      group: true
    },
    where: { token }
  });

  if (!invitation || invitation.expiresAt < new Date()) {
    throw new Error("This invite is invalid or expired.");
  }

  await prisma.groupMember.upsert({
    create: {
      groupId: invitation.groupId,
      role: "member",
      userId: user.id
    },
    update: {},
    where: {
      groupId_userId: {
        groupId: invitation.groupId,
        userId: user.id
      }
    }
  });

  await prisma.invitation.update({
    data: { accepted: true },
    where: { id: invitation.id }
  });

  revalidatePath("/groups");
  redirect(`/groups/${invitation.groupId}`);
}
