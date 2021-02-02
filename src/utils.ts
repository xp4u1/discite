import { setLearnState } from "./middleware/features/LearnStore";
import { setVocabCollectionState } from "./middleware/features/VocabCollectionStore";
import { RootState, Store } from "./middleware/Store";

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
 * Ersetzt den aktuellen Store.
 * @param rootState Snapshot vom Store
 */
export const replaceStore = (rootState: RootState) => {
  Store.dispatch(setVocabCollectionState(rootState.vocabCollection));
  Store.dispatch(setLearnState(rootState.learn));
};
