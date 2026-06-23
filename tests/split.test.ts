import { describe, expect, it } from "vitest";
import { calculateBalances, calculateSplits, simplifySettlements } from "@/lib/split";

describe("calculateSplits", () => {
  it("allocates equal splits without losing cents", () => {
    expect(calculateSplits(10001, "equal", [{ userId: "a" }, { userId: "b" }, { userId: "c" }])).toEqual([
      { userId: "a", amountCents: 3334 },
      { userId: "b", amountCents: 3334 },
      { userId: "c", amountCents: 3333 }
    ]);
  });

  it("validates custom splits against the total", () => {
    expect(() =>
      calculateSplits(9000, "custom", [
        { userId: "a", value: 4000 },
        { userId: "b", value: 4000 }
      ])
    ).toThrow("Custom splits");
  });

  it("supports percentage splits", () => {
    const splits = calculateSplits(12345, "percentage", [
      { userId: "a", value: 60 },
      { userId: "b", value: 40 }
    ]);
    expect(splits.reduce((sum, split) => sum + split.amountCents, 0)).toBe(12345);
  });
});

describe("balances and settlements", () => {
  it("creates minimum settlement suggestions for a simple ledger", () => {
    const balances = calculateBalances([
      {
        paidByUserId: "a",
        splits: [
          { userId: "a", amountCents: 3000 },
          { userId: "b", amountCents: 3000 },
          { userId: "c", amountCents: 3000 }
        ]
      },
      {
        paidByUserId: "b",
        splits: [
          { userId: "a", amountCents: 1000 },
          { userId: "b", amountCents: 1000 },
          { userId: "c", amountCents: 1000 }
        ]
      }
    ]);

    expect(simplifySettlements(balances)).toEqual([
      { fromUserId: "b", toUserId: "a", amountCents: 1000 },
      { fromUserId: "c", toUserId: "a", amountCents: 4000 }
    ]);
  });
});
