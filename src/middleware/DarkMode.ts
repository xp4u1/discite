import { getSetting, setSetting } from "./Storage";

export const changeDarkMode = (darkMode: boolean) => {
  setSetting("darkMode", darkMode);
  document.body.classList.toggle("dark", darkMode);
};

export const prefersDarkMode = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const initDarkMode = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  // Wenn die Systemeinstellung geändert wird, während Discite geöffnet
  // ist, wird dem Browser das über dieses Event mitgeteilt. Funktioniert
  // leider nicht in Capacitor...
  prefersDark.addListener((event) => changeDarkMode(event.matches));

  getSetting("darkMode", prefersDark.matches).then((result) => {
    changeDarkMode(result);
  });
};
