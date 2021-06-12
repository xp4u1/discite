import Dexie from "dexie";

import DictionaryEntry from "../../classes/DictionaryEntry";
import VocabCollection from "../../classes/VocabCollection";

export interface ActivityEntry {
  /**
   * Unix-Zeitstempel des Tages.
   * Es gibt für jedes Datum nur einen Eintrag!
   */
  date: number;
  /**
   * Anzahl der wiederholten Karten an diesem Tag.
   */
  count: number;
}

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
  activity: Dexie.Table<ActivityEntry, number>;
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
    this.version(2).stores({
      activity: "&date, count",
    });

    this.activity = this.table("activity");
    this.collections = this.table("collections");
    this.learn = this.table("learn");
    this.stats = this.table("stats");
  }

  // Da das Packet zum Importieren und Exportieren von Dexie Datenbanken
  // scheinbar nicht mit TypeScript funktioniert, diese Lösung.
  // Code von https://dexie.org/docs/ExportImport/dexie-export-import
  public export() {
    return this.transaction("r", this.tables, () => {
      return Promise.all(
        this.tables.map((table) =>
          table.toArray().then((rows) => ({ table: table.name, rows: rows }))
        )
      );
    });
  }

  public import(data: any) {
    return this.transaction("rw", this.tables, () => {
      return Promise.all(
        data.map((t: any) =>
          this.table(t.table)
            .clear()
            .then(() => this.table(t.table).bulkAdd(t.rows))
        )
      );
    });
  }
}
