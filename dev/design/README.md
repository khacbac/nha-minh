# Design

Mọi thứ về giao diện của Nhà Mình. Hành vi (màn nào làm gì) nằm ở `dev/specs/mvp.md` §2; thư mục này chỉ lo phần nhìn. Vẽ bằng HTML trong repo, chốt rồi mới code.

**Mở `dev/design/index.html` trong trình duyệt** (double-click, không cần build hay server). Giống một file Figma: page bên trái, frame trên canvas, bấm frame để phóng to, `▶ Play flow` để chạy thử.

## Nguồn sự thật

| Thứ | Ở đâu | Vai trò |
| --- | --- | --- |
| Màu, chữ, bo góc | `apps/mobile/src/lib/theme/tokens.js` | **Bản đúng.** File design đọc thẳng file này |
| Logo | `apps/mobile/assets/brand/logo.svg` | Nguồn của icon app, foreground Android, splash (`pnpm mobile:icons`) |
| Biểu tượng | `apps/mobile/src/lib/theme/icons.js` | App và design vẽ cùng một đường path |
| Danh mục | `apps/mobile/src/features/categories/category-data.js` | Tên, biểu tượng, màu, gợi ý tiêu đề; design dùng dữ liệu thật |
| File design | `dev/design/index.html` | Mọi màn, mọi trạng thái, một flow |
| Lý do các lựa chọn | Mục **Quyết định** bên dưới | |

## Cấu trúc

```
dev/design/
  index.html              # mở file này; danh sách <script> của các page nằm cuối file
  kit/
    theme.js              # tokens.js → biến CSS (--accent-primary, --tint-sage-bg…)
    ui.js, ui.css         # các khối giao diện, mỗi khối ghi file RN nó mô phỏng
    viewer.js, viewer.css # khung kiểu Figma; Design.frame() để page flow dùng lại frame của page khác
  pages/
    flow-main.js          # Flow · Ghi một việc: Sổ → Ghi mới → Lưu → Sổ → Chi tiết → Xoá
    sign-in.js            # Đăng nhập (tài khoản chung của nhà)
    journal.js            # Sổ (màn chính)
    entry-detail.js       # Chi tiết
    entry-form.js         # Ghi mới / Sửa
    stats.js              # Thống kê (Tháng / Năm / Tuỳ chọn)
    components.js         # thư viện: từng khối trong kit/ui.js
    foundations.js        # màu, chữ, biểu tượng, đọc live
    brand.js              # logo (PNG render từ apps/mobile/assets/brand/logo.svg)
    _template.js          # mẫu để copy khi thêm page
```

Ở page Ghi mới, lưới danh mục trong vài frame bị cắt còn 2 hàng cho vừa khung; trong app form cuộn và luôn có đủ 16 ô.

## Thêm một màn mới

1. Copy `pages/_template.js` thành `pages/<ten-man>.js`, sửa `id`, `title`, `states`, `render`.
2. Thêm `<script src="pages/<ten-man>.js"></script>` vào cuối `index.html`.
3. Dựng màn từ các khối `UI.*`. Cần khối mới thì thêm vào `kit/ui.js` + `kit/ui.css` và đưa vào `pages/components.js`.

Mỗi state có `note`: một câu nói trạng thái đó là gì, lấy từ spec.

## Giữ design khớp với code

- Màu, chữ, biểu tượng, danh mục: không cần làm gì, design đọc thẳng file của app.
- Bố cục, khoảng cách: khi sửa một component RN, sửa khối tương ứng trong `kit/ui.css` (mỗi khối có ghi tên file RN).
- Màn mới: vẽ ở đây trước, chốt, rồi mới code.

## Quyết định

| Quyết định | Lý do |
| --- | --- |
| Hướng "Giấy & Mực": nền giấy ấm `#FAF8F4`, chữ màu mực, một màu nhấn xanh rêu `#3F6B57` | Cuốn sổ gia đình nên trông như giấy viết, không như app ngân hàng. Một màu nhấn duy nhất giữ màn hình yên; các app nhật ký tối giản (Day One, Daylio, Minimal Diary) đều đi theo nền sáng ấm + một điểm nhấn (`dev/research/ui-patterns.md`) |
| Màu danh mục là pastel độ bão hoà thấp, chỉ nằm sau biểu tượng | Phân biệt danh mục bằng màu mà không làm danh sách loè loẹt |
| Tiền chi màu chữ thường, không đỏ; tiền thu xanh rêu với dấu + | Ghi tiền đi chợ, cúng rằm là chuyện bình thường, không phải cảnh báo |
| Biểu tượng nét mảnh tự vẽ (`icons.js`), không dùng emoji | Emoji mỗi cái một màu, phá sự yên của bảng màu; một file path dùng chung cho app và design |
| Font Be Vietnam Pro | Dấu tiếng Việt chuẩn, nét tròn, dễ đọc ở cỡ nhỏ |
| Ghi mới là một màn đầy đủ, không phải sheet | Form có bàn phím, lưới 16 danh mục và ghi chú nhiều dòng; một màn cuộn ổn định hơn sheet đẩy theo bàn phím |
| Lưới danh mục + chip gợi ý tiêu đề + chip cộng tiền nhanh | Pattern quen thuộc của app chi tiêu: ít gõ nhất có thể (`dev/research/ui-patterns.md`) |
| Nút nổi "+ Ghi mới" có chữ | Hành động chính duy nhất của app; có chữ để người lớn tuổi trong nhà cũng hiểu |
| Chỉ giao diện sáng trong MVP | Một bảng màu cho xong trước; giao diện tối nằm ở spec §4 |
| Tên **Nhà Mình**; logo mái nhà ôm trái tim + một dòng nhật ký, nền xanh rêu | "Nhật ký gia đình" quá dài cho tên dưới icon; "Nhà Mình" ngắn, ấm và nói đúng "chuyện của nhà mình". Hình khối đặc, ít chi tiết để vẫn rõ ở cỡ 48px |
| Thống kê chỉ một màu (xanh rêu): số tổng lớn, thanh ngang theo danh mục, cột theo tháng | Một màu cho độ lớn thì không cần bảng màu phân biệt danh mục; danh mục đã có biểu tượng và tên ngay cạnh thanh. Không biểu đồ tròn: so độ dài thanh dễ hơn so góc |
| Danh mục cúng / thả cá / đi chùa tên "Phước thiện" | "Tâm linh" nghe nặng nề; "Phước thiện" nhẹ nhàng, bao cả cúng, phóng sinh và việc thiện |
| Đăng nhập là một màn đơn: logo, email, mật khẩu, một nút; lỗi là một dòng chữ dưới nút | Cả nhà chỉ đăng nhập một lần trên mỗi máy; không có đăng ký hay quên mật khẩu nên không cần tab hay link phụ |
| Lỗi mạng khi lưu / xoá là hộp thông báo một nút "Đóng", dùng lại hộp hỏi xoá | Một kiểu hộp cho cả app; form và ghi chép giữ nguyên phía sau nên người dùng chỉ cần bấm lại |
