"use client";

import { useState } from "react";
import { CalendarDays, Plus, ReceiptText, Search } from "lucide-react";
import { Button, Card, Pill, cn } from "@/components/ui";
import { CloudinaryReceiptUpload } from "@/components/cloudinary-receipt-upload";

const methods = ["Equal", "Custom", "Percent", "Shares"];
const categories = ["Groceries", "Dining", "Stay", "Travel", "Home"];

export function AddExpenseForm() {
  const [method, setMethod] = useState("Equal");
  const [category, setCategory] = useState("Groceries");

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="bubble-field">
        <div className="relative z-10">
          <Pill active className="mb-5">Step 1 of 3 · Details</Pill>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Merchant or note
              <span className="flex items-center gap-3 rounded-[1.25rem] border border-line bg-white px-4 py-3">
                <ReceiptText className="h-4 w-4 text-ink/45" />
                <input className="w-full bg-transparent outline-none" placeholder="What was this for?" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Amount
              <input className="rounded-[1.25rem] border border-line bg-white px-4 py-3 text-2xl font-black outline-none" placeholder="₹0.00" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Group
              <span className="flex items-center gap-3 rounded-[1.25rem] border border-line bg-white px-4 py-3">
                <Search className="h-4 w-4 text-ink/45" />
                <input className="w-full bg-transparent outline-none" placeholder="Select a group" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Date
              <span className="flex items-center gap-3 rounded-[1.25rem] border border-line bg-white px-4 py-3">
                <CalendarDays className="h-4 w-4 text-ink/45" />
                <input className="w-full bg-transparent outline-none" placeholder="Add a date" />
              </span>
            </label>
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
        <CloudinaryReceiptUpload />
        <div className="mt-6">
          <p className="mb-3 text-sm font-bold">People included</p>
          <div className="flex items-center justify-between rounded-[1.5rem] border border-line bg-white p-4">
            <p className="text-sm font-semibold text-ink/60">No group selected</p>
            <Pill>0 members</Pill>
          </div>
        </div>
        <Button className="mt-6 w-full">
          <Plus className="h-4 w-4" />
          Save expense
        </Button>
      </Card>
    </div>
  );
}
