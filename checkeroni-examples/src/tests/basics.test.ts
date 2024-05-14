import { check } from '../../../checkeroni/src/Checks.ts';
import { test } from '../../../checkeroni/src/Test.ts';
import { TestSuite } from '../../../checkeroni/src/TestSuite.ts';

new TestSuite("App component",

  test.that("Basic Test", () => {
    check(1).equals(2);

    const myMap = new Map<string, number>([
      ["some key", 2],
      ["some 2key", 2],
    ]);

    check(myMap).mapHasKey("a");

    const myObject = {
      valueA: "a value",
      valueB: 55,
    }

    check(myObject).objectHasEntry("valueBs");

  }),
)