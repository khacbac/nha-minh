/* Flow "Ghi một việc" (spec §2): frames from the screen pages, in the order a parent meets them. */
(() => {
  const STEPS = [
    ["journal", "default", "Sổ", "Mở app là vào thẳng sổ của tháng hiện tại."],
    ["entry-form", "empty", "Ghi mới", "Bấm + Ghi mới."],
    ["entry-form", "picked", "Chọn danh mục", "Tiêu đề tự điền."],
    ["entry-form", "amount", "Nhập tiền", "Không bắt buộc. Lưu."],
    ["journal", "default", "Về sổ", "Ghi chép mới nằm trên cùng của ngày."],
    ["entry-detail", "money", "Chi tiết", "Chạm một dòng để xem, sửa hoặc xoá."],
    ["entry-detail", "confirm", "Xoá", "Hỏi lại trước khi xoá."],
  ];

  Design.page({
    id: "flow-main",
    title: "Flow · Ghi một việc",
    group: "Flows",
    source: "spec §2: Sổ → Ghi mới → Lưu → Sổ → Chi tiết → Sửa / Xoá",
    states: STEPS.map(([page, state, title, note], i) => ({
      id: `${i + 1}-${page}-${state}`,
      title: `${i + 1} · ${title}`,
      note,
      page,
      state,
    })),
    flow: STEPS.map(([page, state], i) => [`${i + 1}-${page}-${state}`, 1800]),
    render(s) {
      return Design.frame(s.page, s.state);
    },
  });
})();
