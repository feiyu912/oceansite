import { NextResponse } from "next/server";
import { fetchNoaaCurrents } from "@/lib/fetchers";

export async function GET() {
  try {
    const data = await fetchNoaaCurrents();
    return NextResponse.json({ ok: true, data }, { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=60" } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}


