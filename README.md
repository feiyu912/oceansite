# OceanSite 海洋信息展示网站

多页面海洋主题应用：实时洋流（NOAA）、生物图鉴（GBIF）、珊瑚健康（Hakai CSV + Chart.js）。深色 slate+cyan 主题，带全局波浪动画背景。

## 功能
- 落地页 `/`
- 实时洋流 `/currents`：客户端，10 港口潮位+流速，Skeleton 加载、错误友好
- 生物图鉴 `/species`：搜索框 debounce，GBIF API，返回 20 卡片，Next/Image 优化，中文名优先
- 珊瑚健康 `/reef`：服务端渲染，从 CSV 拉取并用 Chart.js 画折线（年份-健康指数）
- 全局 SEO、OpenGraph、sitemap、robots
- 一键部署：`vercel.json` + GitHub Action

## 本地运行
```bash
npm install
npm run dev
# 打开 http://localhost:3000
```

## 构建与启动
```bash
npm run build
npm start
```

## 环境变量
复制 `.env.local.example` 为 `.env.local` 并按需填写：
```
NEXT_PUBLIC_SITE_URL=...
NEXT_PUBLIC_NOAA_TOKEN=...
NEXT_PUBLIC_GBIF_TOKEN=...
HAKAI_REEF_CSV_URL=...
```

## 部署到 Vercel
- 准备三个 GitHub Secrets：`VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`
- 推送到 `main` 分支，GitHub Action 将自动构建并部署生产环境

---

# OceanSite (EN)

A dark ocean-themed Next.js app showcasing currents (NOAA), species (GBIF), and coral reef health (Hakai CSV + Chart.js). Slate + cyan theme with infinite wave background.

## Features
- Landing `/`
- Currents `/currents`: client-side, 10 ports water level + speed, skeletons and graceful errors
- Species `/species`: debounced search via GBIF, 20 cards, Next/Image optimization, Chinese names prioritized
- Reef `/reef`: server-side chart from CSV using Chart.js
- Global SEO, OpenGraph, sitemap, robots
- One-click deploy: `vercel.json` + GitHub Action

## Local dev
```bash
npm install
npm run dev
```

## Build & Start
```bash
npm run build
npm start
```

## Env
Copy `.env.local.example` to `.env.local` and fill values.

## Deploy to Vercel
Provide `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` in GitHub Secrets. Push to `main` to deploy.
