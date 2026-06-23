"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculateSplits, type SplitMethod } from "@/lib/split";
import { ensureCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const splitMethodMap: Record<string, SplitMethod> = {
  Custom: "custom",
  Equal: "equal",
  Percent: "percentage",
  Shares: "shares"
};

function parseMoneyToMinorUnits(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "")
    .replace(/[₹,\s]/g, "")
    .trim();
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Enter a valid amount.");
  }

  return Math.round(amount * 100);
}

function parseExpenseDate(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return new Date();

  const parsed = new Date(`${raw}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Enter a valid expense date.");
  }

  return parsed;
}

export async function createExpense(formData: FormData) {
  const user = await ensureCurrentUser();
  const title = String(formData.get("title") ?? "").trim();
  const groupId = String(formData.get("groupId") ?? "").trim();
  const categoryName = String(formData.get("category") ?? "Expense").trim() || "Expense";
  const splitMethodLabel = String(formData.get("splitMethod") ?? "Equal");
  const splitMethod = splitMethodMap[splitMethodLabel] ?? "equal";
  const amountCents = parseMoneyToMinorUnits(formData.get("amount"));
  const expenseDate = parseExpenseDate(formData.get("expenseDate"));
  const receiptUrl = String(formData.get("receiptUrl") ?? "").trim() || null;

  if (!title) {
    throw new Error("Expense title is required.");
  }

  if (!groupId) {
    throw new Error("Choose a group before saving an expense.");
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      groupId_userId: {
        groupId,
        userId: user.id
      }
    },
    include: {
      group: {
        include: {
          members: true
        }
      }
    }
  });

  if (!membership) {
    throw new Error("You must be a group member to add an expense.");
  }

  const category = await prisma.category.upsert({
    create: {
      color: "mint",
      name: categoryName
    },
    update: {},
    where: {
      name: categoryName
    }
  });

  const participants = membership.group.members.map((member) => ({ userId: member.userId }));
  const splits = calculateSplits(amountCents, splitMethod, participants);

  await prisma.expense.create({
    data: {
      amountCents,
      categoryId: category.id,
      currency: "INR",
      expenseDate,
      groupId,
      paidByUserId: user.id,
      receiptUrl,
      splitMethod: splitMethod.toUpperCase() as "EQUAL" | "CUSTOM" | "PERCENTAGE" | "SHARES",
      title,
      participants: {
        create: splits.map((split) => ({
          amountCents: split.amountCents,
          userId: split.userId
        }))
      }
    }
  });

  revalidatePath("/dashboard");
  revalidatePath(`/groups/${groupId}`);
  redirect(`/groups/${groupId}`);
}
