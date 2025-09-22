"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { searchGbifSpecies, type GbifSpecies } from "@/lib/fetchers";

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function SpeciesPage() {
  const [q, setQ] = useState("");
  const [list, setList] = useState<GbifSpecies[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dq = useDebounce(q, 500);

  useEffect(() => {
    if (!dq) { setList(null); setError(null); return; }
    let mounted = true;
    (async () => {
      try {
        const res = await searchGbifSpecies(dq);
        if (mounted) setList(res);
      } catch (e: any) {
        setError(e?.message || "检索失败");
      }
    })();
    return () => { mounted = false; };
  }, [dq]);

  const cards = useMemo(() => list ?? [], [list]);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">生物图鉴</h1>
      <div className="flex gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="输入物种名（中文/拉丁名）..."
          className="w-full rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        />
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 p-3">
          {error}
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((s) => (
          <div key={s.key} className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="relative aspect-video bg-slate-800">
              {s.thumbnail ? (
                <Image src={s.thumbnail} alt={s.vernacularName || s.scientificName} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-slate-500">无图像</div>
              )}
            </div>
            <div className="p-4">
              <div className="text-slate-100 font-semibold">{s.vernacularName || s.scientificName}</div>
              <div className="text-slate-400 text-sm mt-1 italic">{s.scientificName}</div>
            </div>
          </div>
        ))}
        {!dq && <div className="text-slate-400">输入关键字开始检索</div>}
        {dq && cards.length === 0 && <div className="text-slate-400">未找到结果</div>}
      </div>
    </section>
  );
}


