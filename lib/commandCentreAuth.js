import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "imb_cc_session";
const MAX_AGE = 60 * 60 * 12;

function secret() {
  return process.env.COMMAND_CENTRE_SESSION_SECRET || "";
}

function signature(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function configurationReady() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.COMMAND_CENTRE_EMAIL && process.env.COMMAND_CENTRE_PASSWORD && secret());
}

export function makeSession(email) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifySession(token) {
  if (!token || !secret()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = signature(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return value.exp > Date.now() && value.email === process.env.COMMAND_CENTRE_EMAIL;
  } catch { return false; }
}

export async function isAuthenticated() {
  const store = await cookies();
  return verifySession(store.get(COOKIE)?.value);
}

export const sessionCookie = { name: COOKIE, maxAge: MAX_AGE };
