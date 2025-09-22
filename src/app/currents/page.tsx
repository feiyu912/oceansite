"use client";

import { useEffect, useState } from "react";
import type { CurrentStation } from "@/lib/fetchers";

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 animate-pulse">
      <div className="h-5 w-1/2 bg-slate-700 rounded mb-3" />
      <div className="h-4 w-1/3 bg-slate-700 rounded mb-2" />
      <div className="h-4 w-1/4 bg-slate-700 rounded" />
    </div>
  );
}

export default function CurrentsPage() {
  const [data, setData] = useState<CurrentStation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/currents", { cache: "no-store" });
        const j = await res.json();
        if (!res.ok || !j?.ok) throw new Error(j?.error || `HTTP ${res.status}`);
        if (mounted) setData(j.data as CurrentStation[]);
      } catch (e: any) {
        setError(e?.message || "获取数据失败");
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">实时洋流</h1>
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 p-3">
          加载失败：{error}
        </div>
      )}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]
        *:mb-4">
        {!data && !error && Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
        {data?.map((s) => (
          <div key={s.id} className="break-inside-avoid rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-100 font-semibold">{s.name}</div>
            <div className="mt-2 text-sm text-slate-300">潮位：{s.level ?? '—'} m</div>
            <div className="text-sm text-slate-300">流速：{s.speed ?? '—'} m/s</div>
            {s.ts && <div className="text-xs text-slate-500 mt-1">时间：{new Date(s.ts).toLocaleString()}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}


