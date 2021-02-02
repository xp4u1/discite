import IndexCard from "./IndexCard";

export default interface VocabCollection {
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
