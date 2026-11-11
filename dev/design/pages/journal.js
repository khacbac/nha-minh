/* Sổ — the main screen (spec §2.1). */
(() => {
  const TODAY = [
    {
      cat: "market",
      title: "Đi chợ",
      time: "07:40",
      note: "Rau, thịt ba chỉ, trứng",
      amount: 185000,
    },
    { cat: "spiritual", title: "Cúng rằm", time: "06:30", note: "Hoa quả, nhang", amount: 250000 },
    { cat: "chores", title: "Thay ga giường", time: "09:10" },
  ];
  const YESTERDAY = [
    { cat: "bills", title: "Tiền điện", time: "20:15", note: "Tháng 10", amount: 1240000 },
    { cat: "kids", title: "Sữa", time: "18:02", amount: 520000 },
    { cat: "moments", title: "Bé biết đi", time: "17:30", note: "Bé đi được 5 bước" },
  ];
  const EARLIER = [
    { cat: "spiritual", title: "Thả cá", time: "06:15", note: "Hồ Tây", amount: 100000 },
    { cat: "income", title: "Lương", time: "10:00", amount: 18500000 },
    { cat: "transport", title: "Đổ xăng", time: "08:05", amount: 80000 },
  ];

  Design.page({
    id: "journal",
    title: "Sổ",
    group: "Screens",
    source: "apps/mobile/src/app/index.tsx",
    states: [
      {
        id: "default",
        title: "Có ghi chép",
        note: "Tháng hiện tại: tổng đã chi, chip lọc, ngày mới nhất ở trên. Tiền chi màu chữ, tiền thu màu rêu.",
      },
      {
        id: "filtered",
        title: "Lọc Phước thiện",
        note: "Chip danh mục đang chọn: danh sách và thẻ tổng chỉ tính danh mục đó.",
      },
      { id: "past", title: "Tháng trước", note: "Lùi tháng bằng ‹. Ở tháng hiện tại thì › mờ." },
      {
        id: "empty",
        title: "Tháng trống",
        note: "Chưa có gì trong tháng hiện tại: lời mời ghi việc đầu tiên.",
      },
    ],
    flow: [
      ["default", 1800],
      ["filtered", 1800],
      ["past", 1800],
      ["empty", 1800],
    ],
    render(s) {
      if (s.id === "empty") {
        return `<div class="screen">${UI.monthHeader("Tháng 11, 2026")}${UI.summary({ spent: 0, count: 0 })}
          <div class="center"><span class="empty-art">${UI.icon("book", 32)}</span>
          <span class="t-heading-sm">Chưa có ghi chép nào trong tháng này</span>
          <span class="t-caption">Đi chợ, đóng tiền điện hay một kỷ niệm nhỏ — ghi lại để cả nhà cùng nhớ.</span>
          <div style="margin-top:8px">${UI.button("Ghi việc đầu tiên", { icon: "plus" })}</div></div></div>`;
      }
      const filtered = s.id === "filtered";
      const chips = (on) =>
        `<div class="chips">${["Tất cả", "Phước thiện", "Đi chợ", "Hoá đơn", "Con cái"].map((c) => UI.chip(c, { on: c === on })).join("")}</div>`;
      const pick = (list) => (filtered ? list.filter((e) => e.cat === "spiritual") : list);
      const body =
        s.id === "past"
          ? `${UI.monthHeader("Tháng 10, 2026", { nextDisabled: false })}
            ${UI.summary({ spent: 9_860_000, earned: 18_500_000, count: 42 })}${chips("Tất cả")}
            ${UI.day("Thứ Bảy, 31/10", [EARLIER[2]])}${UI.day("Thứ Sáu, 30/10", EARLIER.slice(0, 2))}`
          : `${UI.monthHeader("Tháng 11, 2026")}
            ${UI.summary(filtered ? { spent: 350_000, count: 2, label: "Phước thiện · tháng này" } : { spent: 4_275_000, count: 18 })}
            ${chips(filtered ? "Phước thiện" : "Tất cả")}
            ${UI.day("Hôm nay", pick(TODAY))}
            ${pick(YESTERDAY).length ? UI.day("Hôm qua", pick(YESTERDAY)) : ""}
            ${filtered ? UI.day("Chủ Nhật, 1/11", [EARLIER[0]]) : ""}`;
      return `<div class="screen"><div class="grow">${body}</div></div>${UI.fab()}`;
    },
  });
})();
