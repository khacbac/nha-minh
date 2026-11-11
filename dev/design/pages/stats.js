/* Thống kê (spec §2.4). */
(() => {
  const EXPENSE = [
    { cat: "bills", amount: 1_540_000, count: 3 },
    { cat: "market", amount: 1_185_000, count: 7 },
    { cat: "kids", amount: 820_000, count: 3 },
    { cat: "spiritual", amount: 450_000, count: 3 },
    { cat: "transport", amount: 280_000, count: 4 },
  ];
  const PLAIN = [
    { cat: "chores", count: 5 },
    { cat: "moments", count: 2 },
  ];
  const YEAR = [
    7_200_000,
    9_800_000,
    6_400_000,
    6_900_000,
    7_100_000,
    8_300_000,
    6_000_000,
    7_700_000,
    8_900_000,
    9_860_000,
    4_275_000,
    null,
  ];

  Design.page({
    id: "stats",
    title: "Thống kê",
    group: "Screens",
    source: "apps/mobile/src/app/stats.tsx",
    states: [
      {
        id: "month",
        title: "Tháng",
        note: "Mở từ nút biểu đồ ở Sổ, sẵn tháng đang xem. Tổng chi, số ghi chép, TB mỗi ngày; chi theo danh mục nhiều nhất ở trên.",
      },
      {
        id: "year",
        title: "Năm",
        note: "12 cột chi theo tháng cùng một màu, tháng hiện tại đậm. Chạm cột thì số tiền hiện cạnh tiêu đề; chạm lần nữa mở tháng đó. Có thu thì hiện Thu và Còn lại.",
      },
      {
        id: "range",
        title: "Tuỳ chọn",
        note: "Từ ngày – Đến ngày, mặc định đầu tháng tới hôm nay. Không quá hôm nay; Từ sau Đến thì Đến nhảy theo.",
      },
      { id: "empty", title: "Trống", note: "Khoảng không có ghi chép nào." },
    ],
    flow: [
      ["month", 1800],
      ["year", 1800],
      ["range", 1800],
    ],
    render(s) {
      const head = UI.navHeader({ title: "Thống kê" });
      const modes = ["Tháng", "Năm", "Tuỳ chọn"];
      if (s.id === "empty") {
        return `<div class="screen">${head}${UI.segmented(modes, "Tháng")}${UI.periodNav("Tháng 3, 2026", { nextDisabled: false })}
          <div class="center"><span class="empty-art">${UI.icon("chart", 30)}</span><span class="t-heading-sm">Chưa có ghi chép nào trong khoảng này</span></div></div>`;
      }
      if (s.id === "year") {
        return `<div class="screen">${head}<div class="grow">${UI.segmented(modes, "Năm")}${UI.periodNav("Năm 2026")}
          ${UI.statsTotals({ spent: 82_435_000, earned: 203_500_000, count: 412, perDay: 262_500 })}
          ${UI.yearBars(YEAR, { current: 10, picked: 9 })}
          ${UI.categoryBars("Chi theo danh mục", [
            { cat: "bills", amount: 21_400_000, count: 34 },
            { cat: "market", amount: 18_950_000, count: 96 },
          ])}</div></div>`;
      }
      const period =
        s.id === "range"
          ? `<div class="range-row"><div class="field"><span class="t-meta">Từ ngày</span><span>01/11/2026</span></div><div class="field focus"><span class="t-meta">Đến ngày</span><span>11/11/2026</span></div></div>`
          : UI.periodNav("Tháng 11, 2026");
      return `<div class="screen">${head}<div class="grow">${UI.segmented(modes, s.id === "range" ? "Tuỳ chọn" : "Tháng")}${period}
        ${UI.statsTotals({ spent: 4_275_000, count: 25, perDay: 388_600 })}
        ${UI.categoryBars("Chi theo danh mục", EXPENSE)}
        ${UI.plainCounts(PLAIN)}</div></div>`;
    },
  });
})();
