import { check } from '../../../checkeroni/src/Checks.ts';
import { test } from '../../../checkeroni/src/Test.ts';
import { registerCustomCheck } from '../../../checkeroni/src/TestState.ts';
import { TestSuite } from '../../../checkeroni/src/TestSuite.ts';
import { setup } from '../../../checkeroni/src/TestSuiteOperators.ts';

type Person = {
  age: number;
  name: string;
};

new TestSuite("Custom Checks",
  setup(() => {
    registerCustomCheck("is adult", (toCheck: Person) => {
      return {
        success: toCheck.age >= 18,
        failMessage: `${toCheck.name} to be old enough for drinking!`,
      };
    });
  
    registerCustomCheck(
      "can drink",
      (toCheck: Person, drink: "applejuice" | "wodka") => {
        return {
          success: drink == "applejuice" || toCheck.age >= 18,
          failMessage: `${toCheck.name} to be old enough for drinking ${drink}!`,
        };
      }
    );
  }),

  test.that("Maxi is an adult", () => {
    const maxi = {
      name: "maxi",
      age: 18,
    }

    check(maxi).custom("is adult");
  }),
  
  test.that("Jody can drink wodka", () => {
    const jodi = {
      name: "jody",
      age: 18,
    }

    check(jodi).custom("can drink", "applejuice");
    check(jodi).not.custom("can drink", "wodka");
  })
)