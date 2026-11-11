# Runbook — Server và Supabase

> Sổ của cả nhà nằm trên server (spec `../specs/mvp.md` §2.0, §3.3). Runbook này dựng Supabase, deploy server, rồi đưa địa chỉ vào bản build.
> **Chỉ có một database: Supabase production.** Dự án nhỏ nên không có Supabase local hay staging; chạy dev trên máy thì server là server local, nhưng vẫn đọc ghi đúng sổ thật của nhà.
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

**Đã dựng 2026-11-11:** Railway project **`nha-minh`** (workspace khacbac, cùng tài khoản với Offmute), service **`nha-minh-server`**, region Singapore, 1 replica.

| Thứ | Giá trị |
| --- | --- |
| URL | `https://nha-minh-server-production.up.railway.app` |
| Nguồn | GitHub `khacbac/nha-minh`, nhánh `master`: **mỗi lần push lên `master` tự build và deploy** nếu đổi một watch path |
| Watch paths | `apps/server/**`, `packages/types/**`, `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.railway/**` (đổi app mobile hay docs không build lại server) |
| Build / kiểm tra | `apps/server/Dockerfile` từ gốc repo; healthcheck `/health` |
| Variables | `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (giá trị như `apps/server/.env.production`); không đặt `PORT`, `NODE_ENV` |

Cấu hình service (nguồn, build, watch paths, healthcheck, region) nằm trong **`.railway/railway.ts`**. Railway không đọc file này khi deploy; sửa file rồi áp dụng từ gốc repo:

```powershell
# PowerShell: trên Windows SDK gọi nhầm lệnh `railway` và báo "requires Railway CLI 5.42.1 or newer"
$env:_ = "$env:APPDATA\npm\node_modules\@railway\cli\bin\railway.exe"
& $env:_ config plan     # xem trước
& $env:_ config apply    # áp dụng
```

Variables không nằm trong file (`variables: { managed: false }`): đổi bằng dashboard hoặc `railway variables --service nha-minh-server --set KEY=value`.

Thử lại sau mỗi deploy: `curl https://nha-minh-server-production.up.railway.app/health` trả `{"status":"ok",…}`, `…/entries` trả 401 `UNAUTHORIZED`. Log: `railway logs --service nha-minh-server`; danh sách deploy: `railway deployment list --service nha-minh-server`.

Dựng lại từ đầu (project khác): `railway init --name <tên>` trong repo, `config apply` như trên, đặt hai variables, `railway domain --service nha-minh-server`.

## 3. Chạy trên máy (dev)

```
App (dev build) ──▶ server local :3100 (pnpm server:dev) ──▶ Supabase production
       └──────────── đăng nhập ───────────────────────────▶ Supabase production
```

Không cần Docker. Hai file env (không commit), cùng project Supabase với bản build:

`apps/server/.env` (mẫu ở `.env.example`):

```
NODE_ENV=development
PORT=3100
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

`apps/mobile/.env`:

```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

Rồi `pnpm server:dev` và Metro. Để trống `EXPO_PUBLIC_API_URL` trong dev: app tự gọi server ở máy đang chạy Metro, cổng 3100.

- Điện thoại cùng Wi-Fi với laptop: chạy được ngay.
- Mở dev client qua `localhost` + `adb reverse` (Metro cổng 8082, `mobile-dev.md`): reverse thêm cổng server: `adb reverse tcp:3100 tcp:3100`.

Đăng nhập bằng tài khoản thật của nhà. **Ghi, sửa, xoá khi dev là ghi vào sổ thật**: thử xong thì xoá ghi chép thử.

**Đổi bảng:** `pnpm db:new <tên>` tạo file trong `supabase/migrations/`, viết SQL, rồi `pnpm db:push` chạy thẳng lên production. Chỉ thêm cột / bảng; đổi hay xoá cột thì deploy server mới trước, vì bản build cũ vẫn đang dùng.

Đổi `EXPO_PUBLIC_*` thì khởi động lại Metro (`pnpm mobile:fresh`); `@supabase/supabase-js` là JS thuần nên không cần build lại dev build.

## 4. Bản build dùng server thật

Biến `EXPO_PUBLIC_*` được nhúng vào JS lúc build. Thiếu `EXPO_PUBLIC_API_URL` thì bản build gọi `localhost:3100` và màn Sổ báo "Không tải được sổ".

| Biến | Giá trị production |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | `https://nha-minh-server-production.up.railway.app` |
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
- **Đăng nhập báo "Không kết nối được":** app không tới được Supabase: kiểm tra `EXPO_PUBLIC_SUPABASE_URL` và mạng của điện thoại.
- **Đăng nhập báo sai mật khẩu dù đúng:** user chưa được confirm (tick Auto Confirm khi tạo), hoặc đang trỏ nhầm project.
- **Server 500 "Couldn't check the sign-in":** sai `SUPABASE_URL` / `SUPABASE_SECRET_KEY`, hoặc key của project khác.
