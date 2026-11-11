/**
 * Semantic haptic feedback, centralised.
 *
 * Instead of reaching for `expo-haptics` and picking a raw impact/notification
 * style at each call site, use these intent-named helpers so the *meaning*
 * (a card answered, a selection changed, an action failed) stays consistent
 * across the app and can be tuned in one place.
 *
 * Every call is wrapped so a haptics failure (unsupported device, simulator,
 * permission) is a silent no-op — feedback should never throw into a flow.
 *
 * Card audio and the quiz right/wrong sounds go through `@/lib/audio`; this file is
 * haptics only.
 */

import * as Haptics from "expo-haptics";

const safe = (run: () => Promise<unknown>) => {
  void run().catch(() => undefined);
};

export const feedback = {
  /** A light tap — buttons, toggles, minor confirmations. */
  light: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** A firmer tap — primary actions, committing a choice. */
  medium: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  /** Moving between options in a picker / stepper. */
  selection: () => safe(() => Haptics.selectionAsync()),
  /** A right answer, a finished session. */
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  /** A soft caution — rejected input, gentle "not yet". */
  warning: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  /** Something failed — network error, invalid action. */
  error: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};
