# UI patterns — nhật ký + ghi chi tiêu

Tra cứu 2026-11-11 trước khi chọn hướng thiết kế. Quyết định nằm ở `dev/design/README.md` (Quyết định); file này giữ bằng chứng.

## Nhật ký tối giản

- Các app nhật ký gần đây (Minimal Diary, Diarly, MonoJournal, Day One) dùng nền sáng, rất ít màu, chữ là nhân vật chính; điểm nhấn là một màu duy nhất. Có cả xu hướng "warm light background + one accent" (case study Mirello), nhưng màu nhấn chói (lime) thì ngược với mong muốn "không màu mè".
- Màn chính dạng danh sách theo ngày hoặc lịch; app "life timeline" gom theo ngày, mới nhất ở trên.
- Nguồn: [Minimal Diary](https://marlvel.ai/api/llm/apps/lifestyle/minimal-diary-simple-journal), [Minimal Diary · Life timeline](https://marlvel.ai/api/llm/apps/lifestyle/minimal-diary-life-timeline), [Mirello case study](https://contra.com/p/XqQ7WZqv-journaling-and-goal-tracking-mobile-app-uxui-design-or-mirello), [Sora journal concept](https://contra.com/p/LkUYAkPr-sora-a-journal-app), [Design critique: Journal (iPhone)](https://ixd.prattsi.org/2026/02/design-critique-journal-iphone-app/), [Diarly 2](https://www.producthunt.com/p/diarlyapp/diarly-2).

## Màn thêm khoản chi

- Bố cục phổ biến: số tiền lớn, lưới danh mục, bàn phím số ở dưới ([screensdesign · tracking expenses](https://screensdesign.com/explore/flows/tracking-expenses/), [numeric keypads](https://screensdesign.com/explore/ui-elements/numeric-keypads/)).
- Rút gọn màn nhập còn lưới danh mục + số, nút thêm là nút nổi to ([engineered.at](https://engineered.at/articles/why-i-built-my-own-expense-tracker)).
- Người dùng muốn bàn phím số khi chạm ô số tiền, không phải bàn phím chữ ([Budgetflow feedback](https://budgetflow.featurebase.app/p/easier-and-faster-way-for-adding-a-new-transaction)).
- Ngày mặc định là hôm nay để bớt một bước ([MoneyInOut guide](https://jack-cap.github.io/MoneyInOut-Page/user-guide/transactions)); tránh bước xác nhận thừa trên form nhỏ ([Hectic usability](https://feedback.hecticapp.com/usability-issues)).

Đây là pattern từ các gallery và phản hồi người dùng, không phải nghiên cứu khả dụng có số liệu.

## Áp vào Nhà Mình

| Pattern | Cách dùng |
| --- | --- |
| Nền sáng ấm + một điểm nhấn | Giấy & Mực, nhấn xanh rêu |
| Danh sách theo ngày, mới nhất trên | Màn Sổ, nhóm theo ngày trong tháng |
| Lưới danh mục, ít gõ | Lưới 4 cột, tiêu đề tự điền, chip gợi ý |
| Bàn phím số + chip số tiền nhanh | `number-pad`, chip +10K… +500K |
| Ngày mặc định hôm nay, không xác nhận thừa | Thời gian lấy lúc mở form; chỉ hỏi lại khi xoá hoặc bỏ dở |
