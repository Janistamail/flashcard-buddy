import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

// `proxy.ts` already blocks unauthenticated requests to these routes at the
// edge, but every ownership-scoped API route needs the caller's userId
// in-hand anyway (to filter/stamp rows), so it re-derives the session here
// and treats a missing one as a defense-in-depth 401.
export async function requireUserId(): Promise<
  { userId: string } | { unauthorized: NextResponse }
> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      unauthorized: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { userId };
}
