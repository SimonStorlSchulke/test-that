import { TestLogger } from "./TestLogger";

export type FailedCheckResult = {
  userInfo: string | undefined;
  stack?: string;
  message: string;
};

export type TestResult = {
  suiteName: string;
  testName: string;
  passed: boolean;
  meta?: any;
  checkResults: FailedCheckResult[];
};

export type SuiteResult = {
  testResults: Map<string, TestResult>;
};

export let CurrentTestStatus = {
  suiteName: "",
  testName: "",
  meta: null,
};

export class TestState {
  private static suiteResults: Map<string, SuiteResult> = new Map();

  private static existingTestNames: string[] = [];
  private static existingSuiteNames: string[] = [];

  static resetRun() {
    this.suiteResults = new Map();
  }

  static registerSuiteName(name: string) {
    if (this.existingSuiteNames.includes(name)) {
      TestLogger.log(
        `TestSuite with the name '${name}' already exists`,
        "warning"
      );
      return false;
    }
    this.existingSuiteNames.push(name);
    return true;
  }

  static registerTestName(name: string) {
    if (this.existingTestNames.includes(name)) {
      TestLogger.log(
        `Failed to register test '${name}' because another Test with the same name with the name  already exists. A random string will be added to it.`,
        "warning"
      );
      return false;
    }
    this.existingTestNames.push(name);
    return true;
  }

  static addFailedCheck(result: FailedCheckResult) {
    result.stack = new Error().stack;

    if (!this.suiteResults.has(CurrentTestStatus.suiteName))
      this.suiteResults.set(CurrentTestStatus.suiteName, {
        testResults: new Map(),
      });

    if (
      !this.suiteResults
        .get(CurrentTestStatus.suiteName)
        ?.testResults.has(CurrentTestStatus.testName)
    )
      this.suiteResults
        .get(CurrentTestStatus.suiteName)
        ?.testResults.set(CurrentTestStatus.testName, {
          suiteName: CurrentTestStatus.suiteName,
          testName: CurrentTestStatus.testName,
          passed: false,
          meta: CurrentTestStatus.meta,
          checkResults: [],
        });

    this.suiteResults
      .get(CurrentTestStatus.suiteName)
      ?.testResults.get(CurrentTestStatus.testName)
      ?.checkResults.push(result);
  }

  static addPassedTest() {
    if (!this.suiteResults.has(CurrentTestStatus.suiteName))
      this.suiteResults.set(CurrentTestStatus.suiteName, {
        testResults: new Map(),
      });

    if (
      !this.suiteResults
        .get(CurrentTestStatus.suiteName)
        ?.testResults.has(CurrentTestStatus.testName)
    )
      this.suiteResults
        .get(CurrentTestStatus.suiteName)
        ?.testResults.set(CurrentTestStatus.testName, {
          suiteName: CurrentTestStatus.suiteName,
          testName: CurrentTestStatus.testName,
          passed: true,
          meta: CurrentTestStatus.meta,
          checkResults: [],
        });
  }

  public static getTestResult(
    suiteName: string,
    testName: string
  ): TestResult | null {
    return this.suiteResults.get(suiteName)?.testResults.get(testName) || null;
  }

  public static getSuiteResult(
    suiteName: string
  ): { failed: number; passed: number } | null {
    const suite = this.suiteResults.get(suiteName);
    if (!suite) return null;

    let passed = 0;
    let failed = 0;

    for (const result of suite.testResults) {
      if (result[1].passed) passed++;
      else failed++;
    }

    return {
      failed: failed,
      passed: passed,
    };
  }

  public static getRunResult() {
    let passed = 0;
    let failed = 0;

    for (const suiteResult of this.suiteResults) {
      for (let result of suiteResult[1].testResults) {
        if (result[1].passed) passed++;
        else failed++;
      }
    }

    return {
      passed,
      failed,
    };
  }

  public static getFullResult() {
    return this.suiteResults;
  }
}
