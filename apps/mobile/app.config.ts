import type { ConfigContext, ExpoConfig } from "expo/config";
import { palette, semantic } from "./src/lib/theme/tokens";

// The `development` profile adds the dev client for Metro; anything else is the store app.
const IS_DEV_CLIENT_BUILD = process.env.EAS_BUILD_PROFILE === "development";

// Store name decided 2026-11-11 (spec §1). The repo folder and packages keep the first working
// name, `so-nha` / `@sonha`.
const APP_NAME = "Nhà Mình";

// Permanent once the first build is uploaded to a store.
const BUNDLE_ID = "com.bacho.nhaminh";
const BACKGROUND = semantic.surface.app;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: "nha-minh",
  version: "0.1.0",
  scheme: "nhaminh",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  // Light only in the MVP (dev/design/README.md, Quyết định).
  userInterfaceStyle: "light",
  backgroundColor: BACKGROUND,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: BACKGROUND,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: BUNDLE_ID,
    infoPlist: {
      CFBundleDisplayName: APP_NAME,
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundColor: palette.moss[500],
    },
    package: BUNDLE_ID,
    // Everything stays on the phone (spec §3.3); the app asks for nothing it does not use.
    blockedPermissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.SYSTEM_ALERT_WINDOW",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "com.google.android.gms.permission.AD_ID",
    ],
  },
  plugins: [
    "expo-router",
    // The Android date/time dialogs take the moss accent instead of the system teal.
    [
      "@react-native-community/datetimepicker",
      {
        android: {
          datePicker: { colorAccent: { light: palette.moss[500] } },
          timePicker: {
            headerBackground: { light: palette.moss[500] },
            numbersSelectorColor: { light: palette.moss[500] },
          },
        },
      },
    ],
    "./plugins/with-ios-min-deployment-target",
    "./plugins/with-ios-scene-lifecycle",
    ...(IS_DEV_CLIENT_BUILD ? ["expo-dev-client" as const] : []),
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: BACKGROUND,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
