import { Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { ScreenContent } from "@/components/screen-content";
import { Text } from "@/components/text";
import { SignInForm } from "@/features/account/components/sign-in-form";
import { useStableSafeAreaInsets } from "@/lib/hooks/use-stable-safe-area-insets";
import { useT } from "@/lib/i18n";

const LOGO = require("../../assets/images/icon.png");

/** Đăng nhập: the only screen until the family account is signed in (spec §2.0). */
export default function SignInScreen() {
  const t = useT();
  const insets = useStableSafeAreaInsets();
  return (
    <View className="flex-1 bg-surface-app">
      <ScreenContent maxWidth={440}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          }}
          bottomOffset={24}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6 items-center gap-1.5">
            <Image
              source={LOGO}
              style={{ width: 76, height: 76, borderRadius: 17 }}
              accessibilityIgnoresInvertColors
            />
            <Text variant="heading-lg" className="mt-1">
              {t("journal.brand")}
            </Text>
            <Text variant="caption" className="text-center">
              {t("signIn.subtitle")}
            </Text>
          </View>
          <SignInForm />
        </KeyboardAwareScrollView>
      </ScreenContent>
    </View>
  );
}
