export default interface DictionaryEntry {
  word: string;
  principal_forms: string[];
  form: string;
  description: string;
  european: string;
  meanings: string[];
}

export interface DictionaryEntriesResponse {
  entries: DictionaryEntry[];
}
