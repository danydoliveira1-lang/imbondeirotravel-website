import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../../lib/commandCentreAuth";
import { runAutomation } from "../../../../../lib/automationEngine";

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const result = await runAutomation({ mode: "manual" });
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "The automation check could not be completed." },
      { status: 500 }
    );
  }
}
