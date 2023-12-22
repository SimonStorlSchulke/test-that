import { TestLogger } from "./TestLogger";
import { SuiteResult } from "./TestState";

export class TestReportRenderer {
  public static renderReport(
    suiteResults: Map<string, SuiteResult>,
    failed: number,
    succeeded: number
  ): HTMLElement {
    const report = document.createElement("div");
    report.classList.add("test-report");

    report.innerHTML = `
    <style>
    ul {
      margin: 0;
    }

    body {
      line-height: 1.25;
      font-size: 14px;
      font-family: system-ui;
    }
    h2 {
      margin-bottom: 4px;
    }
    h2 .success-indicator {
      display: inline-block;
      width: 17px;
    }
    pre {
      margin: 2px 0px;
      margin-left: 20px;
    }
    .success-indicator {
      display: inline-block;
      width: 17px;
    }
    .success-indicator {
      font-weight: bold;
    }
    .test {
      width: fit-content;
    }
    .test.fail {
      border-top: 1px solid #888;
      border-bottom: 1px solid #888;
      padding-bottom: 4px;
      padding-top: 4px;
    }
    .fail .test-title,
    .fail .success-indicator {
      font-weight: bold;
      color: red;
    }
    .info {
      display: block;
      margin-left: 20px;
    }
    .testrun-fail,
    .testrun-pass {
      display: block;
      margin-top: 12px;
      font-weight: bold;
      font-size: 16px;
    }
    .testrun-fail {
      color: red;
    }
    </style>
    <h1>Test That Report</h1>
    `;

    for (const suiteResult of suiteResults) {
      const suiteDom = document.createElement("section");
      suiteDom.classList.add("suite");
      suiteDom.innerHTML = `
      <h2 class="pass"><span class="success-indicator">✓</span>${suiteResult[0]}</h2>
      `;

      const testResultsDom = document.createElement("div");

      for (const testResult of suiteResult[1].testResults) {
        const testDom = document.createElement("div");
        testDom.classList.add("test");
        testDom.classList.add(testResult[1].passed ? "pass" : "fail");
        testDom.innerHTML = `
          <span class="success-indicator">${
            testResult[1].passed ? "✓" : "X"
          }</span>
          <span class="test-title">${testResult[0]}</span>
        `;

        if (testResult[1].meta != undefined) {
          const metaSpan = document.createElement("pre");
          const metaInfo = document.createElement("span");
          metaInfo.classList.add("info");
          metaInfo.innerHTML = "Meta Information:";
          metaSpan.innerText = TestLogger.parseMeta(testResult[1], 2);
          metaSpan.classList.add("test-meta");
          testDom.append(metaInfo, metaSpan);
        }

        if (!testResult[1].passed) {
          suiteDom.querySelector(
            "h2"
          )!.innerHTML = `<h2 class="fail"><span class="success-indicator">X</span>${suiteResult[0]}</h2>`;

          const checkInfo = document.createElement("span");
          checkInfo.classList.add("info");
          checkInfo.innerText = `Failed Checks:`;
          testDom.append(checkInfo);

          const checksUl = document.createElement("ul");
          for (const check of testResult[1].checkResults) {
            const checkLi = document.createElement("li");
            checkLi.innerHTML = `
            <span>${check.userInfo}</span> <span>${check.message}</span>
            `;
            checksUl.append(checkLi);
          }

          testDom.append(checksUl);
        }

        testResultsDom.append(testDom);
      }

      suiteDom.append(testResultsDom);
      report.append(suiteDom);
    }

    const finalResult = document.createElement("span");
    finalResult.innerHTML = `Testrun ${failed > 0 ? "failed!" : "succeeded!"} ${
      failed > 0
        ? failed + " tests failed, " + succeeded + " passed"
        : "all " + succeeded + " tests pased"
    }`;

    finalResult.classList.add(failed > 0 ? "testrun-fail" : "testrun-pass")

    report.append(finalResult);
    return report;
  }
}
