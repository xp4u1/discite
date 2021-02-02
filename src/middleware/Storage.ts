import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const key = "redux";

/**
 * Lädt den zwischengespeicherten Store in den Speicher.
 *
 * Speichermethoden:
 * - Local Storage - PWA
 * - UserDefaults - iOS
 * - SharedPreferences - Android
 */
export const loadStore = async () => {
  const data = await Storage.get({ key: key });
  if (data.value) return JSON.parse(data.value);

  return null;
};

/**
 * Speichert den Store im Speicher.
 * @param store aktueller Snapshot des Stores
 *
 * Speichermethoden:
 * - Local Storage - PWA
 * - UserDefaults - iOS
 * - SharedPreferences - Android
 */
export const saveStore = async (store: any) => {
  setSetting(key, store);
};

/**
 * Speichert einen Wert im Speicher.
 * @param key Schlüssel, damit der Wert später wieder ausgelesen werden kann.
 * @param value Wert, der gespeichert werden soll
 *
 * Speichermethoden:
 * - Local Storage - PWA
 * - UserDefaults - iOS
 * - SharedPreferences - Android
 */
export const setSetting = async (key: string, value: any) => {
  await Storage.set({ key: key, value: JSON.stringify(value) });
};

/**
 * Liest einen Wert aus dem Speicher.
 * @param key Schlüssel, damit der Wert später wieder ausgelesen werden kann.
 * @param defaultReturn
 *
 * Speichermethoden:
 * - Local Storage - PWA
 * - UserDefaults - iOS
 * - SharedPreferences - Android
 */
export const getSetting = async (key: string, defaultReturn?: any) => {
  const data = await Storage.get({ key: key });
  if (data.value) return JSON.parse(data.value);

  return defaultReturn;
};
