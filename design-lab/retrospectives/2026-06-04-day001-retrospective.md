# Day 001 Retrospective · 2026-06-04
## Style: Field.io 運動詩學

### 5 維度自評（1-10）
- Typography craft: 8/10 — Fraunces opsz 144 + italic accent + JetBrains Mono mid-caps + tabular nums，三字體分工清晰；headline 跳行手寫斷句保留呼吸。扣分位：cover date 大字撞 viewport 邊緣 risk，未做極端 narrow 螢幕測試。
- Motion design: 8/10 — 9 個 scene 各自 particle formation morph（cloud→cluster→column→grid→wave→ring→drift），逐 char/line stagger，counter tween，typewriter 根因，trustbar scaleX。扣分位：scroll-snap 未強制（保留自由 scroll 體驗），故事節奏靠用戶自主控制。
- Information density: 9/10 — 完整呈現 7 section + cover + footer；唔縮減任何原報告數據；30 FAQ、179 Hermes jobs、Trust 4 region baseline、6 milestone、5 actions 全保留。
- Conceptual coherence: 9/10 — Field.io 流派定義落實：粒子場 + 大量負空間 + 單一 accent red + magazine editorial + tabular footnote。emoji 只出現喺資料本身（🔴🟡🟢 priority）。
- Technical execution: 8/10 — pure CDN，雙擊 index.html 即跑，DPR cap 2，3400 particles，prefers-reduced-motion 完整回退到 0.4× particle + 靜態渲染。扣分位：未做 perf trace；極舊 GPU 可能跌 frame。
**Total**: 42/50

### 觀察
- 做得好嘅地方：粒子 morph 同 scroll 切換綁定喺單一 choreography table（motion.js 的 `choreo` object），新 section 加入只需 declare 一條 entry。Trust bar 4 region 用「視覺天花板 30%」normalize 弱區（JP 3%）視覺感受唔會被壓平。
- 落差最大（a11y）：因為禁用第三方 SplitText 付費 plugin，line/char split 用自寫 fallback，semantic 上唔完美（screen reader 會逐字念）；長遠 a11y 要補。
- 落差最大（事實性）：**§ 02 數據核實不嚴，CEO 反映** — SDD № 02 沿用 v2 標題嘅 seven-region 字眼但實際 region 列表只有 6 個（MO/HK/JP/TW/MY/GLOBAL）；v1 嘅 KR/VN/IDN/TH 已喺 v2 移除但標題未同步。Sub-agent 生成 § 02 時冇 cross-check SDD body vs title 一致性，亦冇引 source 路徑做 audit。連帶 § 01 lede 同 § 06 milestone note 都複製咗錯誤嘅 seven-region 字眼（本次只修 § 02，§ 01/§ 06 待 Day 002 sweep）。
- 用戶（CEO）反應：**嘩分 7/10；§ 02 數據不正確；Day 002 由 AI Director 自選流派。**

### 明日繼承
- 保留：shared/fonts.css + shared/particles.js 兩個基建可直接 reuse；type system 三字體配色一致性帶入 Day 002。
- 修正：cover date 大字 narrow viewport 需 fluid 收斂；hotfix typewriter 在 4 卡同時觸發時有節奏堆疊感，下一日如再用打字機要 sequential 化。
- **修正（fact-check pass）**：**Day 002 開工前先建 fact-check pass，subagent 必須引 source 路徑**——每條 quantitative claim（份數 / 區數 / 日期 / 百分比）係 § 草稿提交時必須附 `source: <abs path>:<line>` 註解；submission 時 verifier subagent 用 grep / Read 驗證每條 source 對得上，唔對嘅整條 reject 重生。今日 § 02 region 數（六 vs 七）、「118 SQLite」、「446 md」呢類 high-risk metric 全部要進 fact-check 白名單。
- **修正（site-wide sweep）**：除 § 02 外，§ 01 lede（line 103）同 § 06 milestone note（line 422）原本仍寫 seven-region 標題嘅 SDD v2，已於 2026-06-04 Day 002 收尾 sweep 統一修齊（HTML grep after = 0 hits）。SDD v2 自身 title-body 不一致根因亦同步修正並加 audit note。
- **Day 002 風格落定（AI Director 決策）**：**Brutalist Swiss（Pentagram 風）** — CEO 授權自選，AI Director lock-in 理由：
  1. **最大對比於 Day 1** — Day 1 係 organic 粒子流，Day 2 翻轉做 grid violence + 銳利色塊，建立 Lab range（兩日唔同流派，證明能力光譜）。
  2. **填補 Day 1 缺口** — Day 1 5 維度自評 typography craft 8/10 + motion design 8/10 各扣 2 分，主要缺 typographic hierarchy discipline 同 pin storytelling；Brutalist Swiss 強制 SplitText 大字爆裂 + ScrollTrigger pin section，直接補完弱項。
  3. **CEO 想要更高「嘩」分** — Day 1 用戶嘩分 7/10，Brutalist Swiss 嘅銳利對比 + Flip 板塊重組視覺衝擊高過 Day 1 editorial slow burn。
  4. **為 Day 003 留中庸地帶** — Day 3 預留 Magazine Editorial（Vogue / Wallpaper），做 organic（Day 1）↔ brutalist（Day 2）嘅成熟收斂。
