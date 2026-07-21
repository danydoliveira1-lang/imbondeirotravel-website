import { NextResponse } from "next/server";
import { configurationReady, isAuthenticated } from "../../../../lib/commandCentreAuth";
export async function GET() { return NextResponse.json({ configured: configurationReady(), authenticated: await isAuthenticated() }); }
