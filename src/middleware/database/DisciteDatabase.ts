import Dexie from "dexie";

import DictionaryEntry from "../../classes/DictionaryEntry";
import VocabCollection from "../../classes/VocabCollection";

export interface LearnEntry {
  id?: number;
  content: DictionaryEntry;
  /**
   * Unix-Zeitstempel, wann der Eintrag erneut angesehen werden sollte.
   */
  date: number;
  ease: number;
  graduated: boolean;
  relearning: boolean;
  step: number;
  /**
   * Letzter Interval in Minuten.
   */
  lastInterval: number;
}

export interface StatsEntry {
  id?: number;
  /**
   * Unix-Zeitstempel, wann diese Wiederholung gemacht wurde.
   */
  date: number;
  graduated: boolean;
  relearning: boolean;
  lastInterval: number;
  button: number;
}

export class DisciteDatabase extends Dexie {
  collections: Dexie.Table<VocabCollection, number>;
  learn: Dexie.Table<LearnEntry, number>;
  stats: Dexie.Table<StatsEntry, number>;

  constructor() {
    super("DisciteDatabase");
    this.version(1).stores({
      // Hier werden nur Felder angegeben,
      // welche im Filter benutzt werden können.
      collections: "++id, title, subtitle, description, lastLearnt",
      learn: "++id, date, ease, graduated, relearning, step, lastInterval",
      stats: "++id, date, graduated, relearning, lastInterval, button",
    });

    this.collections = this.table("collections");
    this.learn = this.table("learn");
    this.stats = this.table("stats");
  }
}
