import { nextRepetition, addDays } from "./LearnStore";

test("returns correct hour format in nextRepetition", () => {
  const repetition = nextRepetition(0);

  expect(repetition.getHours()).toBe(0);
  expect(repetition.getMinutes()).toBe(0);
  expect(repetition.getSeconds()).toBe(0);
});

test("returns correct day offset", () => {
  const offset = Math.floor(Math.random() * 60);
  const today = new Date();
  const date = addDays(new Date(), offset);

  expect((date.getTime() - today.getTime()) / (1000 * 3600 * 24)).toBe(offset);
});
