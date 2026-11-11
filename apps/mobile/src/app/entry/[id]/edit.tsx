import { router, useLocalSearchParams } from "expo-router";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

import { entryAtomFamily } from "@/features/entries/_atoms/queries";
import { EntryFormScreen } from "@/features/entries/components/entry-form-screen";
import { MissingEntry } from "@/features/entries/components/missing-entry";
import { draftFromEntry } from "@/features/entries/draft";

/** Sửa: the form on the saved entry (spec §2.3). */
export default function EditEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = useAtomValue(entryAtomFamily(id));
  // Seeded once; later writes to the entry do not reset what is being typed.
  // biome-ignore lint/correctness/useExhaustiveDependencies: built once per visit on purpose
  const initial = useMemo(() => (entry ? draftFromEntry(entry) : null), []);
  if (!initial) return <MissingEntry onBack={() => router.back()} />;
  return <EntryFormScreen initial={initial} editingId={id} />;
}
