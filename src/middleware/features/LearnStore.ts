import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IndexCard from "../../classes/IndexCard";
import LearnEntry from "../../classes/LearnEntry";
import { LearnState } from "../Types";

export const nextRepetition = (repetition: number): Date => {
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  if (repetition === 0) return today;
  if (repetition < 5) return addDays(today, 1);
  if (repetition === 5) return addDays(today, 7);
  if (repetition === 6) return addDays(today, 14);
  if (repetition === 7) return addDays(today, 30);
  if (repetition === 8) return addDays(today, 60);

  return today;
};

export const addDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days);
  return date;
};

const learnSlice = createSlice({
  name: "learn",
  initialState: {
    entries: [],
    stats: {
      progress: [],
    },
  } as LearnState,
  reducers: {
    addIndexCard(
      state,
      action: PayloadAction<{ indexCard: IndexCard; date: Date }>
    ) {
      let filtered = state.entries.filter((entry) => {
        return (
          entry.indexCard.content.word ===
            action.payload.indexCard.content.word &&
          JSON.stringify(entry.indexCard.content.meanings) ===
            JSON.stringify(action.payload.indexCard.content.meanings)
        );
      });

      if (filtered.length !== 0) {
        const entry = filtered[0];

        state.entries[state.entries.indexOf(entry)] = {
          indexCard: {
            ...entry.indexCard,
            repetition: 0,
          },
          nextRepetition: action.payload.date.toJSON(),
        };
      } else {
        state.entries.push({
          indexCard: action.payload.indexCard,
          nextRepetition: action.payload.date.toJSON(),
        });
      }
    },
    addProgressToday(state, action: PayloadAction<number>) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateString = today.toJSON();

      state.stats.progress.push({
        date: dateString,
        cardsLearnt: action.payload,
      });
    },
    // ---
    setLearnState(_state, action: PayloadAction<LearnState>) {
      return action.payload;
    },
    setEntries(state, action: PayloadAction<LearnEntry[]>) {
      state.entries = action.payload;
    },
  },
});

/**
 * Gibt alle Einträge für heute und allen vorherigen Tagen zurück
 * @param state aktuelle LearnState
 */
export const getEntriesToday = (state: LearnState) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return state.entries.filter(
    (entry) =>
      new Date(entry.nextRepetition).getTime() <= today.getTime() &&
      entry.indexCard.repetition !== 9
  );
};

/**
 * Liefert alle Einträge für einen bestimmten Tag
 * @param state aktuelle LearnState
 * @param dayOffset zum Beispiel +1 für morgen
 */
export const getEntries = (state: LearnState, dayOffset: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);

  return state.entries.filter(
    (entry) =>
      new Date(entry.nextRepetition).getTime() === date.getTime() &&
      entry.indexCard.repetition !== 9
  );
};

export const {
  addIndexCard,
  addProgressToday,
  setEntries,
  setLearnState,
} = learnSlice.actions;
export default learnSlice.reducer;
