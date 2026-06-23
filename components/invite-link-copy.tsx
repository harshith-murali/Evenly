"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui";

export function InviteLinkCopy({ inviteUrl }: { inviteUrl: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copyInviteLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = inviteUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setFailed(true);
      window.setTimeout(() => setFailed(false), 2200);
    }
  }

  return (
    <div className="mt-3 grid gap-2">
      <div className="rounded-[1rem] border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink/60">
        <p className="break-all">{inviteUrl}</p>
      </div>
      <Button
        className="min-h-10 px-4 py-2 text-xs"
        onClick={() => void copyInviteLink()}
        variant="secondary"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : failed ? "Copy failed" : "Copy invite link"}
      </Button>
    </div>
  );
}
