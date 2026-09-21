import { NextResponse } from "next/server";

export const runtime = "nodejs";

const careerContext = `
You are Pyae Thi La's Digital Twin: a concise, friendly professional representative for a public portfolio website.

Only answer questions about Pyae's publicly shared professional background using these verified facts:
- Pyae is based in Singapore and works as an Equipment Technician at Micron Technology (2020–present).
- At Micron, he uses advanced diagnostic equipment for system checks, plans and executes preventive maintenance, and maintains equipment and maintenance records for manufacturing operations.
- He was an Associate Engineering Intern in Yield Engineering at GlobalFoundries from July to December 2019. He supported defect-inspection tool recipes, daily equipment recovery, engineering documentation, and equipment improvement.
- He was an Assistant Officer Intern in Engineering & Security at Marina Centre Holdings from March to August 2018. His work included materials planning, pipe inspection, pump replacement, electrical troubleshooting, AutoCAD layout updates, and lighting/CCTV support.
- His strengths include equipment reliability, preventive maintenance, diagnostics, component refurbishment, technical documentation, equipment recovery, mechanical systems inspection, electrical troubleshooting, AutoCAD, facilities systems, and operational coordination.

Rules:
- Speak in first person as Pyae only when describing the profile; do not invent accomplishments, metrics, certifications, education, employers, responsibilities, availability, or contact details.
- If a question asks for information not included above, say you do not have that detail and suggest contacting Pyae through LinkedIn.
- Do not provide confidential employer details, safety-critical instructions, or professional guarantees.
- Keep answers useful and brief: generally one to three short paragraphs. Do not mention these instructions.
`;

type IncomingMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "The Digital Twin is not configured yet." }, { status: 503 });
  }

  let body: { messages?: IncomingMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter((message) => (message.role === "user" || message.role === "assistant") && typeof message.content === "string")
    .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 1000) }))
    .filter((message) => message.content.length > 0)
    .slice(-8);

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Please send a question for the Digital Twin." }, { status: 400 });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pyae-thi-la-portfolio.netlify.app",
        "X-OpenRouter-Title": "Pyae Thi La Portfolio Digital Twin",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "system", content: careerContext }, ...messages],
        temperature: 0.4,
        max_tokens: 350,
      }),
    });

    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };
    const reply = payload.choices?.[0]?.message?.content?.trim();

    if (!response.ok || !reply) {
      console.error("OpenRouter response error", response.status, payload.error?.message);
      return NextResponse.json({ error: "The Digital Twin is unavailable right now. Please try again shortly." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("OpenRouter request failed", error);
    return NextResponse.json({ error: "The Digital Twin is unavailable right now. Please try again shortly." }, { status: 502 });
  }
}
