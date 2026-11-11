import "@/global.css";
import "@/lib/i18n";
import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAtomValue } from "jotai";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootErrorBoundary } from "@/components/error-boundary";
import { authHydratedAtom, signedInAtom } from "@/features/account/_atoms/session";
import { AuthListener } from "@/features/account/components/auth-listener";
import { colors } from "@/lib/theme";
import { useAppFonts } from "@/lib/theme/use-app-fonts";

// The form slides up over the journal and is left with ✕, so a swipe-back must not drop a
// draft without the discard question (spec §2.3).
const FORM = { animation: "slide_from_bottom", gestureEnabled: false } as const;

export default function RootLayout() {
  const { loaded: fontsLoaded } = useAppFonts();
  const hydrated = useAtomValue(authHydratedAtom);
  const signedIn = useAtomValue(signedInAtom);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootErrorBoundary>
        <SafeAreaProvider>
          <KeyboardProvider>
            <AuthListener />
            {fontsLoaded && hydrated ? (
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.surface.app },
                }}
              >
                {/* spec §2.0: nothing but Đăng nhập until the family account is signed in. */}
                <Stack.Protected guard={signedIn}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="entry/new" options={FORM} />
                  <Stack.Screen name="entry/[id]/index" />
                  <Stack.Screen name="entry/[id]/edit" options={FORM} />
                  <Stack.Screen name="stats" />
                </Stack.Protected>
                <Stack.Protected guard={!signedIn}>
                  <Stack.Screen name="sign-in" />
                </Stack.Protected>
              </Stack>
            ) : (
              <View className="flex-1 bg-surface-app" />
            )}
            <StatusBar style="dark" />
          </KeyboardProvider>
        </SafeAreaProvider>
      </RootErrorBoundary>
    </GestureHandlerRootView>
  );
}
