# Mobile dev runbook

## First time

```bash
nvm use            # Node 22 (.nvmrc); Node 24 also works
pnpm install
pnpm mobile:android   # prebuild + gradle build + install the dev build on the connected phone, then Metro
```

Needs Android SDK + JDK 17 (same setup as the sister apps). The phone must show in `adb devices`.

## Port 8081 taken

If another app's Metro holds 8081 (the Request App often does), run this one on 8082:

```bash
adb reverse tcp:8082 tcp:8082
cd apps/mobile && npx expo start --dev-client --port 8082
adb shell am start -a android.intent.action.VIEW -d "nhaminh://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8082"
```

## Server và đăng nhập

App cần server và Supabase để đăng nhập và tải sổ: `pnpm db:start`, `pnpm server:dev`, `apps/mobile/.env` theo `apps/mobile/.env.example`. Đầy đủ (cổng cần `adb reverse`, tài khoản thử) ở `backend.md` §3.

## Day to day

```bash
pnpm mobile          # Metro only; open "Nhà Mình" on the phone
pnpm mobile:fresh    # a new Tailwind class not applying: clear caches, then Metro
```

A new native dependency or an `app.config.ts` change needs `pnpm mobile:android` again.

## Without Metro (what the family uses)

`pnpm mobile:android:release` builds a release APK with the JS bundled in and installs it: the app then opens without the computer. By hand: `EAS_BUILD_PROFILE=production npx expo prebuild --clean --platform android`, then `cd android && ./gradlew app:assembleRelease`, then `adb install -r app/build/outputs/apk/release/app-release.apk`. If `prebuild --clean` fails with `EBUSY` on a file under `android/app/build`, a Gradle daemon from the last build still holds it: stop that daemon (it is a `java.exe` started by this project's build), then run prebuild again. A debug build looks for Metro on 8081, so it shows a blank screen while another app's Metro holds that port.

## Phone checks

- Screenshot: `adb exec-out screencap -p > shot.png` (Git Bash: prefix `MSYS_NO_PATHCONV=1`).
- Logs: `adb logcat *:S ReactNative:V ReactNativeJS:V`.
- Some test phones block `adb shell input tap`; ask whoever holds the phone to tap.
- Wipe the app's data: `adb shell pm clear com.bacho.nhaminh`.

## Icons

`pnpm mobile:icons` renders `assets/brand/logo.svg` into `assets/images/{icon,android-icon-foreground,splash-icon}.png` (headless Chrome or Edge). Rebuild the app to see them.
