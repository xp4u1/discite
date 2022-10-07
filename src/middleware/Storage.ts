import { Storage } from "@capacitor/storage";
import { DisciteDatabase } from "./database/DisciteDatabase";

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

/**
 * Entfernt einen Eintrag aus dem Speicher.
 * @param key Schlüssel, dessen Eintrag gelöscht werden soll.
 *
 * Speichermethoden:
 * - Local Storage - PWA
 * - UserDefaults - iOS
 * - SharedPreferences - Android
 */
export const clearSetting = async (key: string) => {
  Storage.remove({ key: key });
};

export const database = new DisciteDatabase();
