"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, ReceiptText, UsersRound } from "lucide-react";
import { createExpense } from "@/lib/expense-actions";
import { Card, Pill, cn } from "@/components/ui";
import { CloudinaryReceiptUpload } from "@/components/cloudinary-receipt-upload";
import { FormSubmitButton } from "@/components/form-submit-button";

type ExpenseGroup = {
  id: string;
  members: { id: string }[];
  name: string;
};

type ExtractedReceipt = {
  category?: string;
  date?: string;
  merchant?: string;
  totalAmount?: number;
};

const methods = ["Equal", "Custom", "Percent", "Shares"];
const categories = ["Groceries", "Dining", "Stay", "Travel", "Home"];

function toInputDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toDisplayDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
}

export function AddExpenseForm({ groups }: { groups: ExpenseGroup[] }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [expenseDate, setExpenseDate] = useState(toInputDate(new Date()));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [merchant, setMerchant] = useState("");
  const [method, setMethod] = useState("Equal");
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [receiptUrl, setReceiptUrl] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id ?? "");

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const selectedMemberCount = selectedGroup?.members.length ?? 0;
  const calendarDays = useMemo(() => {
    const start = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const end = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);
    const days: Array<Date | null> = Array.from({ length: start.getDay() }, () => null);

    for (let day = 1; day <= end.getDate(); day += 1) {
      days.push(new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day));
    }

    return days;
  }, [monthCursor]);

  function applyExtractedReceipt(receipt: ExtractedReceipt) {
    if (receipt.merchant) setMerchant(receipt.merchant);
    if (typeof receipt.totalAmount === "number" && Number.isFinite(receipt.totalAmount)) {
      setAmount(String(receipt.totalAmount));
    }
    if (receipt.category && categories.includes(receipt.category)) {
      setCategory(receipt.category);
    }
    if (receipt.date) {
      const parsed = new Date(receipt.date);
      if (!Number.isNaN(parsed.getTime())) {
        setExpenseDate(toInputDate(parsed));
        setMonthCursor(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    }
  }

  return (
    <form action={createExpense} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <input name="category" type="hidden" value={category} />
      <input name="expenseDate" type="hidden" value={expenseDate} />
      <input name="receiptUrl" type="hidden" value={receiptUrl} />
      <input name="splitMethod" type="hidden" value={method} />

      <Card className="bubble-field">
        <div className="relative z-10">
          <Pill active className="mb-5">Step 1 of 3 · Details</Pill>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Merchant or note
              <span className="flex items-center gap-3 rounded-[1.25rem] border border-line bg-white px-4 py-3">
                <ReceiptText className="h-4 w-4 text-ink/45" />
                <input
                  className="w-full bg-transparent outline-none"
                  name="title"
                  onChange={(event) => setMerchant(event.target.value)}
                  placeholder="What was this for?"
                  required
                  value={merchant}
                />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Amount
              <input
                className="rounded-[1.25rem] border border-line bg-white px-4 py-3 text-2xl font-black outline-none"
                inputMode="decimal"
                name="amount"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="₹0.00"
                required
                value={amount}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Group
              <span className="flex items-center gap-3 rounded-[1.25rem] border border-line bg-white px-4 py-3">
                <UsersRound className="h-4 w-4 text-ink/45" />
                <select
                  className="w-full bg-transparent font-semibold outline-none"
                  disabled={!groups.length}
                  name="groupId"
                  onChange={(event) => setSelectedGroupId(event.target.value)}
                  required
                  value={selectedGroupId}
                >
                  {groups.length ? (
                    groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))
                  ) : (
                    <option value="">Create a group first</option>
                  )}
                </select>
              </span>
            </label>
            <div className="relative grid gap-2 text-sm font-bold">
              Date
              <button
                className="focus-ring flex items-center gap-3 rounded-[1.25rem] border border-line bg-white px-4 py-3 text-left"
                onClick={() => setIsCalendarOpen((open) => !open)}
                type="button"
              >
                <CalendarDays className="h-4 w-4 text-ink/45" />
                <span className="font-semibold">{toDisplayDate(expenseDate)}</span>
              </button>
              {isCalendarOpen ? (
                <div className="absolute left-0 top-full z-20 mt-2 w-full min-w-80 rounded-[1.5rem] border border-line bg-cloud p-4 shadow-lift">
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white"
                      onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
                      type="button"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="font-black">
                      {new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(monthCursor)}
                    </p>
                    <button
                      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white"
                      onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
                      type="button"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-black text-ink/45">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                      <span key={`${day}-${index}`}>{day}</span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const value = day ? toInputDate(day) : "";
                      const selected = value === expenseDate;
                      return (
                        <button
                          className={cn(
                            "aspect-square rounded-full text-sm font-bold transition",
                            !day && "invisible",
                            selected ? "bg-ink text-white" : "bg-white text-ink hover:bg-butter"
                          )}
                          disabled={!day}
                          key={day?.toISOString() ?? `blank-${index}`}
                          onClick={() => {
                            if (day) {
                              setExpenseDate(value);
                              setIsCalendarOpen(false);
                            }
                          }}
                          type="button"
                        >
                          {day?.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-3 text-sm font-bold">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button key={item} onClick={() => setCategory(item)} type="button">
                  <Pill active={category === item}>{item}</Pill>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <p className="mb-3 text-sm font-bold">Split method</p>
            <div className="grid rounded-pill border border-line bg-white p-1 sm:inline-grid sm:grid-cols-4">
              {methods.map((item) => (
                <button
                  className={cn(
                    "rounded-pill px-5 py-3 text-sm font-black transition",
                    method === item ? "bg-ink text-white" : "text-ink/60"
                  )}
                  key={item}
                  onClick={() => setMethod(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <Pill className="mb-5">Receipt ready</Pill>
        <CloudinaryReceiptUpload onExtract={applyExtractedReceipt} onUpload={setReceiptUrl} />
        <div className="mt-6">
          <p className="mb-3 text-sm font-bold">People included</p>
          <div className="flex items-center justify-between rounded-[1.5rem] border border-line bg-white p-4">
            <p className="text-sm font-semibold text-ink/60">{selectedGroup?.name ?? "No group selected"}</p>
            <Pill>{selectedMemberCount} members</Pill>
          </div>
        </div>
        <FormSubmitButton className="mt-6 w-full" disabled={!selectedGroupId} pendingLabel="Saving expense...">
          <Plus className="h-4 w-4" />
          Save expense
        </FormSubmitButton>
      </Card>
    </form>
  );
}
