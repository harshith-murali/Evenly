import { ensureCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { simplifySettlements } from "@/lib/split";

const tones = ["bg-sky", "bg-rose", "bg-mint", "bg-butter", "bg-peach"];

export function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2);
  return initials.toUpperCase();
}

type FinanceGroup = {
  expenses: Array<{
    amountCents: number;
    paidByUserId: string;
    participants: Array<{
      amountCents: number;
      userId: string;
    }>;
  }>;
  members: Array<{
    userId: string;
  }>;
  settlements: Array<{
    amountCents: number;
    fromUserId: string;
    toUserId: string;
  }>;
};

function computeGroupBalances(group: FinanceGroup) {
  const balances = new Map<string, number>();

  group.members.forEach((member) => balances.set(member.userId, 0));

  group.expenses.forEach((expense) => {
    balances.set(expense.paidByUserId, (balances.get(expense.paidByUserId) ?? 0) + expense.amountCents);
    expense.participants.forEach((participant) => {
      balances.set(participant.userId, (balances.get(participant.userId) ?? 0) - participant.amountCents);
    });
  });

  group.settlements.forEach((settlement) => {
    balances.set(settlement.fromUserId, (balances.get(settlement.fromUserId) ?? 0) + settlement.amountCents);
    balances.set(settlement.toUserId, (balances.get(settlement.toUserId) ?? 0) - settlement.amountCents);
  });

  const balanceList = Array.from(balances.entries()).map(([userId, cents]) => ({ cents, userId }));
  return {
    balanceList,
    suggestions: simplifySettlements(balanceList)
  };
}

export async function getCurrentUserGroups() {
  const user = await ensureCurrentUser();

  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.id },
    include: {
      group: {
        include: {
          expenses: {
            include: {
              participants: true
            }
          },
          members: {
            include: {
              user: true
            },
            orderBy: {
              joinedAt: "asc"
            }
          },
          settlements: true
        }
      }
    },
    orderBy: {
      joinedAt: "desc"
    }
  });

  return memberships.map((membership, index) => {
    const totalCents = membership.group.expenses.reduce((sum, expense) => sum + expense.amountCents, 0);
    const finances = computeGroupBalances(membership.group);

    return {
      balanceCents: finances.balanceList.find((balance) => balance.userId === user.id)?.cents ?? 0,
      category: membership.group.category,
      id: membership.group.id,
      members: membership.group.members.map((member, memberIndex) => ({
        color: tones[memberIndex % tones.length],
        id: member.user.id,
        initials: initialsFor(member.user.name),
        name: member.user.name
      })),
      name: membership.group.name,
      tone: tones[index % tones.length],
      totalCents
    };
  });
}

export async function getCurrentUserGroup(groupId: string) {
  const user = await ensureCurrentUser();

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
          expenses: {
            include: {
              category: true,
              participants: true,
              paidBy: true
            },
            orderBy: {
              expenseDate: "desc"
            }
          },
          settlements: {
            include: {
              fromUser: true,
              toUser: true
            },
            orderBy: {
              createdAt: "desc"
            }
          },
          invitations: {
            orderBy: {
              expiresAt: "desc"
            }
          },
          members: {
            include: {
              user: true
            },
            orderBy: {
              joinedAt: "asc"
            }
          }
        }
      }
    }
  });

  if (!membership) return null;

  const group = membership.group;
  const totalCents = group.expenses.reduce((sum, expense) => sum + expense.amountCents, 0);
  const finances = computeGroupBalances(group);

  return {
    balanceCents: finances.balanceList.find((balance) => balance.userId === user.id)?.cents ?? 0,
    category: group.category,
    expenses: group.expenses,
    id: group.id,
    invitations: group.invitations,
    members: group.members.map((member, index) => ({
      color: tones[index % tones.length],
      id: member.user.id,
      initials: initialsFor(member.user.name),
      name: member.user.name
    })),
    name: group.name,
    settlements: group.settlements,
    settlementSuggestions: finances.suggestions,
    tone: tones[0],
    totalCents
  };
}

export async function getCurrentUserRecentExpenses() {
  const user = await ensureCurrentUser();
  const memberships = await prisma.groupMember.findMany({
    select: { groupId: true },
    where: { userId: user.id }
  });
  const groupIds = memberships.map((membership) => membership.groupId);

  if (!groupIds.length) return [];

  const expenses = await prisma.expense.findMany({
    include: {
      category: true,
      paidBy: true
    },
    orderBy: {
      expenseDate: "desc"
    },
    take: 8,
    where: {
      groupId: {
        in: groupIds
      }
    }
  });

  return expenses.map((expense) => ({
    amountCents: expense.amountCents,
    category: expense.category?.name ?? "Expense",
    date: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(expense.expenseDate),
    id: expense.id,
    paidByName: expense.paidBy.name,
    paidByUserId: expense.paidByUserId,
    title: expense.title,
    tone: "bg-mint"
  }));
}

export async function getCurrentUserSettlementOverview() {
  const user = await ensureCurrentUser();
  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.id },
    include: {
      group: {
        include: {
          expenses: {
            include: {
              participants: true
            }
          },
          members: {
            include: {
              user: true
            }
          },
          settlements: {
            include: {
              fromUser: true,
              toUser: true
            },
            orderBy: {
              createdAt: "desc"
            }
          }
        }
      }
    }
  });

  const suggestions = memberships.flatMap((membership) => {
    const finances = computeGroupBalances(membership.group);
    const memberById = new Map(membership.group.members.map((member) => [member.userId, member.user.name]));

    return finances.suggestions.map((suggestion) => ({
      ...suggestion,
      fromName: memberById.get(suggestion.fromUserId) ?? "Member",
      groupId: membership.group.id,
      groupName: membership.group.name,
      toName: memberById.get(suggestion.toUserId) ?? "Member"
    }));
  });

  const settlements = memberships.flatMap((membership) =>
    membership.group.settlements.map((settlement) => ({
      amountCents: settlement.amountCents,
      createdAt: settlement.createdAt,
      fromName: settlement.fromUser.name,
      groupName: membership.group.name,
      id: settlement.id,
      toName: settlement.toUser.name
    }))
  );

  return {
    settlements: settlements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    suggestions
  };
}
