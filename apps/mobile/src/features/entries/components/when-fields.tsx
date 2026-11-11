import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useFieldActions, useFieldValue } from "form-atoms";
import { useState } from "react";
import { Keyboard, Modal, Platform, Pressable, View } from "react-native";

import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { FieldFrame } from "@/components/text-field";
import { useStableSafeAreaInsets } from "@/lib/hooks/use-stable-safe-area-insets";
import { useT } from "@/lib/i18n";
import { ALL_ORIENTATIONS } from "@/lib/orientations";
import { colors, withAlpha } from "@/lib/theme";

import type { EntryForm } from "../_atoms/forms";
import { dayInfo, now, timeLabel, withDate, withTime } from "../day";
import { dateFieldLabel } from "../day-label";

type Mode = "date" | "time";

/** Thời gian: a date box and a time box; no date after today (spec §2.3). */
export function WhenFields({ form }: { form: EntryForm }) {
  const t = useT();
  const insets = useStableSafeAreaInsets();
  const value = useFieldValue(form.fields.occurredAt);
  const { setValue } = useFieldActions(form.fields.occurredAt);
  // Pure view state: which iOS picker is open, and its draft before Xong.
  const [iosMode, setIosMode] = useState<Mode | null>(null);
  const [draft, setDraft] = useState(new Date(value));
  const today = now();

  const apply = (mode: Mode, picked: Date) => {
    setValue(
      mode === "date" ? withDate(value, picked.getTime()) : withTime(value, picked.getTime()),
    );
  };

  const open = (mode: Mode) => {
    Keyboard.dismiss();
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: new Date(value),
        mode,
        is24Hour: true,
        ...(mode === "date" ? { maximumDate: new Date(today) } : {}),
        onChange: (event, picked) => {
          if (event.type === "set" && picked) apply(mode, picked);
        },
      });
      return;
    }
    setDraft(new Date(value));
    setIosMode(mode);
  };

  const dateLabel = dateFieldLabel(dayInfo(value, today), new Date(today).getFullYear(), t);

  return (
    <View className="flex-row gap-2.5">
      <Box icon="calendar" label={dateLabel} a11y={t("entry.date")} onPress={() => open("date")} />
      <Box
        icon="clock"
        label={timeLabel(value)}
        a11y={t("entry.time")}
        onPress={() => open("time")}
      />

      {Platform.OS === "ios" ? (
        <Modal
          visible={iosMode !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setIosMode(null)}
          supportedOrientations={ALL_ORIENTATIONS}
        >
          <Pressable
            accessible={false}
            className="flex-1 justify-end"
            style={{ backgroundColor: withAlpha(colors.ink.heading, 0.4) }}
            onPress={() => setIosMode(null)}
          >
            <Pressable
              accessible={false}
              className="w-full max-w-[680px] self-center rounded-t-sheet bg-surface-card pt-2"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              <View className="flex-row items-center justify-between px-4 py-2">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIosMode(null)}
                  className="p-2"
                >
                  <Text variant="body-md" tone="muted">
                    {t("common.cancel")}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    if (iosMode) apply(iosMode, draft);
                    setIosMode(null);
                  }}
                  className="p-2"
                >
                  <Text variant="body-md" tone="accent" className="font-bvp-semibold">
                    {t("common.done")}
                  </Text>
                </Pressable>
              </View>
              {iosMode ? (
                <DateTimePicker
                  value={draft}
                  mode={iosMode}
                  display="spinner"
                  locale="vi-VN"
                  themeVariant="light"
                  {...(iosMode === "date" ? { maximumDate: new Date(today) } : {})}
                  onChange={(_e, picked) => picked && setDraft(picked)}
                  textColor={colors.ink.heading}
                />
              ) : null}
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}

function Box({
  icon,
  label,
  a11y,
  onPress,
}: {
  icon: "calendar" | "clock";
  label: string;
  a11y: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${a11y}: ${label}`}
      className={icon === "calendar" ? "flex-[1.4]" : "flex-1"}
    >
      <FieldFrame>
        <View className="flex-1 flex-row items-center gap-2">
          <Icon name={icon} size={20} color={colors.ink.muted} />
          <Text variant="body-md" tone="heading" numberOfLines={1} className="flex-1">
            {label}
          </Text>
        </View>
      </FieldFrame>
    </Pressable>
  );
}
