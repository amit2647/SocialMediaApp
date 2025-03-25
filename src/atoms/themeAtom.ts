import { atom } from "recoil";

export const themeAtom = atom<"light" | "dark">({
  key: "themeAtom",
  default: "light", // Default mode
});
