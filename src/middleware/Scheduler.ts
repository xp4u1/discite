import DictionaryEntry from "../classes/DictionaryEntry";
import { LearnEntry } from "./database/DisciteDatabase";
import {
  defaultEase,
  defaultGraduatedInterval,
  defaultIntervalModifier,
  defaultLearnIntervals,
  defaultRelearningInterval,
  defaultRelearningModifier,
} from "./Defaults";
import { database, getSetting } from "./Storage";

/**
 * Fügt eine Karteikarte dem Langzeittrainer hinzu.
 * @param entry Inhalt der Karteikarte
 */
export const addCard = async (entry: DictionaryEntry, date: Date) => {
  database.learn.add({
    content: entry,
    date: date.getTime(),
    ease: defaultEase,
    graduated: false,
    lastInterval: 0,
    relearning: false,
    step: 0,
  });
};

export const calculate = async (
  entry: LearnEntry,
  button: number
): Promise<LearnEntry> => {
  if (entry.graduated) {
    return await calculateGraduated(entry, button);
  } else if (entry.relearning) {
    return await calculateRelearning(entry, button);
  } else {
    return await calculateLearning(entry, button);
  }
};

export const humanDifference = (date: number) => {
  const diff = Math.round((date - new Date().getTime()) / 1000 / 60);

  if (diff <= 0) return "Jetzt";
  if (diff < 1) return "< 1 min";
  if (diff < 60) return `${diff} min`;
  if (diff < 1440) return `${Math.round(diff / 60)}h`;

  // eine Nachkommastelle
  return `${(diff / 60 / 24).toFixed(1).replace(".", ",")} d`;
};

// Berechnungen

const calculateGraduated = async (entry: LearnEntry, button: number) => {
  const today = new Date();

  switch (button) {
    case 0:
      // „Nochmal“
      return {
        ...entry,
        ease: entry.ease - 0.2, // -20 %
        relearning: true,
        date:
          today.getTime() +
          60000 *
            (await getSetting("relearningInterval", defaultRelearningInterval)),
      };
    case 1:
      // „Schwer“
      // new interval = current interval * 1.2 * interval modifier
      const hardInterval =
        entry.lastInterval *
        1.2 *
        (await getSetting("intervalModifier", defaultIntervalModifier));

      return {
        ...entry,
        ease: entry.ease - 0.15, // -15 %
        lastInterval: hardInterval,
        date: today.getTime() + 60000 * hardInterval,
      };
    case 2:
      // „Gut“:
      // new interval = current interval * ease factor * interval modifier
      const goodInterval =
        entry.lastInterval *
        entry.ease *
        (await getSetting("intervalModifier", defaultIntervalModifier));

      return {
        ...entry,
        lastInterval: goodInterval,
        date: today.getTime() + 60000 * goodInterval,
      };
    case 3:
      // „Zu leicht“:
      // new interval = current interval * ease factor * interval modifier
      const easyInterval =
        entry.lastInterval *
        (entry.ease + 0.15) *
        (await getSetting("intervalModifier", defaultIntervalModifier));

      return {
        ...entry,
        ease: entry.ease + 0.15,
        lastInterval: easyInterval,
        date: today.getTime() + 60000 * easyInterval,
      };
  }

  throw new Error("Invalid button");
};

const calculateRelearning = async (entry: LearnEntry, button: number) => {
  const today = new Date();

  switch (button) {
    case 0:
      // „Nochmal“
      return {
        ...entry,
        date:
          today.getTime() +
          60000 *
            (await getSetting("relearningInterval", defaultRelearningInterval)),
      };
    case 1:
      // „Gut“
      const interval =
        entry.lastInterval *
        (await getSetting("relearninglModifier", defaultRelearningModifier)) *
        entry.ease *
        (await getSetting("intervalModifier", defaultIntervalModifier));

      return {
        ...entry,
        relearning: false,
        lastInterval: interval,
        date: today.getTime() + 60000 * interval,
      };
  }

  throw new Error("Invalid button");
};

/**
 * Berechnet den nächsten Intervall für die Lernphase.
 * @param step Aktuelle Stufe der Karteikarte
 * @returns Nächster Intervall in Minuten; wenn die Stufe der Karte zu hoch ist, `-1`
 */
const getLearnInterval = async (step: number) => {
  const intervals = ((await getSetting(
    "learnIntervals",
    defaultLearnIntervals
  )) as string)
    .split(" ")
    .map((interval) => Number.parseInt(interval));

  // Stufe muss mindestens 1 sein.
  // (0 bedeutet neu hinzugefügt und am selben Tag)
  return step <= intervals.length && step > 0 ? intervals[step - 1] : -1;
};

const calculateLearning = async (entry: LearnEntry, button: number) => {
  const today = new Date();

  // „Nochmal“
  if (button === 0)
    return {
      ...entry,
      date: today.getTime() + 300000, // in 5 min
    };

  //        „Gut“ = 1
  // „Zu einfach“ = 2
  const interval = await getLearnInterval(entry.step + button);

  if (interval === -1) {
    const graduatedInterval = await getSetting(
      "graduatedInterval",
      defaultGraduatedInterval
    );

    // Die Karte hat ihre Lernphase abgeschlossen.
    return {
      ...entry,
      graduated: true,
      lastInterval: graduatedInterval,
      // Intervall ist in Minuten, doch getTime() gibt
      // Millisekunden zurück.
      date: today.getTime() + graduatedInterval * 60000,
    };
  } else {
    return {
      ...entry,
      step: entry.step + 1,
      date: today.getTime() + interval * 60000,
    };
  }
};
