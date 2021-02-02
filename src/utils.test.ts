import { shuffle } from "./utils";

test("shuffle function works", () => {
  const array = Array.from(Array(5).keys());
  expect(shuffle(array)).not.toBe(array);
});
