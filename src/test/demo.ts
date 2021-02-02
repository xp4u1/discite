import IndexCard from "../classes/IndexCard";
import VocabCollection from "../classes/VocabCollection";

export const demoIndexCards: IndexCard[] = [
  {
    content: {
      word: "amāre",
      description: "Verb, a-Konj.",
      european:
        "F aimer; I amare; P amar (subst.  o amo); S amar (amo: Herr; ama: Herrin; te amo ...)",
      principal_forms: ["amāre", "amō", "amāvī", "amātum"],
      meanings: [
        "lieben, verliebt sein",
        "mögen, gern haben, helfen",
        "sei so gut, ich bitte sehr, ich bitte schön (Umgangssprache: amabo/amabo te)",
      ],
      form: "",
    },
    repetition: 0,
  },
  {
    content: {
      word: "gladiātor",
      description: "Subst., kons. Dekl.",
      european:
        "Gladiator; E gladiator; F gladiateur; I gladiatore; S gladiador",
      principal_forms: ["gladiātor", "gladiātōris", "m"],
      meanings: ["Gladiator, Schwertkämpfer"],
      form: "",
    },
    repetition: 0,
  },
  {
    content: {
      word: "fēlīx",
      description: "Adj., 3. Dekl., 1-endig",
      european: "Felix; F féliciter; I felice; S feliz",
      principal_forms: ["gladiātor", "gladiātōris", "m"],
      meanings: [
        "glücklich, glückbringend, vom Glück begünstigt",
        "erfolgreich, gesegnet",
      ],
      form: "",
    },
    repetition: 0,
  },
];

export const demoVocabCollection: VocabCollection = {
  title: "Neue Sammlung",
  subtitle: "Kategorie",
  description: "Lorem ipsum dolor sit amet.",
  image: "/assets/images/bg-2.png",
  indexCards: demoIndexCards,
  lastLearnt: new Date().toJSON(),
};
