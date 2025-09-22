import { NextResponse } from "next/server";

const NOAA_API = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const station = searchParams.get("station") || "9414290"; // San Francisco
  const token = process.env.NEXT_PUBLIC_NOAA_TOKEN;
  const common = `format=json&time_zone=gmt&units=metric&date=latest`;
  const url = `${NOAA_API}?${common}&product=water_level&datum=MSL&station=${station}${token ? `&application=oceansite&token=${token}` : ""}`;

  const info: any = { url, hasToken: Boolean(token) };
  try {
    const res = await fetch(url, { cache: "no-store" });
    info.status = res.status;
    info.ok = res.ok;
    const text = await res.text();
    info.body = text.slice(0, 4000);
    return NextResponse.json(info, { status: res.ok ? 200 : 502 });
  } catch (e: any) {
    info.error = e?.message || String(e);
    return NextResponse.json(info, { status: 500 });
  }
}


