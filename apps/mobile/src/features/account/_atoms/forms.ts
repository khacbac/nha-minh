import { fieldAtom, formAtom } from "form-atoms";

/** Đăng nhập (spec §2.0). Kept after a failed try so nothing has to be typed again. */
export const signInFields = {
  email: fieldAtom({ name: "email", value: "" }),
  password: fieldAtom({ name: "password", value: "" }),
};

export const signInForm = formAtom(signInFields);
