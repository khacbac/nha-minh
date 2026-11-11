import { useFieldActions, useFieldErrors, useFieldValue } from "form-atoms";
import { useSetAtom } from "jotai";
import { View } from "react-native";

import { Chip } from "@/components/chip";
import { TextField } from "@/components/text-field";
import { categoryOf } from "@/features/categories/catalog";
import { useT } from "@/lib/i18n";

import type { EntryForm } from "../_atoms/forms";

/** Tiêu đề + the picked category's suggestion chips (spec §2.3). */
export function TitleField({ form }: { form: EntryForm }) {
  const t = useT();
  const title = useFieldValue(form.fields.title);
  const errors = useFieldErrors(form.fields.title);
  const { setValue, setTouched } = useFieldActions(form.fields.title);
  const categoryId = useFieldValue(form.fields.categoryId);
  const pickTitle = useSetAtom(form.pickTitleAtom);
  const suggestions = categoryId === "" ? [] : categoryOf(categoryId).titles;
  return (
    <View>
      <TextField
        value={title}
        onChangeText={setValue}
        onBlur={() => setTouched(true)}
        placeholder={t("entry.titlePlaceholder")}
        maxLength={120}
        returnKeyType="done"
        error={errors[0]}
        accessibilityLabel={t("entry.title")}
      />
      {suggestions.length > 0 ? (
        <View className="mt-2 flex-row flex-wrap gap-2">
          {suggestions.map((s) => (
            <Chip
              key={s}
              label={s}
              on={s === title.trim()}
              soft={s !== title.trim()}
              onPress={() => pickTitle(s)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
