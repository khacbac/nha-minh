# Nhà Mình — MVP

Cập nhật: 2026-11-11 (chiều: tên Nhà Mình, Phước thiện, Thống kê)

## 1. Là gì

**Nhà Mình** là cuốn nhật ký gia đình nhỏ của cả nhà trên điện thoại: ghi lại các việc trong ngày như một cuốn nhật ký, và nếu việc đó có tiêu tiền (đi chợ, đóng tiền điện, cúng rằm, thả cá…) thì ghi luôn số tiền. Mở app là thấy ngay các ghi chép theo ngày, gom theo tháng, kèm tổng đã chi trong tháng.

Nguyên tắc:

- **Ghi nhanh.** Một ghi chép chỉ cần chọn danh mục; tiêu đề tự điền, thời gian tự lấy giờ hiện tại. Số tiền và ghi chú không bắt buộc.
- **Nhẹ nhàng.** Đây là cuốn sổ gia đình, không phải app tài chính: không cảnh báo đỏ; thống kê chỉ có số tổng, thanh xếp hạng và cột theo tháng (§2.4).
- **Mở rộng được.** Danh mục, kiểu dữ liệu và màn hình tách riêng để sau này thêm tính năng (xem §5) mà không phải làm lại.

Ngôn ngữ: tiếng Việt. Một máy một cuốn sổ; dữ liệu nằm trên máy, không có tài khoản, không có server (§3.3).

## 2. Màn hình

### 2.1 Sổ (màn chính)

- Trên cùng: chữ nhỏ "Nhà Mình", rồi tên tháng đang xem ("Tháng 11, 2026") với hai nút ‹ › để lùi/tiến tháng. Không tiến quá tháng hiện tại. Bên trái hai nút là nút biểu đồ → Thống kê (§2.4), mở sẵn tháng đang xem.
- Thẻ tổng tháng: **Đã chi** (tổng số tiền các ghi chép có tiền thuộc danh mục chi), dưới đó là **Thu** (nếu có) và **số ghi chép** trong tháng.
- Hàng chip lọc danh mục, cuộn ngang: "Tất cả" + các danh mục có ghi chép trong tháng. Chọn một chip thì danh sách và thẻ tổng chỉ tính danh mục đó; đổi tháng thì lọc về "Tất cả".
- Danh sách theo ngày, mới nhất ở trên. Đầu mỗi ngày: "Hôm nay", "Hôm qua", hoặc "Thứ Hai, 9/11"; bên phải là tổng chi của ngày (ẩn nếu ngày đó không có tiền).
- Mỗi dòng: biểu tượng danh mục trên nền màu nhạt của danh mục, tiêu đề, dòng phụ "Danh mục · 08:30 · đầu ghi chú", bên phải số tiền nếu có. Tiền chi viết màu chữ thường "120.000 ₫", tiền thu màu xanh rêu "+5.000.000 ₫". Không dùng màu đỏ cho tiền chi.
- Chạm một dòng → Chi tiết (§2.2).
- Nút nổi "+ Ghi mới" ở góc phải dưới → Ghi mới (§2.3).
- Tháng chưa có gì: biểu tượng sổ, "Chưa có ghi chép nào trong tháng này", nút "Ghi việc đầu tiên" (chỉ ở tháng hiện tại).

### 2.2 Chi tiết ghi chép

- Nút quay lại, nút sửa (bút chì) góc phải.
- Biểu tượng danh mục lớn, tên danh mục, tiêu đề, số tiền lớn (nếu có), ngày giờ đầy đủ ("Thứ Tư, 11/11/2026 · 08:30"), ghi chú (nếu có) trong một khung.
- Dưới cùng: nút "Sửa" và nút "Xoá". Xoá hỏi lại: "Xoá ghi chép này?" / "Không thể hoàn tác." / "Xoá" (màu cảnh báo) / "Huỷ". Xoá xong quay về Sổ.
- Nếu ghi chép không còn (đã xoá ở nơi khác): "Ghi chép này không còn nữa" và nút quay lại.

### 2.3 Ghi mới / Sửa

