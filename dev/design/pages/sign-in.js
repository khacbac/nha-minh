/* Đăng nhập (spec §2.0): the only screen until the family account is signed in. */
(() => {
  const LOGO = "../../apps/mobile/assets/images/icon.png";
  const ERRORS = {
    wrong: "Email hoặc mật khẩu chưa đúng.",
    offline: "Không kết nối được. Kiểm tra mạng rồi thử lại.",
  };

  Design.page({
    id: "sign-in",
    title: "Đăng nhập",
    group: "Screens",
    source: "apps/mobile/src/app/sign-in.tsx",
    states: [
      {
        id: "empty",
        title: "Mở app lần đầu",
        note: "Chưa đăng nhập: chỉ có màn này. Đăng nhập mờ cho tới khi email đúng dạng và có mật khẩu.",
      },
      {
        id: "busy",
        title: "Đang đăng nhập",
        note: "Đã bấm Đăng nhập: nút chờ server, không bấm lại được.",
      },
      {
        id: "wrong",
        title: "Sai mật khẩu",
        note: "Lỗi hiện dưới nút; email và mật khẩu đã nhập vẫn giữ.",
      },
      { id: "offline", title: "Mất mạng", note: "Không tới được server: nhắc kiểm tra mạng." },
    ],
    flow: [
      ["empty", 1600],
      ["busy", 1400],
      ["wrong", 1800],
    ],
    render(s) {
      const filled = s.id !== "empty";
      const error = ERRORS[s.id];
      return `<div class="screen"><div class="sign-in">
        <div class="sign-in-brand"><img src="${LOGO}" alt="Nhà Mình">
          <span class="t-heading-lg">Nhà Mình</span>
          <span class="t-caption">Đăng nhập tài khoản của nhà mình</span></div>
        ${UI.label("Email")}${UI.field(filled ? "nha.minh@gmail.com" : "", { placeholder: "ten@email.com" })}
        ${UI.label("Mật khẩu")}${UI.field(filled ? "••••••••" : "", { placeholder: "Mật khẩu", focus: s.id === "wrong" })}
        <div style="margin-top:8px">${UI.button(s.id === "busy" ? "Đang đăng nhập…" : "Đăng nhập", { disabled: !filled || s.id === "busy" })}</div>
        ${error ? UI.formError(error) : ""}
      </div></div>`;
    },
  });
})();
