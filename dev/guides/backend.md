# Runbook — Server và Supabase

> Sổ của cả nhà nằm trên server (spec `../specs/mvp.md` §2.0, §3.3). Runbook này dựng Supabase, deploy server, rồi đưa địa chỉ vào bản build.
> Cập nhật: 2026-11-11

```
App ──đăng nhập (email + mật khẩu)──▶ Supabase Auth
 │
 └──Bearer token──▶ apps/server (Fastify, Railway) ──secret key──▶ Supabase Postgres (bảng entries)
```

App chỉ nói chuyện với Supabase để đăng nhập. Đọc, ghi, xoá ghi chép đều qua server. Bảng `entries` bật RLS nhưng không có policy nào, nên chỉ server (giữ secret key) đọc ghi được.

## 1. Supabase production (làm một lần)

1. supabase.com → **New project**, region **Southeast Asia (Singapore)**. Ghi lại project ref và mật khẩu DB.
2. Từ gốc repo: `npx supabase@2.122.0 link --project-ref <ref>` rồi `pnpm db:push` (chạy `supabase/migrations/`).
3. **Tắt đăng ký:** Authentication → Sign In / Providers → tắt **Allow new users to sign up**. App không có màn đăng ký; tài khoản do mình tạo.
4. **Tạo tài khoản của nhà:** Authentication → Users → **Add user → Create new user**: email + mật khẩu (từ 8 ký tự), tick **Auto Confirm User**. Gửi email + mật khẩu này cho cả nhà.
5. Settings → API Keys: lấy **URL**, **publishable key** (`sb_publishable_…`, cho app) và **secret key** (`sb_secret_…`, chỉ cho server).

Đổi mật khẩu sau này (Users → … → Reset password, hoặc đặt mới) thì mọi máy bị đưa về màn Đăng nhập ở lần gọi server kế tiếp.

## 2. Server lên Railway

Image: `apps/server/Dockerfile`, build từ **gốc repo** (server cần `packages/types`). Thử trên máy trước:

```bash
docker build -f apps/server/Dockerfile -t nha-minh-server .
docker run --rm --env-file apps/server/.env -e PORT=8080 -p 3998:8080 nha-minh-server
curl localhost:3998/health
```

1. railway.com → **New Project → Deploy from GitHub repo** → repo này, nhánh `master`. Railway tạo mỗi package một service: **xoá service `@sonha/mobile`**, giữ `@sonha/server`.
2. Service server → Settings:
   - **Root Directory: để trống** (gốc repo). **Builder: Dockerfile**, **Dockerfile Path: `apps/server/Dockerfile`**. Xoá Build/Start Command Railway tự điền.
   - **Healthcheck Path:** `/health`. Region **Southeast Asia (Singapore)**, 1 replica.
   - **Watch Paths:** `apps/server/**`, `packages/types/**`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.base.json`: đổi app mobile không build lại server.
3. **Variables:**
   ```
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_...
   ```
   Không đặt `PORT` (Railway tự cấp) và `NODE_ENV` (Dockerfile đã đặt `production`).
4. **Networking → Generate Domain** (`<tên>.up.railway.app`); có tên miền riêng thì thêm Custom Domain.
5. Kiểm tra: `curl https://<domain>/health` trả `{"status":"ok",…}`; `curl https://<domain>/entries` trả 401 `UNAUTHORIZED`.

Mỗi lần push lên `master`, Railway tự build lại khi một watch path đổi.

## 3. Chạy trên máy (dev)

Cần Docker Desktop đang chạy.

```bash
pnpm db:start        # Supabase local: API :56321, Studio :56323; in ra publishable + secret key
cp apps/server/.env.example apps/server/.env   # điền SUPABASE_SECRET_KEY từ db:start
pnpm server:dev      # server :3100
```

`apps/mobile/.env` (không commit):

```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:56321
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

Để trống `EXPO_PUBLIC_API_URL` trong dev: app tự gọi server ở máy đang chạy Metro, cổng 3100; `localhost` trong URL Supabase cũng được đổi sang máy đó.

- Điện thoại cùng Wi-Fi với laptop: chạy được ngay.
- Mở dev client qua `localhost` + `adb reverse` (Metro cổng 8082, `mobile-dev.md`): reverse thêm hai cổng: `adb reverse tcp:3100 tcp:3100` và `adb reverse tcp:56321 tcp:56321`.

Tài khoản thử trên máy (từ `supabase/seed.sql`): **nha@example.com / nhaminh123**. `pnpm db:reset` xoá sạch và tạo lại. `pnpm db:new <tên>` tạo migration mới.

Đổi `EXPO_PUBLIC_*` thì khởi động lại Metro (`pnpm mobile:fresh`); `@supabase/supabase-js` là JS thuần nên không cần build lại dev build.

## 4. Bản build dùng server thật

Biến `EXPO_PUBLIC_*` được nhúng vào JS lúc build. Thiếu `EXPO_PUBLIC_API_URL` thì bản build gọi `localhost:3100` và màn Sổ báo "Không tải được sổ".

| Biến | Giá trị production |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | `https://<domain server>` (mục 2) |
| `EXPO_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | publishable key (`sb_publishable_…`) |

- **Android release trên máy** (`pnpm mobile:android:release`): ghi ba biến vào `apps/mobile/.env.production` (đã gitignore). Expo đọc file này khi build release.
- **iOS qua EAS** (`release-ios.md`): profile `internal-test` dùng EAS environment **production**. Tạo một lần:
  ```bash
  cd apps/mobile
  pnpm dlx eas-cli@25.3.0 env:create --environment production --name EXPO_PUBLIC_API_URL --value https://<domain> --visibility plaintext
  pnpm dlx eas-cli@25.3.0 env:create --environment production --name EXPO_PUBLIC_SUPABASE_URL --value https://<ref>.supabase.co --visibility plaintext
  pnpm dlx eas-cli@25.3.0 env:create --environment production --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value sb_publishable_... --visibility plaintext
  ```
  Kiểm tra: `pnpm dlx eas-cli@25.3.0 env:list --environment production`.

## 5. Gỡ lỗi

- **Sổ báo "Không tải được sổ" trên dev:** server có chạy không (`curl localhost:3100/health`)? Điện thoại tới được laptop không (cùng Wi-Fi, hoặc đã `adb reverse tcp:3100`)? Log server ở terminal `pnpm server:dev`.
- **Đăng nhập báo "Không kết nối được":** app không tới được Supabase: kiểm tra `EXPO_PUBLIC_SUPABASE_URL` và cổng 56321 (dev).
- **Đăng nhập báo sai mật khẩu dù đúng:** user chưa được confirm (tick Auto Confirm khi tạo), hoặc đang trỏ nhầm project.
- **Server 500 "Couldn't check the sign-in":** sai `SUPABASE_URL` / `SUPABASE_SECRET_KEY`, hoặc key của project khác.
