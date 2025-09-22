"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/currents", label: "实时洋流" },
  { href: "/species", label: "生物图鉴" },
  { href: "/reef", label: "珊瑚健康" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/70 border-b border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.6)]" />
          <span className="text-slate-100 font-semibold tracking-wide">OceanSite</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-slate-300">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "hover:text-cyan-300 transition-colors " +
                  (isActive ? " underline-active text-cyan-100" : "")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-200 hover:bg-slate-800"
          aria-label="Toggle Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm.75 4.5a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/90">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={
                    "text-slate-200 hover:text-cyan-300 " +
                    (isActive ? " underline-active text-cyan-100" : "")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}


