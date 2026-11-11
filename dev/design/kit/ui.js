/*
 * Building blocks for pages: each returns an HTML string and mirrors one RN component
 * (named in kit/ui.css). Pages compose these; they never hand-write a component's markup,
 * so a change here shows up on every page.
 *
 * Icons and categories are the app's real files (icons.js → window.SoNhaIcons,
 * category-data.js → window.SoNhaCategories).
 */
(() => {
  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );

  const categories = () => window.SoNhaCategories ?? [];
  const cat = (id) => categories().find((c) => c.id === id) ?? categories()[0];

  /** features/entries/money.ts formatAmount: dots every three digits, then " ₫". */
  const vnd = (n) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`;

  const UI = {
    esc,
    cat,
    categories,
    vnd,

    phone(inner) {
      return `<div class="phone">
        <div class="status-bar"><span>9:41</span><span class="island"></span><span>100%</span></div>
        ${inner}
        <div class="home-indicator"></div>
      </div>`;
    },

    /** components/icon.tsx: stroke 1.8, round caps. */
    icon(name, size = 22) {
      const d = window.SoNhaIcons?.[name] ?? "";
      return `<svg class="ico" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
    },

    /** features/entries/components/category-icon.tsx: icon on the category's tint. */
    catIcon(id, size = 40) {
      const c = cat(id);
      return `<span class="cat-icon" style="width:${size}px;height:${size}px;background:var(--tint-${c.tint}-bg);color:var(--tint-${c.tint}-fg)">${UI.icon(c.icon, Math.round(size * 0.5))}</span>`;
    },

    /** components/button.tsx — variant: primary | soft | ghost | danger */
    button(label, { variant = "primary", icon = null, disabled = false } = {}) {
      return `<span class="btn btn-${variant}${disabled ? " disabled" : ""}">${icon ? UI.icon(icon, 20) : ""}<span>${esc(label)}</span></span>`;
    },

    /** components/icon-button.tsx — variant: card | plain */
    iconButton(name, { variant = "card", disabled = false } = {}) {
      return `<span class="icon-btn icon-btn-${variant}${disabled ? " disabled" : ""}">${UI.icon(name, 20)}</span>`;
    },

    /** components/nav-header.tsx */
    navHeader({ left = "back", title = "", right = "" } = {}) {
      return `<div class="nav-header">${left ? UI.iconButton(left) : "<span></span>"}<span class="nav-title">${esc(title)}</span>${right || "<span></span>"}</div>`;
    },

    /** components/chip.tsx */
    chip(label, { on = false, soft = false, icon = null } = {}) {
      return `<span class="chip${on ? " on" : ""}${soft ? " soft" : ""}">${icon ? UI.icon(icon, 16) : ""}${esc(label)}</span>`;
    },

    /** features/entries/components/month-header.tsx */
    monthHeader(label, { nextDisabled = true } = {}) {
      return `<div class="month-header"><div><div class="t-meta">Nhà Mình</div><div class="t-heading-lg">${esc(label)}</div></div>
        <div class="arrows">${UI.iconButton("chart")}<span class="gap"></span>${UI.iconButton("chevron-left")}<span class="${nextDisabled ? "disabled" : ""}">${UI.iconButton("chevron-right")}</span></div></div>`;
    },

    /** components/segmented.tsx */
    segmented(options, on) {
      return `<div class="segmented">${options.map((o) => `<span class="${o === on ? "on" : ""}">${esc(o)}</span>`).join("")}</div>`;
    },

    /** features/stats/components/period-picker.tsx: ‹ label › */
    periodNav(label, { nextDisabled = true } = {}) {
      return `<div class="period-nav">${UI.iconButton("chevron-left")}<span class="t-heading-sm">${esc(label)}</span><span class="${nextDisabled ? "disabled" : ""}">${UI.iconButton("chevron-right")}</span></div>`;
    },

    /** features/stats/components/stats-totals.tsx */
    statsTotals({ spent, earned = 0, count, perDay }) {
      const left = earned - spent;
      const sign = left >= 0 ? "+" : "−";
      return `<div class="summary"><span class="t-meta">Đã chi</span><span class="t-amount-xl">${vnd(spent)}</span>
        ${earned ? `<div class="row t-caption"><span>Thu <b class="income">+${vnd(earned)}</b></span><span>Còn lại <b>${sign}${vnd(Math.abs(left))}</b></span></div>` : ""}
        <div class="row t-caption"><span><b>${count}</b> ghi chép</span><span>TB mỗi ngày <b>${vnd(perDay)}</b></span></div></div>`;
    },

    /** features/stats/components/category-bars.tsx. rows = [{ cat, amount, count }] */
    categoryBars(title, rows) {
      const total = rows.reduce((s, r) => s + r.amount, 0) || 1;
      return `<div class="stat-section"><div class="section-label">${esc(title)}</div><div class="day-card">${rows
        .map((r) => {
          const pct = Math.round((r.amount / total) * 100);
          return `<div class="bar-row">${UI.catIcon(r.cat, 36)}<div class="text"><div class="line"><span class="name">${esc(UI.cat(r.cat).name)}</span><span class="amt">${vnd(r.amount)}</span></div>
            <div class="track"><i style="width:${Math.max(pct, 2)}%"></i></div><div class="line t-meta"><span>${r.count} ghi chép</span><span>${pct}%</span></div></div></div>`;
        })
        .join("")}</div></div>`;
    },

    /** features/stats/components/plain-counts.tsx. rows = [{ cat, count }] */
    plainCounts(rows) {
      return `<div class="stat-section"><div class="section-label">Việc không có tiền</div><div class="chips wrap">${rows
        .map((r) => `<span class="chip soft">${esc(UI.cat(r.cat).name)} · ${r.count} lần</span>`)
        .join("")}</div></div>`;
    },

    /** features/stats/components/year-bars.tsx. values = 12 numbers or null (future). */
    yearBars(values, { current = 10, picked = null } = {}) {
      const max = Math.max(...values.filter((v) => v != null), 1);
      const pick =
        picked != null && values[picked] != null
          ? `<span class="pick">T${picked + 1} · ${vnd(values[picked])}</span>`
          : "";
      return `<div class="stat-section"><div class="section-label split">Chi theo tháng${pick}</div><div class="year-bars">${values
        .map((v, i) => {
          const h = v == null ? 0 : Math.max((v / max) * 100, v > 0 ? 3 : 0);
          const cls = i === picked ? "picked" : i === current ? "current" : "";
          return `<div class="col ${cls}"><div class="bar-area"><i style="height:${h}%"></i></div><span class="t-meta">T${i + 1}</span></div>`;
        })
        .join("")}</div></div>`;
    },

    /** features/entries/components/month-summary.tsx */
    summary({ spent, earned = 0, count, label = "Đã chi tháng này" }) {
      return `<div class="summary"><span class="t-meta">${esc(label)}</span><span class="t-amount-xl">${vnd(spent)}</span>
        <div class="row t-caption">${earned ? `<span>Thu <b class="income">+${vnd(earned)}</b></span>` : ""}<span><b>${count}</b> ghi chép</span></div></div>`;
    },

    /** features/entries/components/entry-row.tsx. e = { cat, title, time, note?, amount? } */
    entryRow(e) {
      const c = cat(e.cat);
      const sub = [c.name, e.time, e.note].filter(Boolean).join(" · ");
      const amt =
        e.amount == null
          ? ""
          : c.money === "income"
            ? `<span class="amt income">+${vnd(e.amount)}</span>`
            : `<span class="amt">${vnd(e.amount)}</span>`;
      return `<div class="entry-row">${UI.catIcon(c.id, 40)}<div class="text"><div class="title">${esc(e.title)}</div><div class="sub">${esc(sub)}</div></div>${amt}</div>`;
    },

    /** features/entries/components/day-section-header.tsx + the day's card of rows. */
    day(label, entries) {
      const total = entries
        .filter((e) => e.amount != null && cat(e.cat).money === "expense")
        .reduce((s, e) => s + e.amount, 0);
      return `<div class="day-head"><span>${esc(label)}</span><span class="t-caption">${total ? vnd(total) : ""}</span></div>
        <div class="day-card">${entries.map(UI.entryRow).join("")}</div>`;
    },

    /** components/fab.tsx */
    fab(label = "Ghi mới") {
      return `<span class="fab">${UI.icon("plus", 22)}${esc(label)}</span>`;
    },

    /** features/entries/components/category-grid.tsx */
    categoryGrid(selected = null, { compact = false } = {}) {
      return `<div class="cat-grid${compact ? " compact" : ""}">${categories()
        .map(
          (c) =>
            `<div class="cat-tile${c.id === selected ? " on" : ""}">${UI.catIcon(c.id, 40)}<span>${esc(c.name)}</span></div>`,
        )
        .join("")}</div>`;
    },

    /** components/text-field.tsx */
    field(
      value,
      { placeholder = "", focus = false, multi = false, suffix = "", icon = null } = {},
    ) {
      return `<div class="field${focus ? " focus" : ""}${multi ? " multi" : ""}">${icon ? `<span class="muted">${UI.icon(icon, 20)}</span>` : ""}${value ? `<span>${esc(value)}</span>` : `<span class="ph">${esc(placeholder)}</span>`}${suffix ? `<span class="suffix">${esc(suffix)}</span>` : ""}</div>`;
    },

    label(text, optional = false) {
      return `<div class="section-label">${esc(text)}${optional ? " <small>(không bắt buộc)</small>" : ""}</div>`;
    },

    /** components/confirm-dialog.tsx */
    dialog({ title, message, confirm, cancel = "Huỷ", danger = false }) {
      return `<div class="scrim"><div class="dialog"><div class="t-heading-md">${esc(title)}</div>${message ? `<div class="t-body-lg">${esc(message)}</div>` : ""}
        <div class="btns">${danger ? `${UI.button(cancel)}${UI.button(confirm, { variant: "danger" })}` : `${UI.button(confirm)}${UI.button(cancel, { variant: "soft" })}`}</div></div></div>`;
    },
  };

  window.UI = UI;
})();
