import { NextResponse } from "next/server";

type ExtractRequest = {
  receiptUrl?: string;
};

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const { receiptUrl } = (await request.json()) as ExtractRequest;

  if (!apiKey) {
    return NextResponse.json({ error: "Claude API key is not configured." }, { status: 400 });
  }

  if (!receiptUrl) {
    return NextResponse.json({ error: "receiptUrl is required." }, { status: 400 });
  }

  const receiptResponse = await fetch(receiptUrl);

  if (!receiptResponse.ok) {
    return NextResponse.json({ error: "Could not fetch uploaded receipt." }, { status: 400 });
  }

  const mediaType = receiptResponse.headers.get("content-type") ?? "image/jpeg";
  const bytes = Buffer.from(await receiptResponse.arrayBuffer());

  if (!mediaType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Claude receipt extraction currently supports uploaded receipt images." },
      { status: 400 }
    );
  }

  const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      max_tokens: 600,
      messages: [
        {
          content: [
            {
              source: {
                data: bytes.toString("base64"),
                media_type: mediaType,
                type: "base64"
              },
              type: "image"
            },
            {
              text:
                "Extract receipt details. Return only JSON with keys merchant, totalAmount, date, category, confidence, notes. Use INR if the receipt is in rupees. totalAmount must be a number only.",
              type: "text"
            }
          ],
          role: "user"
        }
      ],
      model: "claude-3-5-sonnet-20241022"
    })
  });

  const payload = await claudeResponse.json();

  if (!claudeResponse.ok) {
    return NextResponse.json(
      { error: payload.error?.message ?? "Claude receipt extraction failed." },
      { status: 400 }
    );
  }

  const text = payload.content?.find((item: { type: string; text?: string }) => item.type === "text")?.text ?? "";
  const extracted = extractJson(text);

  return NextResponse.json({
    raw: text,
    receipt: extracted
  });
}
