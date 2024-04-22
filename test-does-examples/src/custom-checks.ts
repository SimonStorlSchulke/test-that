import { registerCustomCheck } from "../../test-does/src/Checks";

type Person = {
  age: number;
  name: string;
};

export function addCustomChecks() {
  registerCustomCheck("is adult", (toCheck: Person) => {
    return {
      success: toCheck.age >= 18,
      failMessage: `Expected ${toCheck.name} to be old enough for drinking!`,
    };
  });

  registerCustomCheck(
    "can drink",
    (toCheck: Person, drink: "applejuice" | "wodka") => {
      return {
        success: drink == "applejuice" || toCheck.age >= 18,
        failMessage: `Expected ${toCheck.name} to be old enough for drinking ${drink}!`,
      };
    }
  );
}
