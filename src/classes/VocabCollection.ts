import IndexCard from "./IndexCard";

export default interface VocabCollection {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  /**
   * Bild der Sammlung. Kann sowohl eine URL als auch
   * eine lokale Adresse sein.
   *
   * Beispiel: `/assets/images/bg-2.png`
   */
  image: string;
  indexCards: IndexCard[];
  /**
   * Datum, an dem das letzte Mal die Funktion
   * „Für einen Test üben“ benutzt wurde.
   *
   * Benutzung:
   * ```ts
   * const date = new Date(collection.lastLearnt);
   * collection.lastLearnt = new Date().toJSON();
   * ```
   */
  lastLearnt: string;
}

const randomBackgroundImage = (): string => {
  // Zufällige Zahl zwischen 0 und 3
  return `/assets/images/bg-${Math.floor(Math.random() * 4)}.png`;
};

export const newCollection = {
  title: "Neue Sammlung",
  subtitle: "",
  description: "",
  image: randomBackgroundImage(),
  indexCards: [],
  lastLearnt: new Date().toJSON(),
};
