import * as React from "react";
import { render } from "@testing-library/react";

import DictionaryEntryCard from "./DictionaryEntryCard";
import { demoIndexCards } from "../test/demo";

describe.each(demoIndexCards.map((indexCard) => indexCard.content))(
  "renders %p",
  (dictionaryEntry) => {
    test("renders without crashing", () => {
      const { baseElement } = render(
        <DictionaryEntryCard dictionaryEntry={dictionaryEntry} />
      );

      expect(baseElement).toBeDefined();
    });

    test("renders the word and description", () => {
      const { getByText } = render(
        <DictionaryEntryCard dictionaryEntry={dictionaryEntry} />
      );

      expect(getByText(dictionaryEntry.word)).toBeInTheDocument();
      expect(getByText(dictionaryEntry.description)).toBeInTheDocument();
      expect(
        getByText(dictionaryEntry.principal_forms.join(", "))
      ).toBeInTheDocument();
    });

    test("renders all meanings", () => {
      const { baseElement } = render(
        <DictionaryEntryCard dictionaryEntry={dictionaryEntry} />
      );

      expect(baseElement.querySelector(".meanings")!.childNodes.length).toBe(
        dictionaryEntry.meanings.length
      );
    });

    test("renders action buttons", () => {
      const { baseElement } = render(
        <DictionaryEntryCard dictionaryEntry={dictionaryEntry} actionButtons />
      );

      expect(baseElement.querySelectorAll(".buttonClear").length).toBe(2);
    });
  }
);
