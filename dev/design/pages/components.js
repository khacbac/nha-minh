/* Every block in kit/ui.js, on one board. */
(() => {
  const block = (title, src, html) =>
    `<section><h2>${UI.esc(title)}</h2><p class="src">${UI.esc(src)}</p><div class="row"><div class="specimen">${html}</div></div></section>`;

  const rows = [
    { cat: "market", title: "Đi chợ", time: "07:40", note: "Rau, thịt", amount: 185000 },
    { cat: "income", title: "Lương", time: "10:00", amount: 18500000 },
    { cat: "chores", title: "Dọn nhà", time: "09:10" },
  ];

  Design.page({
    id: "components",
    title: "Components",
    group: "Library",
    source: "dev/design/kit/ui.js",
    render() {
      const buttons = [
        UI.button("Lưu"),
        UI.button("Sửa", { variant: "soft", icon: "pencil" }),
        UI.button("Về sổ", { variant: "ghost" }),
        UI.button("Xoá", { variant: "danger", icon: "trash" }),
        UI.button("Lưu", { disabled: true }),
      ].join("");
      const fields = [
        UI.field("Đi chợ"),
        UI.field("185.000", { suffix: "₫", focus: true }),
        UI.field("", { placeholder: "Thêm vài dòng…", multi: true }),
      ].join("");
      return `<div class="board">
        ${block("Button", "components/button.tsx", `<div style="display:flex;flex-direction:column;gap:8px;width:300px">${buttons}</div>`)}
        ${block("Chip", "components/chip.tsx", `<div class="chips wrap" style="width:320px">${UI.chip("Tất cả", { on: true })}${UI.chip("Đi chợ")}${UI.chip("+50K", { soft: true })}</div>`)}
        ${block("Category grid", "features/entries/components/category-grid.tsx", `<div style="width:340px">${UI.categoryGrid("market")}</div>`)}
        ${block("Month summary", "features/entries/components/month-summary.tsx", `<div style="width:350px">${UI.summary({ spent: 4275000, earned: 18500000, count: 18 })}</div>`)}
        ${block("Day + rows", "features/entries/components/entry-row.tsx", `<div style="width:350px">${UI.day("Hôm nay", rows)}</div>`)}
        ${block("Fields", "components/text-field.tsx", `<div style="width:320px;display:flex;flex-direction:column;gap:8px">${fields}</div>`)}
        ${block("Segmented", "components/segmented.tsx", `<div style="width:320px">${UI.segmented(["Tháng", "Năm", "Tuỳ chọn"], "Năm")}</div>`)}
        ${block("Stats totals", "features/stats/components/stats-totals.tsx", `<div style="width:350px">${UI.statsTotals({ spent: 4275000, earned: 18500000, count: 25, perDay: 388600 })}</div>`)}
        ${block(
          "Category bars",
          "features/stats/components/category-bars.tsx",
          `<div style="width:350px">${UI.categoryBars("Chi theo danh mục", [
            { cat: "bills", amount: 1540000, count: 3 },
            { cat: "market", amount: 1185000, count: 7 },
          ])}${UI.plainCounts([{ cat: "chores", count: 5 }])}</div>`,
        )}
        ${block(
          "Year bars",
          "features/stats/components/year-bars.tsx",
          `<div style="width:350px">${UI.yearBars(
            [7, 9, 6, 7, 7, 8, 6, 8, 9, 10, 4, null].map((v) => (v == null ? null : v * 1000000)),
            { current: 10, picked: 9 },
          )}</div>`,
        )}
        ${block("FAB", "components/fab.tsx", `<div style="position:relative;width:200px;height:90px">${UI.fab()}</div>`)}
      </div>`;
    },
  });
})();
