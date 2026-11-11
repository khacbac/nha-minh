/* Ghi mới / Sửa (spec §2.3). */
(() => {
  const amountBlock = (value, focus) =>
    `${UI.label("Số tiền", true)}${UI.field(value, { placeholder: "0", suffix: "₫", focus })}
    <div class="chips" style="margin-top:8px">${["+10K", "+20K", "+50K", "+100K", "+200K"].map((l) => UI.chip(l, { soft: true })).join("")}</div>`;
  const timeBlock = `${UI.label("Thời gian")}<div class="field-row">${UI.field("Hôm nay, 11/11", { icon: "calendar" })}${UI.field("07:40", { icon: "clock" })}</div>`;
  const titleBlock = (cat, value) => {
    const chips = cat
      ? `<div class="chips wrap" style="margin-top:8px">${UI.cat(cat)
          .titles.map((t) => UI.chip(t, { on: t === value, soft: t !== value }))
          .join("")}</div>`
      : "";
    return `${UI.label("Tiêu đề")}${UI.field(value, { placeholder: "Việc gì vậy?" })}${chips}`;
  };

  const CAT = {
    empty: null,
    picked: "market",
    amount: "market",
    "no-money": "chores",
    edit: "spiritual",
    discard: "market",
    saving: "market",
    "save-failed": "market",
  };
  const TITLE = {
    empty: "",
    picked: "Đi chợ",
    amount: "Đi chợ",
    "no-money": "Dọn nhà",
    edit: "Cúng rằm",
    discard: "Đi chợ",
    saving: "Đi chợ",
    "save-failed": "Đi chợ",
  };
  const AMOUNT = {
    amount: "185.000",
    edit: "250.000",
    discard: "185.000",
    saving: "185.000",
    "save-failed": "185.000",
  };

  Design.page({
    id: "entry-form",
    title: "Ghi mới / Sửa",
    group: "Screens",
    source: "apps/mobile/src/app/entry/new.tsx, entry/[id]/edit.tsx",
    states: [
      {
        id: "empty",
        title: "Mở form",
        note: "Chưa chọn danh mục: tiêu đề trống, Lưu mờ. Thời gian lấy giờ hiện tại.",
      },
      {
        id: "picked",
        title: "Chọn Đi chợ",
        note: "Chọn danh mục tự điền gợi ý đầu tiên vào tiêu đề; chip gợi ý để đổi nhanh. Danh mục có tiền thì hiện ô số tiền.",
      },
      {
        id: "amount",
        title: "Nhập tiền",
        note: "Bàn phím số, tự thêm dấu chấm. Chip +10K… cộng dồn vào số đang có.",
      },
      { id: "no-money", title: "Việc nhà", note: "Danh mục không có tiền: không có ô số tiền." },
      { id: "edit", title: "Sửa", note: "Mở sẵn giá trị đã lưu, tiêu đề form là Sửa ghi chép." },
      { id: "discard", title: "Bỏ thay đổi", note: "Bấm ✕ khi đã nhập gì: hỏi trước khi bỏ." },
      {
        id: "saving",
        title: "Đang lưu",
        note: "Đã bấm Lưu: chờ server, nút mờ và không bấm lại được.",
      },
      {
        id: "save-failed",
        title: "Chưa lưu được",
        note: "Không tới được server: báo một nút Đóng; form giữ nguyên để lưu lại.",
      },
    ],
    flow: [
      ["empty", 1600],
      ["picked", 1800],
      ["amount", 1800],
    ],
    render(s) {
      const cat = CAT[s.id];
      const money = cat && UI.cat(cat).money !== "none";
      const notes =
        s.id === "empty" || s.id === "no-money"
          ? `${UI.label("Ghi chú", true)}${UI.field("", { placeholder: "Thêm vài dòng…", multi: true })}`
          : "";
      const body = `${UI.label("Danh mục")}${UI.categoryGrid(cat, { compact: !!cat })}
        ${titleBlock(cat, TITLE[s.id])}
        ${money ? amountBlock(AMOUNT[s.id] ?? "", s.id === "amount") : ""}
        ${s.id === "amount" ? "" : timeBlock}
        ${notes}`;
      const dialog =
        s.id === "discard"
          ? UI.dialog({
              title: "Bỏ thay đổi?",
              message: "Những gì vừa nhập sẽ không được lưu.",
              confirm: "Bỏ",
              cancel: "Ở lại",
              danger: true,
            })
          : s.id === "save-failed"
            ? UI.dialog({
                title: "Chưa lưu được",
                message: "Kiểm tra mạng rồi thử lại. Những gì đã nhập vẫn còn.",
                confirm: "Đóng",
                cancel: null,
              })
            : "";
      return `<div class="screen">${UI.navHeader({ left: "close", title: s.id === "edit" ? "Sửa ghi chép" : "Ghi mới" })}
        <div class="grow">${body}</div>
        <div class="footer">${UI.button(s.id === "saving" ? "Đang lưu…" : "Lưu", { disabled: !cat || s.id === "saving" })}</div></div>
        ${dialog}`;
    },
  });
})();
