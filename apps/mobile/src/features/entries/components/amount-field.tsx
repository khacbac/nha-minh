import { useFieldValue } from "form-atoms";
import { useSetAtom } from "jotai";
import { Pressable, ScrollView, View } from "react-native";

import { Chip } from "@/components/chip";
import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { TextField } from "@/components/text-field";
import { useT } from "@/lib/i18n";
import { colors } from "@/lib/theme";

import type { EntryForm } from "../_atoms/forms";
import { QUICK_AMOUNTS, displayDigits, quickLabel } from "../money";

/** Số tiền: number pad, dots added as you type, ₫, quick +chips, clear (spec §2.3). */
export function AmountField({ form }: { form: EntryForm }) {
  const t = useT();
  const digits = useFieldValue(form.fields.amountDigits);
  const type = useSetAtom(form.typeAmountAtom);
  const add = useSetAtom(form.addAmountAtom);
  return (
    <View>
      <TextField
        value={displayDigits(digits)}
        onChangeText={type}
        placeholder="0"
        keyboardType="number-pad"
        accessibilityLabel={t("entry.amount")}
        trailing={
          <View className="flex-row items-center gap-2">
            {digits !== "" ? (
              <Pressable
                onPress={() => type("")}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t("entry.clearAmount")}
              >
                <Icon name="close" size={18} color={colors.ink.faint} />
              </Pressable>
            ) : null}
            <Text variant="body-lg" tone="muted">
              ₫
            </Text>
          </View>
        }
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
        style={{ marginHorizontal: -20, marginTop: 8, flexGrow: 0 }}
      >
        {QUICK_AMOUNTS.map((amount) => (
          <Chip key={amount} label={quickLabel(amount)} soft onPress={() => add(amount)} />
        ))}
      </ScrollView>
    </View>
  );
}
