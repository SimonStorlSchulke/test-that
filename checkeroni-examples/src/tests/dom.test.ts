import { check } from '../../../checkeroni/src/Checks.ts';
import { test } from '../../../checkeroni/src/Test.ts';
import { TestSuite } from '../../../checkeroni/src/TestSuite.ts';

new TestSuite("App component",

  test.that("Basic Test", () => {
    check(1 + 1).equals(2);

    const d = new Map<string, number>([
      ["some key", 2],
      ["some 2key", 2],
    ]);

    check(d).mapHasKey("a");

    const oa = {
      valueA: "a value",
      valueB: 55,
    }

    check(oa).objectHasEntry("valueBs");

  })
)