Một form, dùng cho cả ghi mới và sửa (sửa mở sẵn giá trị đã lưu). Thứ tự:

1. **Danh mục** (bắt buộc): lưới 4 cột các danh mục §3.1, chạm để chọn; ô đang chọn có viền và nền xanh rêu nhạt.
2. **Tiêu đề** (bắt buộc, tối đa 120 ký tự): khi chọn danh mục, nếu tiêu đề đang trống hoặc vẫn là một gợi ý của danh mục chọn trước đó, nó được thay bằng gợi ý đầu tiên của danh mục mới; tiêu đề tự gõ thì giữ nguyên. Dưới ô là các chip gợi ý của danh mục; chạm chip để thay tiêu đề.
3. **Số tiền** (không bắt buộc): chỉ hiện với danh mục có tiền (`chi` hoặc `thu`). Nhập bằng bàn phím số, tự thêm dấu chấm hàng nghìn, đơn vị ₫. Hàng chip cộng nhanh: +10K, +20K, +50K, +100K, +200K, +500K. Nút xoá số. Tối đa 999.999.999.999 ₫. Đổi sang danh mục không có tiền thì ô số tiền ẩn và số tiền không được lưu.
4. **Thời gian**: hai ô Ngày và Giờ, mặc định là lúc mở form (ghi mới). Không chọn được ngày sau hôm nay.
5. **Ghi chú** (không bắt buộc, tối đa 2000 ký tự): ô nhiều dòng.

Nút "Lưu" cố định dưới cùng, mờ đi cho tới khi có danh mục và tiêu đề. Lưu xong: ghi mới quay về Sổ và nhảy về tháng của ghi chép; sửa quay về Chi tiết. Nút ✕ góc trái đóng form; nếu đã nhập gì thì hỏi "Bỏ thay đổi?" / "Bỏ" / "Ở lại".

### 2.4 Thống kê

Mở từ nút biểu đồ ở màn Sổ. Nút quay lại, tiêu đề "Thống kê".

- **Chọn khoảng**: ba lựa chọn **Tháng** · **Năm** · **Tuỳ chọn**.
  - Tháng: "Tháng 11, 2026" với ‹ ›; mở sẵn tháng đang xem ở Sổ.
  - Năm: "Năm 2026" với ‹ ›; mở sẵn năm của tháng đang xem.
  - Tuỳ chọn: hai ô **Từ ngày** và **Đến ngày**; mặc định từ ngày 1 của tháng hiện tại đến hôm nay. Không chọn ngày sau hôm nay. Chọn "Từ" sau "Đến" thì "Đến" nhảy theo "Từ" (và ngược lại).
  - Không tiến quá tháng / năm hiện tại. Mọi khoảng tính cả ngày đầu và ngày cuối.
- **Thẻ tổng**: **Đã chi** (số lớn); dưới đó **Thu** và **Còn lại** (Thu − Chi, có dấu + hoặc −) nếu có thu; **số ghi chép**; **Trung bình mỗi ngày** (Đã chi chia cho số ngày của khoảng đã trôi qua, tính tới hôm nay).
- **Chi theo tháng** (chỉ ở chế độ Năm): 12 cột T1…T12 cùng một màu, cao theo tiền chi của tháng; tháng hiện tại đậm hơn. Chạm một cột thì cột đậm lên và số tiền của tháng đó hiện bên phải tiêu đề "Chi theo tháng" ("T10 · 9.860.000 ₫"); chạm lần nữa thì mở tháng đó ở chế độ Tháng. Tháng tương lai để trống.
- **Chi theo danh mục**: mỗi danh mục có chi trong khoảng một dòng, nhiều nhất ở trên: biểu tượng, tên, số ghi chép, số tiền, phần trăm trên tổng chi, và một thanh ngang cùng một màu dài theo phần trăm.
- **Thu theo danh mục**: như trên, chỉ hiện khi có thu.
- **Việc không có tiền**: các danh mục không tiền (Việc nhà, Kỷ niệm) và các ghi chép không nhập tiền, gom theo danh mục với số lần: "Việc nhà · 5 lần".
- Khoảng không có ghi chép nào: "Chưa có ghi chép nào trong khoảng này".

