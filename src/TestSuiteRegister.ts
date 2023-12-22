import { TestLogger } from "./TestLogger";
import { TestState } from "./TestState";
import { TestSuite } from "./TestSuite";

export class TestSuiteRegister {
  private static suites: TestSuite[] = [];
  public static hasExclusiveTests = false;

  static add(suite: TestSuite) {
    this.suites.push(suite);
  }

  static reset() {
    TestState.resetRun();
    TestLogger.reset();
  }

  static async runAll() {
    TestSuiteRegister.reset();
    for (const suite of this.suites) {
      await suite.run();
    }
    TestLogger.logFinalResult();
  }

  static async runSpecificTests(tests: { suite: string; tests: string[] }[]) {
    TestSuiteRegister.reset();

    for (const testRun of tests) {
      const matchingSuite = this.suites.filter(
        (suite) => suite.name == testRun.suite
      );
      if (matchingSuite.length == 0) continue;

      await matchingSuite[0].run(testRun.tests);
    }
    TestLogger.logFinalResult();
  }

  static async runSpecificSuites(suiteNames: string[]) {
    TestSuiteRegister.reset();

    const foundSuites = this.suites.filter((_) => suiteNames.includes(_.name));

    if (foundSuites.length == 0)
      console.log("No suite with any of those names ws found", suiteNames);

    for (const suite of foundSuites) {
      await suite.run();
    }
    TestLogger.logFinalResult();
  }
}

(window as any).testrunner = {
  runAll: () => {
    TestSuiteRegister.runAll();
  },
  runSpecificTests: (tests: { suite: string; tests: string[] }[]) => {
    TestSuiteRegister.runSpecificTests(tests);
  },
  runSpecificSuites: (suiteName: string[]) => {
    TestSuiteRegister.runSpecificSuites(suiteName);
  },
};

let first_press = false;

function KeyPress(e: KeyboardEvent) {
  if(first_press) {
    if (e.key == "t") TestSuiteRegister.runAll();
  } else {
    first_press = true;
    window.setTimeout(function() { first_press = false; }, 250);
  }
}

document.onkeydown = KeyPress;
