import DictionaryEntry from "../classes/DictionaryEntry";
import VocabCollection from "../classes/VocabCollection";

export const demoIndexCards: DictionaryEntry[] = [
  {
    word: "amāre",
    description: "Verb, a-Konj.",
    european:
      "F aimer; I amare; P amar (subst.  o amo); S amar (amo: Herr; ama: Herrin; te amo ...)",
    forms: ["amāre", "amō", "amāvī", "amātum"],
    meanings: [
      "lieben, verliebt sein",
      "mögen, gern haben, helfen",
      "sei so gut, ich bitte sehr, ich bitte schön (Umgangssprache: amabo/amabo te)",
    ],
  },
  {
    word: "gladiātor",
    description: "Subst., kons. Dekl.",
    european: "Gladiator; E gladiator; F gladiateur; I gladiatore; S gladiador",
    forms: ["gladiātor", "gladiātōris", "m"],
    meanings: ["Gladiator, Schwertkämpfer"],
  },
  {
    word: "fēlīx",
    description: "Adj., 3. Dekl., 1-endig",
    european: "Felix; F féliciter; I felice; S feliz",
    forms: ["gladiātor", "gladiātōris", "m"],
    meanings: [
      "glücklich, glückbringend, vom Glück begünstigt",
      "erfolgreich, gesegnet",
    ],
  },
];

export const demoVocabCollection: VocabCollection = {
  title: "Neue Sammlung",
  subtitle: "Kategorie",
  description: "Lorem ipsum dolor sit amet.",
  image: "/assets/images/bg-2.png",
  indexCards: demoIndexCards,
  lastLearnt: Date.now(),
};
