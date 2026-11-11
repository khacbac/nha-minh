/* Tên và logo: Nhà Mình (spec §1). The PNGs are rendered from logo.svg by `pnpm mobile:icons`. */
(() => {
  const BASE = "../../apps/mobile/assets";
  Design.page({
    id: "brand",
    title: "Logo",
    group: "Library",
    source: "apps/mobile/assets/brand/logo.svg",
    render() {
      const tile = (src, label, bg) =>
        `<div style="display:flex;flex-direction:column;gap:8px;align-items:center"><div style="background:${bg};border-radius:28px;padding:12px"><img src="${src}" width="180" height="180" alt="${UI.esc(label)}" style="border-radius:22%"></div><span>${UI.esc(label)}</span></div>`;
      return `<div class="board">
        <section><h2>Nhà Mình</h2><p class="src">Mái nhà ôm một trái tim, dưới là một dòng nhật ký: chuyện của nhà mình, ghi lại mỗi ngày.</p>
        <div class="row">
          ${tile(`${BASE}/images/icon.png`, "App icon", "transparent")}
          ${tile(`${BASE}/images/android-icon-foreground.png`, "Android foreground (trên nền rêu)", "var(--accent-primary)")}
          ${tile(`${BASE}/images/splash-icon.png`, "Splash (trên nền giấy)", "var(--surface-app)")}
        </div></section>
      </div>`;
    },
  });
})();
