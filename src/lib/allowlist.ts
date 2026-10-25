import { redis } from "./redis";

const KEY = "allowed-emails";

function parseEmails(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((email) => normalise(email))
    .filter(Boolean);
}

export function normalise(email: string) {
  return email.trim().toLowerCase();
}

// Emails set in Vercel env vars always work, even before storage is connected
export const envAllowedEmails = parseEmails(process.env.ALLOWED_EMAILS);
export const adminEmails = parseEmails(process.env.ADMIN_EMAILS);

export const storageConnected = redis !== null;

export function isAdmin(email: string | null | undefined) {
  return Boolean(email && adminEmails.includes(normalise(email)));
}

export async function listStoredEmails(): Promise<string[]> {
  if (!redis) return [];
  const emails = await redis.smembers(KEY);
  return emails.sort();
}

export async function addEmail(email: string) {
  if (!redis) throw new Error("Storage is not connected");
  await redis.sadd(KEY, normalise(email));
}

export async function removeEmail(email: string) {
  if (!redis) throw new Error("Storage is not connected");
  await redis.srem(KEY, normalise(email));
}

export async function isAllowed(email: string) {
  const normalised = normalise(email);
  if (isAdmin(normalised) || envAllowedEmails.includes(normalised)) return true;
  if (!redis) return false;
  return (await redis.sismember(KEY, normalised)) === 1;
}
