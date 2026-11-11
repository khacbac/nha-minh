import type { ModalProps } from "react-native";

/**
 * Every orientation, for iOS `Modal`s. A Modal defaults to portrait only, so opening one on an
 * iPad held sideways would turn the app to portrait. The iPhone stays portrait from app.config.
 */
export const ALL_ORIENTATIONS: ModalProps["supportedOrientations"] = [
  "portrait",
  "portrait-upside-down",
  "landscape-left",
  "landscape-right",
];
