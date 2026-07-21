import { NextResponse } from "next/server";
import { configurationReady, makeSession, sessionCookie } from "../../../../lib/commandCentreAuth";

export async function POST(request) {
  if (!configurationReady()) return NextResponse.json({ error: "The live Command Centre has not been configured yet. Complete the Supabase and Vercel environment setup first." }, { status: 503 });
  const { email, password } = await request.json();
  if (email !== process.env.COMMAND_CENTRE_EMAIL || password !== process.env.COMMAND_CENTRE_PASSWORD) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookie.name, makeSession(email), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: sessionCookie.maxAge });
  return response;
}
