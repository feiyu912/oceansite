export default function Home() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100">
        探索海洋数据
        <span className="ml-3 text-cyan-400">OceanSite</span>
      </h1>
      <p className="text-slate-300 max-w-2xl">
        实时洋流、全球物种与珊瑚健康，一站式可视化浏览。
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="/currents" className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-cyan-500/50 transition-colors">
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-300">实时洋流</h3>
          <p className="text-sm text-slate-400 mt-1">NOAA 潮位与流速，卡片瀑布流展示</p>
        </a>
        <a href="/species" className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-cyan-500/50 transition-colors">
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-300">生物图鉴</h3>
          <p className="text-sm text-slate-400 mt-1">GBIF 物种检索，中文名优先</p>
        </a>
        <a href="/reef" className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-cyan-500/50 transition-colors">
          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-300">珊瑚健康</h3>
          <p className="text-sm text-slate-400 mt-1">Hakai 数据折线图（年份-健康指数）</p>
        </a>
      </div>
    </section>
  );
}
