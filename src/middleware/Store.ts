import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import vocabCollection from "./features/VocabCollectionStore";
import learn from "./features/LearnStore";

/**
 * **Reflux Store**
 *
 * Discite speichert alles bis auf die Benutzereinstellungen in diesem Store.
 * Über den Store können zum Beispiel die Sammlungen oder der Lernfortschritt
 * abgerufen und geändern werden.
 *
 * Der Store wird im lokalen Speicher des Geräts abgelegt. Wenn der Benutzer
 * die App deinstalliert und danach erneut installiert, sind alle Daten verloren.
 */
export const Store = configureStore({
  reducer: {
    vocabCollection: vocabCollection,
    learn: learn,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
  devTools: process.env.NODE_ENV !== "development" ? false : true,
});

export type RootState = ReturnType<typeof Store.getState>;
