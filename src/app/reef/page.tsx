import { fetchReefCsv } from "@/lib/fetchers";
export const revalidate = 0; // SSR, 不缓存

export default async function ReefPage() {
  const points = await fetchReefCsv();
  const labels = points.map((p) => p.year);
  const values = points.map((p) => p.score);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">珊瑚健康</h1>
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        {/* 图表放入客户端组件，避免 SSR 环境网络/Canvas 差异 */}
        {/** @ts-expect-error Async Server Component loading client */}
        <Chart labels={labels} values={values} />
      </div>
    </section>
  );
}

async function Chart(props: { labels: (string | number)[]; values: number[] }) {
  const ChartClient = (await import("./ChartClient")).default;
  return <ChartClient {...props} />;
}


