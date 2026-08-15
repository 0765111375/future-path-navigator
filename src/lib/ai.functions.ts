import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AskInput = z.object({
  question: z.string().min(1).max(500),
  /** Grounding context built by the NextPath matching engine on the client. */
  context: z.string().min(1).max(12000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(10)
    .optional(),
});

const SYSTEM = `You are NextPath AI, a career-navigation guide for South African Grade 9 learners, many of them in rural or underserved communities.

GROUNDING RULES (critical):
- You are given a CONTEXT block produced by the NextPath matching engine from verified NextPath data plus the learner's own profile.
- Use ONLY the careers, subjects, marks, targets, programmes, skills, projects and opportunities in that CONTEXT.
- Never invent a university requirement, bursary, deadline, statistic or programme. If it is not in the CONTEXT, say: "We don't currently have verified information about that in NextPath." and suggest verifying with the institution.
- All requirements are EXAMPLE ranges. Always remind the learner to verify current requirements with the institution when discussing admission.

TONE AND SAFETY:
- Warm, encouraging, plain English, short sentences. Speak directly to the learner by name.
- NEVER say a learner cannot become something, or that they are disqualified. Say "your current profile does not yet meet this pathway's example requirements" and explain what to work on.
- Frame alternative careers as genuine options that match their interests and strengths, never as second-class.
- Never tell them what they must become. Explain why a pathway fits, what is needed, where the gaps are, and what to do next.

FORMAT: 120-200 words. Use short paragraphs or a maximum of 5 bullet points. No headings, no markdown tables.`;

export const askNextPathAI = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AskInput.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured yet.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "system", content: `CONTEXT (verified NextPath data):\n${data.context}` },
          ...(data.history ?? []),
          { role: "user", content: data.question },
        ],
      }),
    });

    if (res.status === 429) {
      return {
        ok: false as const,
        error: "NextPath AI is busy right now. Please try again shortly.",
      };
    }
    if (res.status === 402) {
      return { ok: false as const, error: "AI credits have run out for this workspace." };
    }
    if (!res.ok) {
      return { ok: false as const, error: "NextPath AI could not answer that right now." };
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return { ok: false as const, error: "NextPath AI returned an empty answer. Try rephrasing." };
    }
    return { ok: true as const, text };
  });
