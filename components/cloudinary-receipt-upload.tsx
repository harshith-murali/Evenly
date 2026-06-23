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

type ExtractedReceipt = {
  category?: string;
  date?: string;
  merchant?: string;
  totalAmount?: number;
};

export function CloudinaryReceiptUpload({
  onExtract,
  onUpload
}: {
  onExtract?: (receipt: ExtractedReceipt) => void;
  onUpload?: (secureUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [message, setMessage] = useState("No receipt uploaded yet.");
  const [progress, setProgress] = useState(0);
  const [secureUrl, setSecureUrl] = useState("");

  function uploadToCloudinary(url: string, formData: FormData) {
    return new Promise<{ secure_url: string }>((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open("POST", url);
      request.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 72));
        }
      };
      request.onerror = () => reject(new Error("Receipt upload failed."));
      request.onload = () => {
        let payload: { error?: { message?: string }; secure_url?: string } = {};

        try {
          payload = JSON.parse(request.responseText);
        } catch {
          reject(new Error("Cloudinary returned an unreadable response."));
          return;
        }

        if (request.status < 200 || request.status >= 300 || !payload.secure_url) {
          reject(new Error(payload.error?.message ?? "Receipt upload failed."));
          return;
        }

        setProgress(78);
        resolve({ secure_url: payload.secure_url });
      };
      request.send(formData);
    });
  }

  async function uploadFile(file: File) {
    setState("uploading");
    setProgress(8);
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

      setMessage("Uploading receipt to Cloudinary.");
      const uploadPayload = await uploadToCloudinary(
        `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/auto/upload`,
        formData
      );

      const uploadedUrl = uploadPayload.secure_url;
      setSecureUrl(uploadedUrl);
      onUpload?.(uploadedUrl);
      setProgress(82);
      setMessage(`${file.name} uploaded.`);
      setState("uploaded");

      setMessage("Receipt uploaded. Reading details with Claude.");
      const extractResponse = await fetch("/api/receipts/extract", {
        body: JSON.stringify({ receiptUrl: uploadedUrl }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const extractPayload = await extractResponse.json();

      if (extractResponse.ok && extractPayload.receipt) {
        onExtract?.(extractPayload.receipt);
        setProgress(100);
        setMessage("Receipt details extracted. Please review before saving.");
      } else {
        setProgress(100);
        setMessage(extractPayload.error ?? "Receipt uploaded. Enter details manually.");
      }
    } catch (error) {
      setProgress(0);
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
      <div className="mx-auto mt-5 max-w-56">
        <div className="flex items-center justify-between text-xs font-bold text-ink/50">
          <span>{state === "uploading" ? "Uploading" : state === "uploaded" ? "Complete" : "Progress"}</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-pill bg-white">
          <div
            className="h-full rounded-pill bg-ink transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          className="focus-ring inline-flex min-h-11 min-w-36 items-center justify-center gap-2 rounded-pill border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={state === "uploading"}
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
