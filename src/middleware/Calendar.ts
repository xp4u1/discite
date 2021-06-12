/**
 * Gibt das heutige Datum um 0:00 Uhr als Unix-Zeitstempel zurück.
 */
export const startTodayTimestamp = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.getTime();
};

/**
 * Gibt den Unix-Zeitstempel für die letzte Millisekunde des heutigen Tages zurück.
 */
export const endTodayTimestamp = (): number => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return today.getTime();
};

/**
 * Gibt das morgige Datum um 0:00 Uhr als Unix-Zeitstempel zurück.
 */
export const startTomorrowTimestamp = (): number => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);

  return date.getTime();
};

/**
 * Gibt den Unix-Zeitstempel für die letzte Millisekunde des morgigen Tages zurück.
 */
export const endTomorrowTimestamp = (): number => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(23, 59, 59, 999);

  return date.getTime();
};

/**
 * Verschiebt ein Datum um eine bestimmte Anzahl von Tagen.
 * @param date Datum, das verändert werden soll
 * @param days Anzahl der Tage
 */
export const shiftDate = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);

  return newDate;
};
