import { NextResponse } from "next/server";
import { runAutomation } from "../../../../lib/automationEngine.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (
    !cronSecret ||
    authorization !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await runAutomation();

    return NextResponse.json({
      ok: true,
      trigger: "scheduled",
      result,
    });
  } catch (error) {
    console.error("Scheduled automation failed:", error);

    return NextResponse.json(
      {
        error: "Scheduled automation failed.",
      },
      { status: 500 }
    );
  }
}
