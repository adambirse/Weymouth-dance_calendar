import { auth } from "@/auth";
import { normalise } from "@/lib/allowlist";
import { redis } from "@/lib/redis";

// Each user's timetable is the list of dancer and group names they follow
function key(email: string) {
  return `timetable:${normalise(email)}`;
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "Not signed in" }, { status: 401 });
  if (!redis) return Response.json({ follows: null });
  const follows = (await redis.get<string[]>(key(email))) ?? [];
  return Response.json({ follows });
}

export async function PUT(request: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "Not signed in" }, { status: 401 });
  if (!redis) return Response.json({ error: "Storage is not connected" }, { status: 503 });
  const body = await request.json();
  const follows = Array.isArray(body?.follows)
    ? body.follows.filter((name: unknown): name is string => typeof name === "string").slice(0, 200)
    : [];
  await redis.set(key(email), follows);
  return Response.json({ follows });
}