- **Day 002 design constraints**（明日繼承執行 spec）：
  - Palette：純黑 #000000 / 純白 #FFFFFF / 單一鮮黃 #FFE500（或鮮紅 #FF0000，二選一最終由開工時定）。
  - Typography：Helvetica Neue / Inter Display 至 weight 900；no serif；trackin 緊到 -0.04em。
  - Layout：12-col grid 強制可見（admin debug overlay 風），column gutter 用作視覺武器。
  - Motion：GSAP SplitText 文字爆裂（chars + words 雙層 stagger）+ Flip 板塊位置重組 + ScrollTrigger pin 每 section 5-8 秒。
  - 數字：仍用 Tabular Nums + Mono accent（複用 Day 1 fonts.css）。
  - 內容軸：今日（2026-06-04）工作報告 = 即修數據（§ 01/§ 06 sweep + SDD v2 修正）+ Day 002 流派落定 + 流派 audit。
  - Particle 完全棄用（Day 1 已飽和；Day 2 做純印刷感，去 WebGL）。
  - 反 web design tropes 同 Day 1 一樣嚴格（emoji 只出現喺 raw data layer）。

### 學習筆記
- 新技術點：
  - Three.js BufferGeometry 雙 snapshot morph — 用兩個 Float32Array 維度交換 + 單一 progress tween 比 attribute swap 性能更穩。
  - GSAP counter tween 用 `onUpdate` 直接寫 textContent，配合 `toFixed(decimals)` 解決 93.62 這類非整數 metric。
  - CSS `font-variation-settings` Fraunces SOFT axis — italic emphasis 既可以 colored 又可以微提 SOFT 50 暗示「強調」。
- 引用參考：field.io、Bruno Simon、Pentagram digital 嘅 magazine grid、Active Theory 嘅 layered chrome。
- 之後重用嘅 pattern：
  - `data-scene` + `choreo` table 嘅 declarative scroll choreography。
  - `chrome--rail-l/r` 90° rotation 標籤（雜誌 spine 感）。
  - Trust bar `--weak` modifier 把最弱數據自動上 accent color。

### AI Director 自評欄

> 由 AI Director 以第三方視角對 Day 001 出貨做誠實 calibration。對齊用戶（CEO）真實感受 + subagent 內部自評之間嘅 delta，避免「sub-agent 過度樂觀」嘅系統性 bias。

- **Day 001 用戶嘩分**：7/10（CEO 直接 feedback）
- **Day 001 subagent 5 維度 self-score**：42/50 = **8.4/10**
- **Delta**：subagent +1.4 分 over user — 主要因 § 02 數據錯（用戶體感即時拉低）＋ 缺 ScrollTrigger pin storytelling（subagent self-score 冇 penalize 因為 motion design 自評只看 particle 同 counter 完成度）。
- **真實對齊分數（mid 用戶 + AI 平均，含 § 02 扣分）**：**7.5 / 10**
- **Day 001 最強**：粒子 morph 7 形態跨 scene 同步 + 11 個 animated counter 全部 tabular nums 對齊 + Trust bar 4 region normalize 視覺天花板。
- **Day 001 最弱**：fact-check 唔嚴（root cause: subagent 冇引 source 路徑）+ 無 pin storytelling（scroll-snap 都未強制，故事節奏失控）。
- **Day 002 預估 calibration target**：嘩分 ≥ 8.0 / 10（用 Brutalist Swiss 嘅 SplitText 暴力 + ScrollTrigger pin 補返 Day 1 兩項弱項，預期用戶感受可以撞穿 8）；subagent self-score 必須先過 fact-check pass 先計入，避免重複 +1.4 bias。
