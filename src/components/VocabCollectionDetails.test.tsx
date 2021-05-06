import * as React from "react";
import { render } from "@testing-library/react";

import { demoVocabCollection } from "../test/demo";
import VocabCollectionDetails, { chunk } from "./VocabCollectionDetails";

test("renders without crashing", () => {
  const { baseElement } = render(
    <VocabCollectionDetails vocabCollection={demoVocabCollection} />
  );
  expect(baseElement).toBeDefined();
});

test("renders all important informations", () => {
  const { getByText } = render(
    <VocabCollectionDetails vocabCollection={demoVocabCollection} />
  );

  expect(getByText(demoVocabCollection.title)).toBeDefined();
  expect(
    getByText(demoVocabCollection.indexCards.length.toString())
  ).toBeDefined();

  demoVocabCollection.indexCards.forEach((indexCard) => {
    expect(getByText(indexCard.word)).toBeDefined();
  });
});

test("chunk function works", () => {
  const array = [0, 0, 0, 0, 0];

  expect(chunk(array, 3).length).toBe(2);
  expect(chunk(array, 2).length).toBe(3);
  expect(chunk(array, 1).length).toBe(5);
});
