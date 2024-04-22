import { check } from '../../../test-does/src/Checks.ts';
import { test } from '../../../test-does/src/Test.ts';
import { TestSuite } from '../../../test-does/src/TestSuite.ts';

new TestSuite("App component",

  test.does("Basic Test", () => {
    check(1).equals(1);

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