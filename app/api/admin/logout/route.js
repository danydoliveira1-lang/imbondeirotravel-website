import { NextResponse } from "next/server";
import { sessionCookie } from "../../../../lib/commandCentreAuth";
export async function POST() { const response = NextResponse.json({ ok: true }); response.cookies.set(sessionCookie.name, "", { httpOnly: true, path: "/", maxAge: 0 }); return response; }
