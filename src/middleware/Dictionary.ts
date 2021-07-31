import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import DictionaryEntry from "../classes/DictionaryEntry";

interface Word {
  humanWord: string;
  humanForms: string[];
  description: string;
  meanings: string[];
  shortMeanings: string[];
  european: string;
  phrases: Phrase[];
  word: string;
  forms: string[];
}

interface Phrase {
  latin: string;
  german: string;
}

const client = new ApolloClient({
  uri: "https://paul.hoerenz.com/api",
  cache: new InMemoryCache(),
});

const SEARCH_DICTIONARY_ENTRY = gql`
  query Search($word: String!) {
    search(query: $word) {
      humanWord
      humanForms
      description
      meanings
      shortMeanings
      european
    }
  }
`;

const SEARCH_PHRASES = gql`
  query Search($word: String!) {
    search(query: $word) {
      humanWord
      humanForms
      description
      european
      phrases {
        german
        latin
      }
    }
  }
`;

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
 * @param shortMeanings Bei `true` wird eine gekürzte Version der Bedeutungen geliefert.
 */
export const searchDictionary = async (
  query: string,
  shortMeanings: boolean = false
): Promise<DictionaryEntry[]> => {
  const data: Word[] = (
    await client.query({
      query: SEARCH_DICTIONARY_ENTRY,
      variables: {
        word: query,
      },
    })
  ).data.search;

  return data.map((word) => ({
    word: word.humanWord,
    forms: word.humanForms,
    description: word.description,
    european: word.european,
    meanings: shortMeanings ? word.shortMeanings : word.meanings,
  }));
};

/**
 * Sucht im Wörterbuch nach Phrasen zu einem Wort.
 *
 * @param query Wort, das gesucht werden soll.
 */
export const searchDictionaryPhrases = async (
  query: string
): Promise<Word[]> => {
  const data: Word[] = (
    await client.query({
      query: SEARCH_PHRASES,
      variables: {
        word: query,
      },
    })
  ).data.search;

  return data;
};
