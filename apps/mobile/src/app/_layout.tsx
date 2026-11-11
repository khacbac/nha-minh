import "@/global.css";
import "@/lib/i18n";
import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootErrorBoundary } from "@/components/error-boundary";
import { colors } from "@/lib/theme";
import { useAppFonts } from "@/lib/theme/use-app-fonts";

// The form slides up over the journal and is left with ✕, so a swipe-back must not drop a
// draft without the discard question (spec §2.3).
const FORM = { animation: "slide_from_bottom", gestureEnabled: false } as const;

export default function RootLayout() {
  const { loaded: fontsLoaded } = useAppFonts();
  if (!fontsLoaded) return <View className="flex-1 bg-background" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootErrorBoundary>
        <SafeAreaProvider>
          <KeyboardProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.surface.app },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="entry/new" options={FORM} />
              <Stack.Screen name="entry/[id]/index" />
              <Stack.Screen name="entry/[id]/edit" options={FORM} />
              <Stack.Screen name="stats" />
            </Stack>
            <StatusBar style="dark" />
          </KeyboardProvider>
        </SafeAreaProvider>
      </RootErrorBoundary>
    </GestureHandlerRootView>
  );
}
