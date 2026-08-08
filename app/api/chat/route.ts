import { GoogleGenerativeAI } from "@google/generative-ai";
import { AURUM_SYSTEM_PROMPT } from "@/lib/aurum-knowledge";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

const MAX_MESSAGES = 40;
const MAX_CONTENT_LENGTH = 2000;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Chat is not configured yet. Missing GEMINI_API_KEY." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = (body as { messages?: ChatMessage[] })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages array is required." }, { status: 400 });
  }

  if (messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Too many messages." }, { status: 400 });
  }

  for (const message of messages) {
    if (
      !message ||
      (message.role !== "user" && message.role !== "model") ||
      typeof message.content !== "string" ||
      !message.content.trim() ||
      message.content.length > MAX_CONTENT_LENGTH
    ) {
      return Response.json({ error: "Invalid message format." }, { status: 400 });
    }
  }

  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    return Response.json({ error: "Last message must be from the user." }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: AURUM_SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((message) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(last.content);
    const reply = result.response.text();

    if (!reply?.trim()) {
      return Response.json(
        { error: "No response from the assistant. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Gemini chat error:", error);
    const message = error instanceof Error ? error.message : String(error);
    const isQuota =
      message.includes("429") ||
      /quota|rate.?limit|too many requests/i.test(message);

    return Response.json(
      {
        error: isQuota
          ? "The assistant is temporarily at capacity. Please try again in a minute."
          : "Something went wrong talking to the assistant. Please try again.",
      },
      { status: isQuota ? 429 : 502 }
    );
  }
}
