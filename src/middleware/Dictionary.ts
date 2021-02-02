import axios from "axios";
import { DictionaryEntriesResponse } from "../classes/DictionaryEntry";

export default class Dictionary {
  private static protocol = "https";
  private static server_url = "paul.hoerenz.com";

  /**
   * Sucht im Wörterbuch nach einem Wort.
   *
   * Beispiel:
   * ```ts
   * Dictionary.search("esse", true).then((response) => {
   *  console.log(response.entries);
   * });
   * ```
   * In der Konsole werden nun die Einträge für „esse“
   * nur mit eine kurzen Liste der Bedeutungen angezeigt.
   *
   * @param query Wort, das gesucht werden soll.
   * @param school Bei `true` wird eine gekürzte Version der Bedeutungen geliefert.
   */
  public static async search(query: string, school: boolean = false) {
    let url = `${this.protocol}://${this.server_url}/api/dictionary/search?word=${query}`;
    if (school) url += "&onlySchool";

    const response = await axios.get(url);
    return response.data as DictionaryEntriesResponse;
  }
}
