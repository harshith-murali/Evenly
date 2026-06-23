import { Loader2 } from "lucide-react";
import { Card, Pill } from "@/components/ui";

export function LoadingScreen({ label = "Loading Evenly" }: { label?: string }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="bubble-field max-w-xl text-center">
        <div className="relative z-10">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ink text-2xl font-black text-white">
            E
          </span>
          <Pill active className="mt-6">
            Please wait
          </Pill>
          <h1 className="mt-6 text-4xl font-black tracking-normal">{label}</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink/60">
            Preparing your groups, balances, receipts, and settlements.
          </p>
          <div className="mx-auto mt-8 h-3 max-w-sm overflow-hidden rounded-pill bg-white">
            <div className="h-full w-1/2 animate-[loading-slide_1.1s_ease-in-out_infinite] rounded-pill bg-ink" />
          </div>
          <Loader2 className="mx-auto mt-6 h-5 w-5 animate-spin text-ink/60" />
        </div>
      </Card>
    </main>
  );
}
