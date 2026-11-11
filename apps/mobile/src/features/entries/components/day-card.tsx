import { memo } from "react";
import { View } from "react-native";

import { Text } from "@/components/text";
import { useT } from "@/lib/i18n";

import { dayInfo, now } from "../day";
import { dayHeading } from "../day-label";
import { formatVnd } from "../money";
import type { DaySection } from "../timeline";
import { EntryRow } from "./entry-row";

/** dev/design/kit/ui.css `.day-head` + `.day-card`: one day of the journal (spec §2.1). */
export const DayCard = memo(function DayCard({ section }: { section: DaySection }) {
  const t = useT();
  const today = now();
  const heading = dayHeading(dayInfo(section.at, today), new Date(today).getFullYear(), t);
  return (
    <View>
      <View className="flex-row items-baseline justify-between px-0.5 pb-1.5 pt-3.5">
        <Text variant="ui-label" tone="heading" className="font-bvp-semibold">
          {heading}
        </Text>
        {section.spent > 0 ? <Text variant="caption">{formatVnd(section.spent)}</Text> : null}
      </View>
      <View className="overflow-hidden rounded-card border border-line bg-surface-card">
        {section.entries.map((entry, i) => (
          <EntryRow key={entry.id} entry={entry} first={i === 0} />
        ))}
      </View>
    </View>
  );
});
