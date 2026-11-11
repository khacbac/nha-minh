import { router } from "expo-router";
import { useFieldValue, useFormValues } from "form-atoms";
import { useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { BackHandler, View } from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  useKeyboardState,
} from "react-native-keyboard-controller";

import { Button } from "@/components/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { NavHeader } from "@/components/nav-header";
import { ScreenContent } from "@/components/screen-content";
import { Text } from "@/components/text";
import { categoryOf } from "@/features/categories/catalog";
import { useStableSafeAreaInsets } from "@/lib/hooks/use-stable-safe-area-insets";
import { useT } from "@/lib/i18n";

import { type EntryForm, createEntryForm } from "../_atoms/forms";
import { saveEntryAtom } from "../_atoms/mutations";
import { type EntryDraft, isDraftDirty, isDraftReady } from "../draft";
import { AmountField } from "./amount-field";
import { CategoryGrid } from "./category-grid";
import { NoteField } from "./note-field";
import { TitleField } from "./title-field";
import { WhenFields } from "./when-fields";

/** The Lưu bar under the form (52 button + 12 top padding) plus a small gap. */
const FOOTER_HEIGHT = 76;

/** Ghi mới and Sửa: one form, seeded from `initial` once per visit (spec §2.3). */
export function EntryFormScreen({
  initial,
  editingId,
}: {
  initial: EntryDraft;
  editingId?: string;
}) {
  const t = useT();
  const insets = useStableSafeAreaInsets();
  // The open keyboard already covers the navigation bar, so Lưu sits right on top of it.
  const keyboardOpen = useKeyboardState((state) => state.isVisible);
  // biome-ignore lint/correctness/useExhaustiveDependencies: built once per visit on purpose
  const form = useMemo(() => createEntryForm(initial), []);
  const values = useFormValues(form.form);
  const save = useSetAtom(saveEntryAtom);
  // Pure view state: only this screen shows the discard question.
  const [askDiscard, setAskDiscard] = useState(false);

  const dirty = isDraftDirty(values, initial);
  const ready = isDraftReady(values);

  const close = () => (dirty ? setAskDiscard(true) : router.back());

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!dirty) return false;
      setAskDiscard(true);
      return true;
    });
    return () => sub.remove();
  }, [dirty]);

  const onSave = () => {
    const saved = save({ draft: values, ...(editingId ? { editingId } : {}) });
    if (saved) router.back();
  };

  return (
    // React Native's own KeyboardAvoidingView misjudges the keyboard under Android edge-to-edge
    // and left Lưu behind it; keyboard-controller pads the screen on both platforms and scrolls
    // the focused field clear of the footer.
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View
        className="flex-1 bg-surface-app"
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: (keyboardOpen ? 0 : insets.bottom) + 12,
        }}
      >
        <ScreenContent>
          <View className="px-5">
            <NavHeader
              title={editingId ? t("entry.editTitle") : t("entry.newTitle")}
              backIcon="close"
              onBack={close}
            />
          </View>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
            bottomOffset={FOOTER_HEIGHT}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Label text={t("entry.category")} first />
            <CategoryGrid form={form} />
            <Label text={t("entry.title")} />
            <TitleField form={form} />
            <AmountSection form={form} />
            <Label text={t("entry.when")} />
            <WhenFields form={form} />
            <Label text={t("entry.note")} optional />
            <NoteField form={form} />
          </KeyboardAwareScrollView>
          <View className="border-t border-line px-5 pt-3">
            <Button label={t("common.save")} disabled={!ready} onPress={onSave} />
          </View>
        </ScreenContent>

        <ConfirmDialog
          visible={askDiscard}
          title={t("entry.discardTitle")}
          message={t("entry.discardMessage")}
          confirmLabel={t("entry.discard")}
          cancelLabel={t("entry.stay")}
          confirmTone="danger"
          onCancel={() => setAskDiscard(false)}
          onConfirm={() => {
            setAskDiscard(false);
            router.back();
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

/** Only for categories with money (spec §2.3). */
function AmountSection({ form }: { form: EntryForm }) {
  const t = useT();
  const categoryId = useFieldValue(form.fields.categoryId);
  if (categoryId === "" || categoryOf(categoryId).money === "none") return null;
  return (
    <>
      <Label text={t("entry.amount")} optional />
      <AmountField form={form} />
    </>
  );
}

function Label({ text, optional, first }: { text: string; optional?: boolean; first?: boolean }) {
  const t = useT();
  return (
    <Text variant="ui-label" className={`mb-2 ${first ? "mt-1" : "mt-[18px]"}`}>
      {text}
      {optional ? (
        <Text variant="caption" tone="faint">
          {" "}
          {t("entry.optional")}
        </Text>
      ) : null}
    </Text>
  );
}
