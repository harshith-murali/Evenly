"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Cloud, Loader2, Paperclip } from "lucide-react";
import { Pill } from "@/components/ui";

type UploadState = "idle" | "uploading" | "uploaded" | "error";

type SignatureResponse = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
  error?: string;
};

export function CloudinaryReceiptUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [message, setMessage] = useState("No receipt uploaded yet.");
  const [secureUrl, setSecureUrl] = useState("");

  async function uploadFile(file: File) {
    setState("uploading");
    setMessage("Preparing Cloudinary upload.");

    try {
      const signatureResponse = await fetch("/api/cloudinary/signature", {
        method: "POST"
      });
      const signaturePayload = (await signatureResponse.json()) as SignatureResponse;

      if (!signatureResponse.ok) {
        throw new Error(signaturePayload.error ?? "Cloudinary is not configured.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signaturePayload.apiKey);
      formData.append("timestamp", String(signaturePayload.timestamp));
      formData.append("signature", signaturePayload.signature);
      formData.append("folder", signaturePayload.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData
        }
      );
      const uploadPayload = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadPayload.error?.message ?? "Receipt upload failed.");
      }

      setSecureUrl(uploadPayload.secure_url);
      setMessage(file.name);
      setState("uploaded");
    } catch (error) {
      setSecureUrl("");
      setMessage(error instanceof Error ? error.message : "Receipt upload failed.");
      setState("error");
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-dashed border-ink/20 bg-paper p-6 text-center">
      <input
        accept="image/*,application/pdf"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadFile(file);
        }}
        ref={inputRef}
        type="file"
      />
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sky">
        {state === "uploading" ? <Loader2 className="h-6 w-6 animate-spin" /> : <Paperclip className="h-6 w-6" />}
      </span>
      <p className="mt-4 text-sm font-bold">Upload receipt</p>
      <p className="mx-auto mt-1 max-w-52 text-sm text-ink/55">{message}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          className="focus-ring inline-flex min-h-11 min-w-36 items-center justify-center gap-2 rounded-pill border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <Cloud className="h-4 w-4" />
          Choose file
        </button>
        {state === "uploaded" ? (
          <Pill>
            <CheckCircle2 className="h-4 w-4" />
            Uploaded
          </Pill>
        ) : null}
      </div>
      {secureUrl ? (
        <a className="mt-4 block truncate text-xs font-semibold text-ink/60 underline" href={secureUrl} rel="noreferrer" target="_blank">
          {secureUrl}
        </a>
      ) : null}
    </div>
  );
}
