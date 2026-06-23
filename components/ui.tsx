import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("w-full max-w-full rounded-[2rem] border border-line/80 bg-cloud p-6 shadow-soft", className)}>
      {children}
    </section>
  );
}

export function Pill({
  children,
  active,
  className
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-medium",
        active ? "border-ink bg-ink text-white" : "border-line bg-white/70 text-ink",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60",
        variant === "primary"
          ? "bg-ink text-white shadow-[0_12px_28px_rgba(23,23,23,0.18)]"
          : "border border-line bg-white text-ink",
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export function AmountBubble({
  label,
  value,
  tone = "bg-sky",
  className
}: {
  label: string;
  value: string;
  tone?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex aspect-square w-full max-w-full min-w-0 items-center justify-center rounded-full p-6 text-center shadow-soft",
        tone,
        className
      )}
    >
      <div>
        <p className="text-sm font-medium text-ink/65">{label}</p>
        <p className="mt-1 text-2xl font-black tracking-normal text-ink">{value}</p>
      </div>
    </div>
  );
}
