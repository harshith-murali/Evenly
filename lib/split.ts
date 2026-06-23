export type SplitMethod = "equal" | "custom" | "percentage" | "shares";

export type ParticipantInput = {
  userId: string;
  value?: number;
};

export type SplitShare = {
  userId: string;
  amountCents: number;
};

function allocateRemainder(shares: SplitShare[], targetCents: number) {
  const delta = targetCents - shares.reduce((sum, share) => sum + share.amountCents, 0);
  const direction = Math.sign(delta);
  for (let i = 0; i < Math.abs(delta); i += 1) {
    shares[i % shares.length].amountCents += direction;
  }
  return shares;
}

export function calculateSplits(
  totalCents: number,
  method: SplitMethod,
  participants: ParticipantInput[]
): SplitShare[] {
  if (totalCents <= 0) {
    throw new Error("Expense total must be greater than zero.");
  }

  if (participants.length === 0) {
    throw new Error("At least one participant is required.");
  }

  if (method === "equal") {
    const base = Math.floor(totalCents / participants.length);
    return allocateRemainder(
      participants.map((participant) => ({ userId: participant.userId, amountCents: base })),
      totalCents
    );
  }

  if (method === "custom") {
    const shares = participants.map((participant) => ({
      userId: participant.userId,
      amountCents: Math.round(participant.value ?? 0)
    }));
    const customTotal = shares.reduce((sum, share) => sum + share.amountCents, 0);
    if (customTotal !== totalCents) {
      throw new Error("Custom splits must equal the expense total.");
    }
    return shares;
  }

  if (method === "percentage") {
    const percentTotal = participants.reduce((sum, participant) => sum + (participant.value ?? 0), 0);
    if (Math.abs(percentTotal - 100) > 0.001) {
      throw new Error("Percentage splits must add up to 100.");
    }
    return allocateRemainder(
      participants.map((participant) => ({
        userId: participant.userId,
        amountCents: Math.floor(totalCents * ((participant.value ?? 0) / 100))
      })),
      totalCents
    );
  }

  const totalShares = participants.reduce((sum, participant) => sum + (participant.value ?? 0), 0);
  if (totalShares <= 0) {
    throw new Error("Share splits must include at least one share.");
  }

  return allocateRemainder(
    participants.map((participant) => ({
      userId: participant.userId,
      amountCents: Math.floor(totalCents * ((participant.value ?? 0) / totalShares))
    })),
    totalCents
  );
}

export type LedgerEntry = {
  paidByUserId: string;
  splits: SplitShare[];
};

export type Balance = {
  userId: string;
  cents: number;
};

export type SettlementSuggestion = {
  fromUserId: string;
  toUserId: string;
  amountCents: number;
};

export function calculateBalances(entries: LedgerEntry[]): Balance[] {
  const balances = new Map<string, number>();

  entries.forEach((entry) => {
    const totalPaid = entry.splits.reduce((sum, split) => sum + split.amountCents, 0);
    balances.set(entry.paidByUserId, (balances.get(entry.paidByUserId) ?? 0) + totalPaid);
    entry.splits.forEach((split) => {
      balances.set(split.userId, (balances.get(split.userId) ?? 0) - split.amountCents);
    });
  });

  return Array.from(balances.entries())
    .map(([userId, cents]) => ({ userId, cents }))
    .sort((a, b) => b.cents - a.cents);
}

export function simplifySettlements(balances: Balance[]): SettlementSuggestion[] {
  const creditors = balances
    .filter((balance) => balance.cents > 0)
    .map((balance) => ({ ...balance }));
  const debtors = balances
    .filter((balance) => balance.cents < 0)
    .map((balance) => ({ ...balance, cents: Math.abs(balance.cents) }));
  const suggestions: SettlementSuggestion[] = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const amountCents = Math.min(debtors[debtorIndex].cents, creditors[creditorIndex].cents);
    suggestions.push({
      fromUserId: debtors[debtorIndex].userId,
      toUserId: creditors[creditorIndex].userId,
      amountCents
    });

    debtors[debtorIndex].cents -= amountCents;
    creditors[creditorIndex].cents -= amountCents;

    if (debtors[debtorIndex].cents === 0) debtorIndex += 1;
    if (creditors[creditorIndex].cents === 0) creditorIndex += 1;
  }

  return suggestions;
}
