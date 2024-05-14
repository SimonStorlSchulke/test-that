import { TestLogger } from "./TestLogger";
import { TestState } from "./TestState";
import { TestSuite } from "./TestSuite";

export class TestRunner {
  private static suites: TestSuite[] = [];
  public static hasExclusiveTests = false;
  private static setupFunction = () => {}

  static add(suite: TestSuite) {
    this.suites.push(suite);
  }

  static reset() {
    TestState.resetRun();
    this.setupFunction();
    TestLogger.reset();
  }
  
  /** The function provided here will run before a testrun is started */
  public static setup(setupFunction: () => void) {
    this.setupFunction = setupFunction;
  }

  static async runAll() {
    TestRunner.reset();
    for (const suite of this.suites) {
      await suite.run();
    }
    TestLogger.logFinalResult();
  }

  static async runSpecificTests(tests: { suite: string; tests: string[] }[]) {
    TestRunner.reset();

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
    TestRunner.reset();

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
    TestRunner.runAll();
  },
  runSpecificTests: (tests: { suite: string; tests: string[] }[]) => {
    TestRunner.runSpecificTests(tests);
  },
  runSpecificSuites: (suiteName: string[]) => {
    TestRunner.runSpecificSuites(suiteName);
  },
};

let first_press = false;

function KeyPress(e: KeyboardEvent) {
  if(first_press) {
    if (e.key == "t") TestRunner.runAll();
  } else {
    first_press = true;
    window.setTimeout(function() { first_press = false; }, 250);
  }
}

document.onkeydown = KeyPress;
