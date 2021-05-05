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
