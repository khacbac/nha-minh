import { useFieldActions, useFieldErrors, useFieldValue } from "form-atoms";

import { TextField } from "@/components/text-field";
import { useT } from "@/lib/i18n";

import type { EntryForm } from "../_atoms/forms";

/** Ghi chú: optional, several lines, up to 2000 characters (spec §2.3). */
export function NoteField({ form }: { form: EntryForm }) {
  const t = useT();
  const note = useFieldValue(form.fields.note);
  const errors = useFieldErrors(form.fields.note);
  const { setValue, setTouched } = useFieldActions(form.fields.note);
  return (
    <TextField
      value={note}
      onChangeText={setValue}
      onBlur={() => setTouched(true)}
      placeholder={t("entry.notePlaceholder")}
      multiline
      maxLength={2000}
      error={errors[0]}
      accessibilityLabel={t("entry.note")}
    />
  );
}
