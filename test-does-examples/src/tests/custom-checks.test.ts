import { check } from '../../../test-does/src/Checks.ts';
import { test } from '../../../test-does/src/Test.ts';
import { TestSuite } from '../../../test-does/src/TestSuite.ts';


new TestSuite("Custom Checks",
  test.does("Maxi is an adult", () => {
    const maxi = {
      name: "maxi",
      age: 18,
    }

    check(maxi).custom("is adult");
  }),
  
  test.does("Jody can drink wodka", () => {
    const jodi = {
      name: "jody",
      age: 18,
    }

    check(jodi).custom("can drink", "applejuice");
    check(jodi).custom("can drink", "wodka");
  })
)