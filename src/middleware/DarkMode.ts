import { isPlatform } from "@ionic/react";
import { Keyboard, KeyboardStyle } from "@capacitor/keyboard";

import { getSetting, setSetting } from "./Storage";

export const changeDarkMode = (darkMode: boolean) => {
  setSetting("darkMode", darkMode);
  document.body.classList.toggle("dark", darkMode);

  if (!isPlatform("capacitor")) return;

  Keyboard.setStyle({
    style: darkMode ? KeyboardStyle.Dark : KeyboardStyle.Light,
  });
};

export const prefersDarkMode = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const initDarkMode = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  // Wenn die Systemeinstellung geändert wird, während Discite geöffnet
  // ist, wird dem Browser das über dieses Event mitgeteilt.
  prefersDark.addListener((event) => changeDarkMode(event.matches));

  // Leider gibt Capacitor nicht die Änderung bei Android
  // über diese Schnittstelle weiter. In Browsern und auf
  // iOS/iPadOS funktioniert es jedoch.
  isPlatform("android")
    ? getSetting("darkMode", prefersDark.matches).then((result) =>
        changeDarkMode(result)
      )
    : changeDarkMode(prefersDark.matches);
};