## 3. Dữ liệu

### 3.1 Danh mục

16 danh mục có sẵn, theo thứ tự trên lưới. "Tiền": `chi` (cộng vào Đã chi), `thu` (cộng vào Thu), `không` (không có ô số tiền). Gợi ý đầu tiên là tiêu đề tự điền.

| Danh mục | Tiền | Gợi ý tiêu đề |
| --- | --- | --- |
| Đi chợ | chi | Đi chợ, Siêu thị, Mua rau thịt, Mua trái cây |
| Ăn uống | chi | Ăn ngoài, Ăn sáng, Cà phê, Đặt đồ ăn |
| Hoá đơn | chi | Tiền điện, Tiền nước, Internet, Điện thoại, Tiền nhà |
| Đi lại | chi | Đổ xăng, Gửi xe, Grab, Sửa xe, Rửa xe |
| Con cái | chi | Học phí, Sữa, Bỉm, Đồ chơi, Tiêm phòng |
| Phước thiện | chi | Cúng rằm, Cúng mùng 1, Cúng giường, Thả cá, Đi chùa, Giỗ |
| Hiếu hỉ | chi | Mừng cưới, Phúng viếng, Mừng sinh nhật, Thăm ốm, Lì xì |
| Sức khoẻ | chi | Khám bệnh, Mua thuốc, Bảo hiểm, Tập thể dục |
| Mua sắm | chi | Quần áo, Đồ gia dụng, Mua online, Mỹ phẩm |
| Nhà cửa | chi | Sửa chữa, Đồ dùng trong nhà, Cây cảnh, Gas |
| Gia đình | chi | Đi chơi, Về quê, Biếu ông bà, Họp mặt |
| Thú cưng | chi | Thức ăn, Khám thú y, Tắm tỉa |
| Việc nhà | không | Dọn nhà, Giặt giũ, Nấu ăn, Tưới cây, Thay ga giường |
| Kỷ niệm | không | Ngày đáng nhớ, Bé biết đi, Bé mọc răng, Kỷ niệm ngày cưới |
| Thu nhập | thu | Lương, Thưởng, Bán hàng, Được biếu, Lãi tiết kiệm |
| Khác | chi | Chi khác, Ghi chú |

Mã danh mục là cố định vì được lưu trong từng ghi chép: chỉ thêm mã mới vào cuối, không đổi tên hay dùng lại mã cũ. Tên hiển thị, biểu tượng, màu và gợi ý thì đổi thoải mái.

### 3.2 Ghi chép

| Trường | Bắt buộc | Ghi chú |
| --- | --- | --- |
| Mã | có | Sinh trên máy, không đổi |
| Danh mục | có | Một mã ở §3.1 |
| Tiêu đề | có | 1–120 ký tự, bỏ khoảng trắng hai đầu |
| Ghi chú | không | Tối đa 2000 ký tự; để trống thì không lưu |
| Số tiền | không | Số nguyên đồng, > 0, tối đa 999 tỷ; chỉ với danh mục có tiền |
| Thời điểm | có | Ngày giờ việc xảy ra, theo giờ máy |
| Tạo lúc, sửa lúc | có | Tự ghi |

"Ngày" và "tháng" của một ghi chép tính theo giờ trên máy.

### 3.3 Lưu trữ

Mọi ghi chép lưu trên máy. Gỡ app là mất dữ liệu (sao lưu là một tính năng sau, §5). Dữ liệu hỏng hoặc không đọc được thì bỏ qua dòng đó, không làm app lỗi.

## 4. Ngoài phạm vi MVP

Tài khoản, đồng bộ nhiều máy, chia sẻ sổ giữa các thành viên, ngân sách, biểu đồ tròn / đường, nhắc nhở, ảnh đính kèm, tìm kiếm, xuất file, tiếng Anh, giao diện tối.

## 5. Hướng mở rộng (chưa làm)

Theo thứ tự dự kiến: tìm kiếm; sao lưu/khôi phục ra file; danh mục tự tạo; nhắc lịch âm (rằm, mùng 1, giỗ); ảnh đính kèm; đồng bộ cả nhà qua server.
