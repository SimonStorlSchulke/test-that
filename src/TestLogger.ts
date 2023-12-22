import { mockCall } from "./Mock";
import { TestResult, TestState } from "./TestState";
import { TestUIRenderer } from "./TestUIRenderer";

export type TestResultLog = {
  suiteName: string;
  testName: string;
  success: boolean;
  message: string;
  stack?: string;
};

const coloredLog = {
  red: (log: string) => console.log("\u001b[1;31m" + log),
  green: (log: string) => console.log("\u001b[1;32m" + log),
  yellow: (log: string) => console.log("\u001b[33m" + log),
  white: (log: string) => console.log("\u001b[1m" + log),
  cyan: (log: string) => console.log("\u001b[36m" + log),
};

export class TestLogger {
  static renderHtml: boolean = true;
  static testUi: HTMLElement;
  static testsList: HTMLElement;

  static init() {
    if (TestLogger.renderHtml) TestUIRenderer.prepareUI();
  }

  static reset() {
    TestLogger.init();
  }

  static log(message: string, level: "info" | "warning" | "error") {
    coloredLog.yellow(message);
    if (TestLogger.renderHtml) TestUIRenderer.drawLog(message, level);

  }

  public static mockCallsToString(mockCalls: mockCall[]) {
    let text = "";
    for (const call of mockCalls) {
      text += "[" + call.args + "] ";
    }
    return text;
  }

  static logTestResult(result: TestResult | null) {
    if (!result) return;

    result.passed
      ? coloredLog.green(`   PASS: ${result.testName}`)
      : coloredLog.red(`   FAIL: ${result.testName}`);

    if (result.meta != undefined) {
      coloredLog.cyan(`      ${this.parseMeta(result, 0)}`);
    }

    if (!result.passed) {
      for (const failedCheck of result.checkResults) {
        coloredLog.red(`      Failed Check: '${failedCheck.message}'`);
        if ((failedCheck?.userInfo?.length ?? 0) > 0)
          console.log("         UserInfo: " + failedCheck.userInfo);
      }
    }

    if (TestLogger.renderHtml) TestUIRenderer.drawTestResult(result);
  }

  public static logSuiteStart(suiteName: string) {
    coloredLog.white("\n" + suiteName);
    if (TestLogger.renderHtml) TestUIRenderer.drawTestSuiteHeader(suiteName);
  }

  public static logFinalResult() {
    const result = TestState.getRunResult();

    if (TestLogger.renderHtml)
      TestUIRenderer.drawFinalResult(result.passed, result.failed);

    const message = `\nTestrun completed: ${result.failed} failed, ${result.passed} succeeded`;

    result.failed > 0 ? coloredLog.red(message) : coloredLog.green(message);
    console.log("full result", Object.fromEntries(TestState.getFullResult()));
  }

  public static parseMeta(result: TestResult, jsonIndented: number) {
    if (typeof result.meta == "object") {
      const implementsToString =
        result.meta.toString != Object.prototype.toString;
      if (implementsToString) {
        return result.meta.toString();
      }
    }

    return JSON.stringify(result.meta, null, jsonIndented);
  }
}
