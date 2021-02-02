import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import VocabCollection from "../../classes/VocabCollection";
import { UpdateVocabCollectionPayload, VocabCollectionState } from "../Types";

const randomBackgroundImage = (): string => {
  // Zufällige Zahl zwischen 0 und 3
  return `/assets/images/bg-${Math.floor(Math.random() * 4)}.png`;
};

const vocabCollectionsSlice = createSlice({
  name: "vocabCollections",
  initialState: {
    collections: [],
    selectedCollection: {
      title: "Keine Sammlung geladen!",
      subtitle: "",
      description: "",
      image: "",
      indexCards: [],
      lastLearnt: new Date().toJSON(),
    },
  } as VocabCollectionState,
  reducers: {
    createVocabCollection(
      state,
      action: PayloadAction<VocabCollection | null>
    ) {
      if (action.payload) {
        return {
          ...state,
          collections: [...state.collections, action.payload],
        };
      }

      return {
        ...state,
        collections: [
          ...state.collections,
          {
            title: "Neue Sammlung",
            subtitle: "",
            description: "",
            image: randomBackgroundImage(),
            indexCards: [],
            lastLearnt: new Date().toJSON(),
          },
        ],
      };
    },
    removeVocabCollection(state, action: PayloadAction<number>) {
      state.collections.splice(action.payload, 1);
    },
    updateVocabCollection(
      state,
      action: PayloadAction<UpdateVocabCollectionPayload>
    ) {
      state.collections[action.payload.id] = action.payload.data;
    },
    selectVocabCollection(state, action: PayloadAction<VocabCollection>) {
      state.selectedCollection = action.payload;
    },
    // ---
    setVocabCollectionState(
      _state,
      action: PayloadAction<VocabCollectionState>
    ) {
      return action.payload;
    },
  },
});

export const {
  createVocabCollection,
  removeVocabCollection,
  updateVocabCollection,
  selectVocabCollection,
  setVocabCollectionState,
} = vocabCollectionsSlice.actions;
export default vocabCollectionsSlice.reducer;
