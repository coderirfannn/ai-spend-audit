import { NextResponse } from "next/server";
import { captureLeadAndSendEmail } from "@/services/lead-capture";
import { leadCaptureRequestSchema } from "@/services/lead-capture/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadCaptureRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_payload",
          message: "Lead capture payload is invalid.",
        },
        { status: 400 }
      );
    }

    const result = await captureLeadAndSendEmail(parsed.data.lead, {
      tools: parsed.data.audit.tools,
      recommendations: parsed.data.audit.recommendations,
      savings: parsed.data.audit.savings,
      summary: parsed.data.audit.summary,
    });

    if ("code" in result) {
      const status = result.code === "duplicate_submission" ? 409 : 400;

      return NextResponse.json(
        {
          ok: false,
          error: result.code,
          message: result.message,
        },
        { status }
      );
    }

    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (error) {
    // Log the real error server-side for diagnostics (safe in dev).
    // eslint-disable-next-line no-console
    console.error("/api/lead-capture error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "database_error",
        message: "Unable to capture the lead right now.",
      },
      { status: 500 }
    );
  }
}