# CloudPipe Design Lab

每日工作報告嘅高保真視覺化。每日一個流派，學習閉環持續優化。

> 「設計唔係裝飾，係洞察」 — Lab Manifesto

## Audience
CEO Kira（Joe Cheok）一人。內部審美 + 設計學習閉環。

## 流派 Rotation Pool（10）
1. **Field.io 運動詩學** — WebGL + GSAP particle 流 + 滾動驅動 *(Day 001)*
2. Magazine Editorial — Vogue / Wallpaper 風，紙白 + 大圖文混排
3. Brutalist Swiss — Pentagram 風，極簡 grid + 無動畫
4. Cinematic Scroll — Apple 風，全屏 hero + ScrollTrigger pin
5. Kenya Hara 東方極簡 — 留白 90% + 一個焦點
6. Sagmeister 實驗先鋒 — 反 grid + 手作字 + 拼貼
7. 80s Memphis 復古 — 鮮色幾何 + 圖騰
8. Glitch / Cyberpunk — 像素噪訊 + chromatic aberration
9. Bauhaus 幾何 — 原色 + 圓方三角
10. Risograph 印刷感 — 兩色套印錯位 + 噪點

## 學習閉環 SOP

```
Day N 工作日 → Day N+1 設計師（AI）讀前日 retrospective
    ↓
選今日流派 + 對應前日教訓做修正（避免重覆同類型）
    ↓
建立 days/YYYY-MM-DD/{index.html, style.css, motion.js}
    ↓
完工自評填 retrospectives/YYYY-MM-DD-dayNNN-retrospective.md（5 維度）
    ↓
CEO viewing → 給反應
    ↓
反應寫入 retrospective「用戶反應」section
    ↓
↻ 回到步驟 1（明日設計師讀今日 retrospective）
```

## 結構

```
design-lab/
├── index.html                    # Lab 主頁 magazine cover 風列表
├── README.md                     # 本文件
├── shared/
│   ├── fonts.css                 # 三字體 type system（Fraunces / Inter / JetBrains Mono）+ palette
│   └── particles.js              # 可重用 Three.js particle field（formations + morph）
├── days/
│   └── YYYY-MM-DD/
│       ├── index.html            # 該日主頁
│       ├── style.css             # 該日專屬 CSS
│       └── motion.js             # GSAP + Three 動效
└── retrospectives/
    └── YYYY-MM-DD-dayNNN-retrospective.md
```

## 技術 Stack
- 純前端 HTML / CSS / JS
- CDN：GSAP 3.12.5 + ScrollTrigger + Three.js r160
- 無 build tool，雙擊 `index.html` 即見效
- 字體：Google Fonts only（Fraunces · Inter · JetBrains Mono）
- 由 `file://` 直接打開，無 CORS issue
- 所有資源 CDN 或相對路徑

## 設計原則（必守）

### 反對清單
- ❌ Tailwind generic card grid
- ❌ Bootstrap 陣列
- ❌ 漸層 hero + CTA button
- ❌ shadcn muted card
- ❌ emoji decoration（emoji 只能喺資料本身出現如 🔴🟡🟢 priority）
- ❌ rounded-2xl 軟弱風

### 必守原則
- ✅ ≥40% 留白
- ✅ Magazine typography（serif display + mono accent + sans body）
- ✅ 單一 accent color（每日選一）
- ✅ Tabular nums for 所有數字 metric
- ✅ ScrollTrigger 或同級 scroll choreography（每 section pin / 視差）
- ✅ 數字做視覺主角（big display + animated counter）
- ✅ Reduced-motion 必須有 graceful fallback

## 啟動

```sh
open ~/.openclaw/design-lab/index.html
# 或直接打開 Day 001
open ~/.openclaw/design-lab/days/2026-06-04/index.html
```

## 命名規範
- Day folder：`YYYY-MM-DD`
- Retrospective：`YYYY-MM-DD-day{NNN}-retrospective.md`（NNN 三位數編號）
- Day 編號永久遞增（即使跳日），方便長期參考。
