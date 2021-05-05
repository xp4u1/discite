import DictionaryEntry from "../../classes/DictionaryEntry";
import { clearSetting, database, getSetting } from "../Storage";

interface LegacyDictionaryEntry {
  description: string;
  european: string;
  form: string;
  meanings: string[];
  phrases: string[];
  principal_forms: string[];
  word: string;
}

interface LegacyIndexCard {
  content: LegacyDictionaryEntry;
  repetition: number;
}

interface LegacyCollection {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  indexCards: LegacyIndexCard[];
  lastLearnt: string;
}

interface LegacyLearnEntry {
  indexCard: LegacyIndexCard;
  nextRepetition: string;
}

interface LegacyVocabStore {
  collections: LegacyCollection[];
  selectedCollection: LegacyCollection[];
}

interface LegacyLearnStore {
  entries: LegacyLearnEntry[];
  stats: any;
}

interface LegacyStore {
  vocabCollection: LegacyVocabStore;
  learn: LegacyLearnStore;
}

const convertIndexCard = (card: LegacyIndexCard): DictionaryEntry => {
  return {
    description: card.content.description,
    european: card.content.european,
    forms: card.content.principal_forms,
    meanings: card.content.meanings,
    word: card.content.word,
  };
};

const legacyIntervals = (step: number) => {
  switch (step) {
    case 0:
    case 1:
    case 2:
    case 3:
      // ein Tag
      return 1440;
    case 4:
      // eine Woche
      return 10080;
    case 5:
      return 20160;
    case 6:
      // ein Monat
      return 43200;
    default:
      return 86400;
  }
};

export const importV1 = async () => {
  const redux = await getSetting("redux");
  if (!redux) return false;

  const store: LegacyStore = redux;

  database.collections.bulkAdd(
    store.vocabCollection.collections.map((collection) => ({
      description: collection.description,
      image: collection.image,
      indexCards: collection.indexCards.map(convertIndexCard),
      lastLearnt: new Date(collection.lastLearnt).getTime(),
      subtitle: collection.subtitle,
      title: collection.title,
    }))
  );
  database.learn.bulkAdd(
    store.learn.entries.map((entry) => ({
      content: convertIndexCard(entry.indexCard),
      date: new Date(entry.nextRepetition).getTime(),
      ease: 2.5,
      graduated: entry.indexCard.repetition > 3,
      lastInterval: legacyIntervals(entry.indexCard.repetition),
      relearning: false,
      step: entry.indexCard.repetition < 4 ? entry.indexCard.repetition : 0,
    }))
  );

  clearSetting("redux");

  return true;
};
