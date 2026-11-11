import type { TOptions } from "i18next";
import i18n from "i18next";
import memoize from "lodash.memoize";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { resources } from "./resources";
import type { RecursiveKeyOf } from "./types/recursive-key";

type DefaultLocale = (typeof resources)["vi"]["translation"];
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

/**
 * Memoized translation for non-reactive call sites (atoms, services, utils).
 * Components should prefer the `useT()` hook so renders update on language change.
 */
export const t = memoize(
  (key: TxKeyPath, options: TOptions | undefined = undefined) =>
    i18n.t(key, options) as unknown as string,
  (key: TxKeyPath, options: TOptions | undefined = undefined) =>
    options ? key + JSON.stringify(options) : key,
);

/**
 * Reactive translation hook — re-renders when the active language changes.
 */
export const useT = () => {
  const { t: reactT } = useTranslation();
  return useCallback(
    (key: TxKeyPath, options: TOptions | undefined = undefined) =>
      reactT(key, options) as unknown as string,
    [reactT],
  );
};
