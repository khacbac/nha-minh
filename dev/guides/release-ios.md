# Runbook — iOS qua EAS → TestFlight

> Build iOS chạy trên máy build của EAS (máy này là Windows, không cần Mac). Bản build lên App Store Connect, cài về iPhone bằng app TestFlight.
> Cập nhật: 2026-11-11

## Đã có sẵn

| Thứ | Giá trị |
| --- | --- |
| Expo project | `@kbho/nha-minh` (`extra.eas.projectId` trong `apps/mobile/app.config.ts`) |
| Bundle id | `com.bacho.nhaminh`: cố định từ bản upload đầu |
| Profile | `internal-test` trong `apps/mobile/eas.json`: store build, build number tự tăng trên EAS (`appVersionSource: remote`), Node 24.14.1 + pnpm 10.13.1 |
| Chỉ iPhone | `supportsTablet: false`: không có layout iPad, App Store không đòi ảnh iPad |
| Mã hoá | `ITSAppUsesNonExemptEncryption: false`: TestFlight không hỏi "Missing Compliance" |
| Server | Profile dùng EAS environment `production`: phải có `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` trước lần build đầu (`backend.md` §4) |

Cần: tài khoản Apple Developer (99 USD/năm) đã kích hoạt, và đăng nhập `eas login` bằng `kbho` (kiểm tra: `pnpm dlx eas-cli@25.3.0 whoami`).

## Lần đầu (chạy ở terminal tương tác)

Từ gốc repo, trong PowerShell hoặc Windows Terminal thật (không chạy qua agent, vì EAS hỏi mật khẩu Apple và mã 2FA):

```bash
pnpm mobile:build:ios:submit
```

EAS sẽ hỏi lần lượt, cứ chọn mặc định:

1. **Đăng nhập Apple ID** → chọn team.
2. **Đăng ký bundle id** `com.bacho.nhaminh` → Yes.
3. **Distribution certificate** và **provisioning profile** → để EAS tạo và giữ (Yes).
4. Build chạy trên cloud khoảng 15–25 phút (link theo dõi trên expo.dev).
5. `--auto-submit` gửi lên App Store Connect. Lần đầu EAS tạo app record "Nhà Mình". Nếu tên đã có người dùng trên App Store, EAS báo lỗi: tạo app tay ở appstoreconnect.apple.com → My Apps → + → New App (bundle id trên, SKU `nha-minh`, tên ví dụ "Nhà Mình – Sổ gia đình") rồi chạy `pnpm mobile:submit:ios`.

Sau khi gửi xong, ghi vào `submit.internal-test.ios` trong `apps/mobile/eas.json` để lần sau không phải hỏi:

```json
"ios": { "ascAppId": "<Apple ID số của app>", "appleTeamId": "<Team ID>" }
```

`ascAppId`: App Store Connect → app → App Information → Apple ID. `appleTeamId`: developer.apple.com → Membership.

## Cài lên iPhone

1. App Store Connect → app → **TestFlight**. Bản build hiện sau khi Apple xử lý xong (5–30 phút, có email báo).
2. **Internal Testing** → tạo nhóm (ví dụ "Nhà") → thêm chính tài khoản Apple của mình (phải là user trong Users and Access). Nhóm internal không cần Apple duyệt.
3. Trên iPhone: cài app **TestFlight** từ App Store, đăng nhập cùng Apple ID → mở lời mời (email) → **Install**.
4. Mỗi bản build TestFlight dùng được 90 ngày.

## Các lần sau

| Lệnh (từ gốc repo) | Làm gì |
| --- | --- |
| `pnpm mobile:build:ios:submit` | Build mới + gửi lên TestFlight (build number tự tăng) |
| `pnpm mobile:build:ios` | Chỉ build, không gửi |
| `pnpm mobile:submit:ios` | Gửi bản build iOS mới nhất đã có |

Bản cũ trên iPhone tự lên bản mới qua TestFlight; dữ liệu (MMKV) giữ nguyên khi cập nhật, chỉ mất khi xoá app.

Đổi `version` trong `app.config.ts` (0.1.0 → 0.2.0) khi muốn TestFlight hiện số phiên bản mới; build number thì EAS tự lo.

## Gỡ lỗi thường gặp

- **Build hỏng ở bước pod / deployment target:** plugin `plugins/with-ios-min-deployment-target.js` nâng mọi target lên iOS 16; xem log "Install pods" trên expo.dev.
- **Màn trắng khi mở app (iOS 27 SDK):** `plugins/with-ios-scene-lifecycle.js` thêm scene delegate; đừng gỡ plugin này.
- **Hết lượt build EAS miễn phí trong tháng:** chờ tháng sau, hoặc build trên Mac với `eas build --local` (cùng profile).
