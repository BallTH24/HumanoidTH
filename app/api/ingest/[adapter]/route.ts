import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SourceType } from "../../../../generated/prisma";
import { runAdapter } from "@/lib/ingest/adapters";

type Params = Promise<{ adapter: string }>;

export async function POST(request: Request, { params }: { params: Params }) {
  // Guard ingestion API: verify admin session cookie or Basic Auth header
  const cookieStore = await cookies();
  const hasAdminCookie = cookieStore.get("admin_session")?.value === "true";

  let hasValidBasicAuth = false;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    try {
      const expectedUser = process.env.ADMIN_BASIC_USER || "creativelab.co.th@gmail.com";
      const expectedPassword = process.env.ADMIN_BASIC_PASSWORD || "I@M_Cr3LabTH_F4M";
      const [user, password] = atob(authHeader.slice("Basic ".length)).split(":");
      if (user === expectedUser && password === expectedPassword) {
        hasValidBasicAuth = true;
      }
    } catch {}
  }

  if (!hasAdminCookie && !hasValidBasicAuth) {
    return NextResponse.json(
      { error: "Unauthorized. Admin credentials required to trigger data pulls." },
      { status: 401 }
    );
  }

  const { adapter: adapterParam } = await params;
  const body = await request.json().catch(() => ({}));
  const adapter = adapterParam.toUpperCase() as SourceType;
  const query = String(body.query ?? "");
  const limit = Number(body.limit ?? 10);

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    const result = await runAdapter(adapter, { query, limit });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown ingestion error" },
      { status: 500 }
    );
  }
}
