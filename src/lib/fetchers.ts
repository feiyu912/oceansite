export type CurrentStation = {
  id: string;
  name: string;
  country?: string;
  level?: number | null; // 潮位 (m)
  speed?: number | null; // 流速 (m/s)
  ts?: string; // 时间戳
};

const NOAA_API = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

const FALLBACK_WL_STATIONS: Array<{ id: string; name: string }> = [
  { id: "9414290", name: "San Francisco, CA" },
  { id: "9410230", name: "La Jolla, CA" },
  { id: "9447130", name: "Seattle, WA" },
  { id: "8454000", name: "Boston, MA" },
  { id: "8724580", name: "Key West, FL" },
  { id: "8771341", name: "Galveston Pier 21, TX" },
  { id: "1612340", name: "Honolulu, HI" },
  { id: "8418150", name: "Bar Harbor, ME" },
  { id: "8534720", name: "Philadelphia, PA" },
  { id: "8761927", name: "Port Fourchon, LA" },
];

export async function fetchNoaaCurrents(): Promise<CurrentStation[]> {
  const token = process.env.NOAA_TOKEN || process.env.NEXT_PUBLIC_NOAA_TOKEN;
  const common = `format=json&time_zone=gmt&units=metric&date=latest`;

  // 从 mdapi 自动发现活跃潮位站（最多 10 个）
  const discoverWLStations = async (): Promise<Array<{ id: string; name: string }>> => {
    try {
      const md = await fetch(
        `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?products=water_level&status=active&pagesize=10`,
        { next: { revalidate: 3600 } }
      );
      if (!md.ok) throw new Error("mdapi error");
      const j = (await md.json()) as any;
      const items: any[] = j?.stations || j?.station || [];
      const mapped = items.map((s: any) => ({ id: String(s.id ?? s.stationId ?? s.station), name: s.name || s.stnm || s.stationName || `Station ${s.id}` }))
        .filter((s: any) => s.id && s.name)
        .slice(0, 10);
      if (mapped.length > 0) return mapped as Array<{ id: string; name: string }>;
      return FALLBACK_WL_STATIONS;
    } catch {
      return FALLBACK_WL_STATIONS;
    }
  };

  // 自动发现活跃 洋流 站点（最多 10 个）
  const discoverCurrentStations = async (): Promise<Array<{ id: string; name: string }>> => {
    try {
      const md = await fetch(
        `https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?products=currents&status=active&pagesize=10`,
        { next: { revalidate: 3600 } }
      );
      if (!md.ok) throw new Error("mdapi error");
      const j = (await md.json()) as any;
      const items: any[] = j?.stations || j?.station || [];
      const mapped = items.map((s: any) => ({ id: String(s.id ?? s.stationId ?? s.station), name: s.name || s.stnm || s.stationName || `Station ${s.id}` }))
        .filter((s: any) => s.id && s.name)
        .slice(0, 10);
      return mapped as Array<{ id: string; name: string }>;
    } catch {
      return [];
    }
  };

  const fetchLevel = async (id: string) => {
    const url = `${NOAA_API}?${common}&product=water_level&datum=MSL&station=${id}${token ? `&application=oceansite&token=${token}` : ""}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("NOAA water level error");
    const data = (await res.json()) as any;
    const v = data?.data?.[0];
    return v ? { level: Number(v.v), ts: v.t } : { level: null, ts: undefined };
  };

  const fetchSpeed = async (id: string) => {
    // Currents API 使用单独端点，返回 { current_predictions: [...] } 或 { data: [...] }
    const url = `https://api.tidesandcurrents.noaa.gov/api/prod/currents?${common}&station=${id}${token ? `&application=oceansite&token=${token}` : ""}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return { speed: null };
    const data = (await res.json()) as any;
    const v = data?.data?.[0] || data?.current_predictions?.[0];
    const s = v?.s ?? v?.Speed ?? v?.speed;
    return s != null ? { speed: Number(s) } : { speed: null };
  };

  const [currStations, wlStations] = await Promise.all([
    discoverCurrentStations(),
    discoverWLStations(),
  ]);

  // 优先展示有 currents 的站点，再用潮位站补足到 10 个
  const map = new Map<string, { id: string; name: string }>();
  for (const s of currStations) map.set(s.id, s);
  for (const s of wlStations) if (map.size < 10) map.set(s.id, s);
  const stations = Array.from(map.values()).slice(0, 10);

  const results = await Promise.all(
    stations.map(async (p) => {
      try {
        const [level, speed] = await Promise.all([fetchLevel(p.id), fetchSpeed(p.id)]);
        return { id: p.id, name: p.name, ...level, ...speed } satisfies CurrentStation;
      } catch (e) {
        return { id: p.id, name: p.name, level: null, speed: null } satisfies CurrentStation;
      }
    })
  );
  return results;
}

export type GbifSpecies = {
  key: number;
  scientificName: string;
  vernacularName?: string;
  thumbnail?: string;
};

export async function searchGbifSpecies(q: string): Promise<GbifSpecies[]> {
  if (!q) return [];
  const token = process.env.NEXT_PUBLIC_GBIF_TOKEN;
  const url = `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(q)}&limit=20`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("GBIF search error");
  const data = (await res.json()) as any;
  const results: GbifSpecies[] = (data?.results ?? []).map((r: any) => {
    const cn = r.vernacularNames?.find?.((n: any) => n.language === "zh" || n.language === "zho")?.vernacularName || r.vernacularName;
    return {
      key: r.key,
      scientificName: r.scientificName,
      vernacularName: cn,
      thumbnail: r?.media?.[0]?.identifier || undefined,
    } as GbifSpecies;
  });
  return results;
}

export type ReefPoint = { year: number; score: number };

export async function fetchReefCsv(): Promise<ReefPoint[]> {
  // 1) 优先使用环境变量 URL
  const url = process.env.HAKAI_REEF_CSV_URL;
  const parseCsv = (csv: string) => {
    const lines = csv.trim().split(/\r?\n/);
    const header = lines.shift() || "";
    const cols = header.split(",");
    const yearIdx = cols.findIndex((c) => /year/i.test(c));
    const scoreIdx = cols.findIndex((c) => /(score|health|index)/i.test(c));
    const points: ReefPoint[] = [];
    for (const line of lines) {
      const parts = line.split(",");
      const yr = yearIdx >= 0 ? Number(parts[yearIdx]) : Number(parts[0]);
      const sc = scoreIdx >= 0 ? Number(parts[scoreIdx]) : Number(parts.at(-1));
      if (!Number.isNaN(yr) && !Number.isNaN(sc)) points.push({ year: yr, score: sc });
    }
    points.sort((a, b) => a.year - b.year);
    return points;
  };

  // 2) 远程获取（可能在本地/某些网络环境失败）
  if (url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const csv = await res.text();
        return parseCsv(csv);
      }
    } catch {}
  }

  // 3) 回退：读取本地 public/data/reef_health.csv
  try {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const p = join(process.cwd(), "public", "data", "reef_health.csv");
    const csv = await readFile(p, "utf-8");
    return parseCsv(csv);
  } catch {}

  // 4) 最后回退：内置示例数据
  return [
    { year: 2014, score: 72 },
    { year: 2015, score: 70 },
    { year: 2016, score: 69 },
    { year: 2017, score: 71 },
    { year: 2018, score: 68 },
    { year: 2019, score: 66 },
    { year: 2020, score: 64 },
    { year: 2021, score: 65 },
    { year: 2022, score: 67 },
    { year: 2023, score: 66 },
  ];
}


