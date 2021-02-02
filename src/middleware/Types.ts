import LearnEntry from "../classes/LearnEntry";
import VocabCollection from "../classes/VocabCollection";

/// states

export interface VocabCollectionState {
  collections: VocabCollection[];
  selectedCollection?: VocabCollection;
}

export interface LearnState {
  entries: LearnEntry[];
  stats: {
    progress: Array<{ date: string; cardsLearnt: number }>;
  };
}

/// payloads

export interface UpdateVocabCollectionPayload {
  /**
   * Index der VocabCollection. Wird benötigt, um die Änderung zu speichern.
   * Man könnte zwar den Namen verwenden, doch man soll diesen auch noch ändern können.
   */
  id: number;
  /**
   * Neuer "Wert" für die VocabCollection. Die geänderte Klasse wird hier übergeben.
   */
  data: VocabCollection;
}
