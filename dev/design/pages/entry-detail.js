/* Chi tiết ghi chép (spec §2.2). */
(() => {
  Design.page({
    id: "entry-detail",
    title: "Chi tiết",
    group: "Screens",
    source: "apps/mobile/src/app/entry/[id]/index.tsx",
    states: [
      {
        id: "money",
        title: "Có tiền",
        note: "Danh mục, tiêu đề, số tiền lớn, ngày giờ đầy đủ, ghi chú. Sửa hoặc Xoá ở dưới.",
      },
      {
        id: "plain",
        title: "Không tiền",
        note: "Danh mục không có tiền (Kỷ niệm): không có dòng số tiền.",
      },
      {
        id: "confirm",
        title: "Hỏi xoá",
        note: "Xoá luôn hỏi lại; nút Xoá màu cảnh báo, nằm dưới nút an toàn.",
      },
      {
        id: "deleting",
        title: "Đang xoá",
        note: "Đã bấm Xoá: chờ server, nút Xoá mờ. Xoá xong về Sổ.",
      },
      {
        id: "delete-failed",
        title: "Chưa xoá được",
        note: "Không tới được server: ghi chép vẫn còn, báo một nút Đóng.",
      },
      {
        id: "missing",
        title: "Không còn",
        note: "Ghi chép đã bị xoá (cả ở máy khác): báo và cho quay lại.",
      },
    ],
    render(s) {
      if (s.id === "missing") {
        return `<div class="screen">${UI.navHeader({ title: "" })}<div class="center">
          <span class="empty-art">${UI.icon("note", 30)}</span>
          <span class="t-heading-sm">Ghi chép này không còn nữa</span>
          ${UI.button("Về sổ", { variant: "soft" })}</div></div>`;
      }
      const plain = s.id === "plain";
      const c = plain ? "moments" : "spiritual";
      const note = plain
        ? "Bé đi được 5 bước từ ghế sofa tới chỗ mẹ."
        : "Hoa cúc, chuối, bưởi, nhang. Cúng xong biếu bà một nửa.";
      const body = `<div class="detail">${UI.catIcon(c, 64)}
          <span class="t-ui-label muted" style="margin-top:6px">${UI.cat(c).name}</span>
          <span class="t-heading-lg">${plain ? "Bé biết đi" : "Cúng rằm"}</span>
          ${plain ? "" : `<span class="t-amount-xl">${UI.vnd(250000)}</span>`}
          <span class="when t-caption">${UI.icon("calendar", 16)} Chủ Nhật, 15/11/2026 · 06:30</span>
          <div class="note-box"><div class="t-meta" style="margin-bottom:4px">Ghi chú</div>
          <div class="t-body-lg">${note}</div></div></div>`;
      const dialog =
        s.id === "confirm" || s.id === "deleting"
          ? UI.dialog({
              title: "Xoá ghi chép này?",
              message: "Không thể hoàn tác.",
              confirm: s.id === "deleting" ? "Đang xoá…" : "Xoá",
              danger: true,
              busy: s.id === "deleting",
            })
          : s.id === "delete-failed"
            ? UI.dialog({
                title: "Chưa xoá được",
                message: "Kiểm tra mạng rồi thử lại.",
                confirm: "Đóng",
                cancel: null,
              })
            : "";
      return `<div class="screen">${UI.navHeader({ title: "", right: UI.iconButton("pencil") })}
        <div class="grow">${body}</div>
        <div class="btn-row">${UI.button("Sửa", { variant: "soft", icon: "pencil" })}${UI.button("Xoá", { variant: "danger", icon: "trash" })}</div></div>
        ${dialog}`;
    },
  });
})();
