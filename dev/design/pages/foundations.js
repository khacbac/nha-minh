/* Colours, type and icons, read live from tokens.js and icons.js. */
(() => {
  const swatch = (hex, name) =>
    `<div class="swatch"><div class="chip-color" style="background:${hex}"></div><div class="meta"><span>${UI.esc(name)}</span><code>${UI.esc(hex)}</code></div></div>`;
  const flat = (obj, prefix) =>
    Object.entries(obj).flatMap(([k, v]) =>
      typeof v === "string" ? [[`${prefix}.${k}`, v]] : flat(v, `${prefix}.${k}`),
    );

  Design.page({
    id: "foundations",
    title: "Foundations",
    group: "Library",
    source: "apps/mobile/src/lib/theme/tokens.js, icons.js",
    render() {
      const t = window.SoNhaTokens;
      if (!t) return '<p class="empty">tokens.js not loaded.</p>';
      const colours = Object.entries(t.semantic)
        .map(
          ([group, values]) =>
            `<section><h2>${UI.esc(group)}</h2><p class="src">semantic.${UI.esc(group)}.*</p><div class="row">${flat(
              values,
              group,
            )
              .map(([n, hex]) => swatch(hex, n))
              .join("")}</div></section>`,
        )
        .join("");
      const type = Object.entries(t.typeScale)
        .map(
          ([name, s]) =>
            `<div style="font-size:${s.size}px;line-height:${s.lineHeight}px;font-weight:${s.weight}">${UI.esc(name)} · ${s.size}/${s.lineHeight} — Cúng rằm 250.000 ₫</div>`,
        )
        .join("");
      const icons = Object.keys(window.SoNhaIcons ?? {})
        .map(
          (n) =>
            `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;width:64px;font-size:11px">${UI.icon(n, 24)}<span>${UI.esc(n)}</span></div>`,
        )
        .join("");
      return `<div class="board">${colours}
        <section><h2>Type</h2><p class="src">typeScale · Be Vietnam Pro</p><div class="specimen">${type}</div></section>
        <section><h2>Icons</h2><p class="src">icons.js</p><div class="specimen row">${icons}</div></section></div>`;
    },
  });
})();
