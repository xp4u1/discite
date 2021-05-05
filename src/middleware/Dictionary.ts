import axios from "axios";
import DictionaryEntry from "../classes/DictionaryEntry";

interface SearchEntry {
  description: string;
  european: string;
  form: string;
  meanings: string[];
  phrases: string[];
  principal_forms: string[];
  word: string;
}

interface Response {
  entries: SearchEntry[];
}

const serverUrl = "https://paul.hoerenz.com";

/**
 * Sucht im Wörterbuch nach einem Wort.
 *
 * Beispiel:
 * ```ts
 * searchDictionary("esse", true).then((response) => {
 *  console.log(response.entries);
 * });
 * ```
 * In der Konsole werden nun die Einträge für „esse“
 * nur mit eine kurzen Liste der Bedeutungen angezeigt.
 *
 * @param query Wort, das gesucht werden soll.
 * @param school Bei `true` wird eine gekürzte Version der Bedeutungen geliefert.
 */
export const searchDictionary = async (
  query: string,
  school: boolean = false
) => {
  let url = `${serverUrl}/api/dictionary/search?word=${query}`;
  if (school) url += "&onlySchool";

  const response = await axios.get(url);

  return (response.data as Response).entries.map(
    (searchEntry) =>
      ({
        description: searchEntry.description,
        european: searchEntry.form,
        forms: searchEntry.principal_forms,
        meanings: searchEntry.meanings,
        word: searchEntry.word,
      } as DictionaryEntry)
  );
};
