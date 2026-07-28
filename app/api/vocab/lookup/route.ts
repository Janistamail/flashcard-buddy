import { NextRequest, NextResponse } from "next/server";
import { isWordLookupResult } from "@/app/lib/vocab";

export const runtime = "nodejs";

const OPENROUTER_MODEL = "openai/gpt-oss-20b:free";

const WORD_SYSTEM_PROMPT = `You are a vocabulary lookup assistant inside a Thai-English flashcard app.
The user will give you a piece of English text to look up — it could be a single word, an idiom, an acronym, a phrase, a sentence, or any other kind of English expression. Never refuse or ask for clarification based on its length or category; always answer for whatever text you're given. Respond with strict JSON only, matching exactly this shape:
{"englishMeaning": string, "thai": string[], "examples": [string, string], "didYouMean": string | null}

Rules:
- If the input looks like a misspelling of a real English word/phrase, set "didYouMean" to the corrected spelling and answer the rest of the fields for the corrected word, not the misspelled input.
- If the input is already correctly spelled (or isn't a recognizable near-miss of anything), set "didYouMean" to null and answer for the input as given.
- "englishMeaning" is a concise English-language definition/explanation of the (corrected) input.
- "thai" is an array of Thai translations/meanings, written in Thai script — include every distinct common meaning or sense (not just one), most common first.
- "examples" is an array of exactly two example sentences in English that use the (corrected) input naturally.
- Do not include any text outside the JSON object.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const mode = body?.mode;
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (mode !== "word") {
    return NextResponse.json(
      { error: `Unsupported mode: ${String(mode)}` },
      { status: 400 }
    );
  }

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "Flashcard Buddy",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: WORD_SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach OpenRouter" },
      { status: 502 }
    );
  }

  if (!response.ok) {
    const errText = await response.text();
    return NextResponse.json(
      { error: `OpenRouter request failed: ${errText}` },
      { status: 502 }
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    return NextResponse.json(
      { error: "Model returned no content" },
      { status: 502 }
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { error: "Model returned malformed JSON" },
      { status: 502 }
    );
  }

  if (!isWordLookupResult(parsed)) {
    return NextResponse.json(
      { error: "Model returned an unexpected response shape" },
      { status: 502 }
    );
  }

  return NextResponse.json(parsed);
}
