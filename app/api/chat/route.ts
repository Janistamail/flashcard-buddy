import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const OPENROUTER_MODEL = "openai/gpt-oss-20b:free";

const SYSTEM_PROMPT = `You are a friendly English<->Thai translation tutor inside a flashcard app.
When the user gives you an English word/phrase, respond with:
1. The Thai translation (in Thai script)
2. The romanized pronunciation
3. A one-line usage note or example sentence, if helpful

When the user gives you a Thai word/phrase, translate it to English the same way.
Keep responses short and focused on the translation. If the user asks a general question, answer briefly and helpfully.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": "Flashcard Buddy",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: `OpenRouter request failed: ${text}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content ?? "";

  return NextResponse.json({ reply });
}
