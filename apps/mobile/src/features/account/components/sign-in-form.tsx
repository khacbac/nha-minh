import { useFieldActions, useFieldValue } from "form-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useRef } from "react";
import type { TextInput } from "react-native";
import { View } from "react-native";

import { Button } from "@/components/button";
import { Text } from "@/components/text";
import { TextField } from "@/components/text-field";
import { useT } from "@/lib/i18n";

import { signInFields } from "../_atoms/forms";
import { signInAtom } from "../_atoms/mutations";
import { signInStatusAtom } from "../_atoms/ui";
import { canSignIn } from "../sign-in";

/** Email, Mật khẩu, Đăng nhập and the error line under it (spec §2.0, design: sign-in). */
export function SignInForm() {
  const t = useT();
  const email = useFieldValue(signInFields.email);
  const password = useFieldValue(signInFields.password);
  const emailActions = useFieldActions(signInFields.email);
  const passwordActions = useFieldActions(signInFields.password);
  const status = useAtomValue(signInStatusAtom);
  const signIn = useSetAtom(signInAtom);
  const passwordRef = useRef<TextInput>(null);
  const busy = status.state === "busy";
  const error =
    status.state === "wrong"
      ? t("signIn.wrong")
      : status.state === "offline"
        ? t("signIn.offline")
        : status.state === "tooMany"
          ? t("signIn.tooMany")
          : null;

  return (
    <View className="gap-2">
      <Text variant="ui-label">{t("signIn.email")}</Text>
      <TextField
        value={email}
        onChangeText={emailActions.setValue}
        placeholder={t("signIn.emailPlaceholder")}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="username"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        editable={!busy}
        accessibilityLabel={t("signIn.email")}
      />
      <Text variant="ui-label" className="mt-2">
        {t("signIn.password")}
      </Text>
      <TextField
        ref={passwordRef}
        value={password}
        onChangeText={passwordActions.setValue}
        placeholder={t("signIn.password")}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={() => void signIn()}
        editable={!busy}
        accessibilityLabel={t("signIn.password")}
      />
      <View className="mt-4">
        <Button
          label={busy ? t("signIn.busy") : t("signIn.submit")}
          disabled={busy || !canSignIn(email, password)}
          onPress={() => void signIn()}
        />
      </View>
      {error ? (
        <Text variant="caption" tone="danger" className="mt-1 text-center">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
