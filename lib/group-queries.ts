import { ensureCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const tones = ["bg-sky", "bg-rose", "bg-mint", "bg-butter", "bg-peach"];

export function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2);
  return initials.toUpperCase();
}

export async function getCurrentUserGroups() {
  const user = await ensureCurrentUser();

  const memberships = await prisma.groupMember.findMany({
    where: { userId: user.id },
    include: {
      group: {
        include: {
          expenses: true,
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
    },
    orderBy: {
      joinedAt: "desc"
    }
  });

  return memberships.map((membership, index) => {
    const totalCents = membership.group.expenses.reduce((sum, expense) => sum + expense.amountCents, 0);

    return {
      balanceCents: 0,
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

  return {
    balanceCents: 0,
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
    tone: tones[0],
    totalCents
  };
}
