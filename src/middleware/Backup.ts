import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core";
import { FileOpener } from "@ionic-native/file-opener";
import { isPlatform } from "@ionic/react";

import VocabCollection from "../classes/VocabCollection";
import { database } from "./Storage";

const { Filesystem } = Plugins;

const loadFile = (fileType: string) => {
  return new Promise<File>((resolve, reject) => {
    const mouseEvent = document.createEvent("MouseEvents");
    const input = document.createElement("input");
    input.type = "file";

    // Im Android-Filepicker funktioniert der MIME-Type bei aus Android exportierten
    // Backups scheinbar nicht; man kann keine Datei mehr auswählen, wenn
    // input.accept definiert ist.
    if (!isPlatform("android")) input.accept = fileType;

    mouseEvent.initEvent("click");
    input.dispatchEvent(mouseEvent);

    input.addEventListener("change", () => {
      if (input.files) resolve(input.files[0]);
      else reject();
    });
  });
};

/**
 * Öffnet den Dialog zum Speichern einer Datei. Der Inhalt wird als
 * `string` an diese Funktion übergeben.
 * @param data Inhalt der Datei
 * @param fileName Vorgeschlagener Dateiname
 * @param fileType MIME-Type
 */
export const downloadFile = (
  data: string,
  fileName: string,
  fileType: string
) => {
  if (isPlatform("ios")) {
    Filesystem.writeFile({
      path: fileName,
      data: data,
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
    }).then((result) => {
      FileOpener.showOpenWithDialog(result.uri, fileType);
    });
  } else {
    const blob = new Blob([data], { type: fileType });
    const mouseEvent = document.createEvent("MouseEvents");
    const a = document.createElement("a");

    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(":");

    mouseEvent.initEvent("click");
    a.dispatchEvent(mouseEvent);
  }
};

/**
 * Speichert ein Backup der Datenbank in einer Datei im lokalen Speicher des Geräts.
 */
export const saveBackup = async () => {
  return new Promise<string>((resolve, reject) => {
    database
      .export()
      .then((exportedDatabase) => {
        const state = JSON.stringify(exportedDatabase);
        const fileName = `${
          new Date().toISOString().split("T")[0]
        }.discite.json`;

        if (isPlatform("capacitor")) {
          Filesystem.writeFile({
            path: fileName,
            data: state,
            directory: FilesystemDirectory.Documents,
            encoding: FilesystemEncoding.UTF8,
          })
            .then((result) => {
              if (isPlatform("ios")) {
                // Dialog zum speichern der Datei.
                FileOpener.showOpenWithDialog(result.uri, "application/json");
                resolve("Das Backup steht bereit.");
              } else {
                resolve(
                  `Das Backup wurde gespeichert: „${result.uri.replace(
                    "file://",
                    ""
                  )}“`
                );
              }
            })
            .catch((reason) => {
              reject(reason);
            });
        } else {
          downloadFile(state, fileName, "application/json");
          resolve("Das Backup steht zum Download bereit.");
        }
      })
      .catch((reason) => reject(reason));
  });
};

/**
 * Lädt ein Backup aus dem lokalen Speicher des Geräts und überschreibt
 * sämtliche gespeicherten Daten.
 */
export const loadBackup = async () => {
  return new Promise<void>((resolve, reject) => {
    loadFile("application/json")
      .then((file) => {
        // Dateien habe immer das Format „datum.discite.json“
        if (file.name.endsWith("discite.json")) {
          const reader = new FileReader();

          reader.readAsText(file, "UTF-8");
          reader.onload = (event) => {
            database.import(JSON.parse(event.target!.result as string));
            resolve();
          };
        } else {
          reject("Das ist kein Discite-Backup!");
        }
      })
      .catch(() => {
        reject("Es wurde kein Backup ausgewählt.");
      });
  });
};

/**
 * Lädt eine Sammlung aus dem lokalen Speicher des Geräts und fügt sie
 * den Vokabelsammlungen hinzu.
 */
export const loadVocabCollection = () => {
  return new Promise<void>((resolve, reject) => {
    loadFile("application/json")
      .then((file) => {
        // Dateien habe immer das Format „titel.vokabeln.json“
        if (file.name.endsWith("vokabeln.json")) {
          const reader = new FileReader();

          reader.readAsText(file, "UTF-8");
          reader.onload = (event) => {
            const result = event.target!.result as string;
            const collection = JSON.parse(result) as VocabCollection;

            if (
              collection.title === undefined ||
              collection.indexCards === undefined
            ) {
              reject(
                "Die Discite-Vokabelsammlung ist ungültig. Die Daten konnten nicht eingelesen werden!"
              );
            } else {
              database.collections.add(collection);
              resolve();
            }
          };
        } else {
          reject("Das ist keine Discite-Vokabelsammlung!");
        }
      })
      .catch(() => {
        reject("Es wurde keine Sammlung ausgewählt.");
      });
  });
};
