import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, Platform, Pressable, View } from "react-native";

import { useStableSafeAreaInsets } from "@/lib/hooks/use-stable-safe-area-insets";
import { useT } from "@/lib/i18n";
import { colors, withAlpha } from "@/lib/theme";

import { Text } from "./text";
import { FieldFrame } from "./text-field";

/**
 * A field with a small label that opens the system date picker (dev/design `.range-row .field`).
 * Android uses the picker dialog; iOS a bottom spinner with Huỷ / Xong.
 */
export function DateBox({
  label,
  display,
  value,
  maximumDate,
  onPick,
}: {
  label: string;
  display: string;
  value: Date;
  maximumDate: Date;
  onPick: (date: Date) => void;
}) {
  const t = useT();
  const insets = useStableSafeAreaInsets();
  // Pure view state: the iOS sheet and its draft before Xong.
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const press = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value,
        mode: "date",
        maximumDate,
        onChange: (event, picked) => {
          if (event.type === "set" && picked) onPick(picked);
        },
      });
      return;
    }
    setDraft(value);
    setOpen(true);
  };

  return (
    <Pressable
      onPress={press}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${display}`}
      className="flex-1"
    >
      <FieldFrame>
        <View>
          <Text variant="meta">{label}</Text>
          <Text variant="body-md" tone="heading">
            {display}
          </Text>
        </View>
      </FieldFrame>

      {Platform.OS === "ios" ? (
        <Modal
          visible={open}
          transparent
          animationType="slide"
          onRequestClose={() => setOpen(false)}
        >
          <Pressable
            accessible={false}
            className="flex-1 justify-end"
            style={{ backgroundColor: withAlpha(colors.ink.heading, 0.4) }}
            onPress={() => setOpen(false)}
          >
            <Pressable
              accessible={false}
              className="w-full max-w-[680px] self-center rounded-t-sheet bg-surface-card pt-2"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              <View className="flex-row items-center justify-between px-4 py-2">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setOpen(false)}
                  className="p-2"
                >
                  <Text variant="body-md" tone="muted">
                    {t("common.cancel")}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    onPick(draft);
                    setOpen(false);
                  }}
                  className="p-2"
                >
                  <Text variant="body-md" tone="accent" className="font-bvp-semibold">
                    {t("common.done")}
                  </Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={draft}
                mode="date"
                display="spinner"
                locale="vi-VN"
                themeVariant="light"
                maximumDate={maximumDate}
                onChange={(_e, picked) => picked && setDraft(picked)}
                textColor={colors.ink.heading}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </Pressable>
  );
}
