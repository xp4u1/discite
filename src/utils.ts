/**
 * Mischt einen Array und verändert damit die Reihenfolge
 * seiner Einträge.
 * @param array Array, der gemischt werden soll
 */
export const shuffle = (array: any[]): any[] => {
  const copy = Object.assign([], array);
  copy.sort(() => Math.random() - 0.5);

  return copy === array ? shuffle(array) : copy;
};

/**
 * Gibt den Median von einem Array zurück.
 * @param array Array, aus dem der Median berechnet werden soll
 */
export const median = (array: number[]) => {
  const sorted = array.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? // Es gibt eine gerade Anzahl von Elementen;
      // man nimmt den Mittelwert aus den beiden
      // in der Mitte.
      (sorted[middle] + sorted[middle - 1]) / 2
    : sorted[middle];
};
