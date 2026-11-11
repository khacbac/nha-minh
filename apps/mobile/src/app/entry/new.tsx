import { useMemo } from "react";

import { EntryFormScreen } from "@/features/entries/components/entry-form-screen";
import { now } from "@/features/entries/day";
import { emptyDraft } from "@/features/entries/draft";

/** Ghi mới: an empty draft timed at the moment the form opens (spec §2.3). */
export default function NewEntryScreen() {
  const initial = useMemo(() => emptyDraft(now()), []);
  return <EntryFormScreen initial={initial} />;
}
