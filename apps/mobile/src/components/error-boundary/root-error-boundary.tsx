import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { View } from "react-native";

import { Button } from "@/components/button";
import { Text } from "@/components/text";
import { t } from "@/lib/i18n";

// Full-screen last resort. Uses the non-reactive `t` (no hooks) so it stays
// robust even when the tree below is broken. Retry re-mounts the whole app
// subtree — enough to recover from a transient JS error.
function RootErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <Text variant="heading-md" className="mb-3 text-center">
        {t("errors.unknownTitle")}
      </Text>
      <Text variant="body-lg" tone="muted" className="mb-8 text-center">
        {t("errors.unknown")}
      </Text>
      <Button label={t("common.tryAgain")} onPress={resetErrorBoundary} fullWidth={false} />
    </View>
  );
}

/**
 * App-root boundary — catches render throws so the app never white-screens.
 * Mounted directly inside `GestureHandlerRootView`, above the providers.
 */
export function RootErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary FallbackComponent={RootErrorFallback}>{children}</ErrorBoundary>;
}
