import { TestLogger } from "./TestLogger";
import { TestReportRenderer } from "./TestReportRenderer";
import { TestResult, TestState } from "./TestState";

export class TestUIRenderer {
  static testWindow: HTMLElement;
  static testUi: HTMLElement;
  static content: HTMLElement;
  static testList: HTMLElement;
  static hidePassed = false;

  private static createWindowHtml() {
    if (document.querySelector(".test-window")) return;

    const styleTag = document.createElement("style");

    styleTag.appendChild(document.createTextNode(`
    :root {
      --test-success-accent: rgb(7, 136, 48);
      --test-fail-accent: rgb(199, 0, 0);
      --test-fail-bg: #ff00001c;
      --test-user-info: rgb(142, 193, 255);
    }
    .test-ui div,
    .test-ui p,
    .test-ui h1,
    .test-ui h2,
    .test-ui h3,
    .test-ui pre,
    .test-ui code,
    .test-ui details,
    .test-ui summary,
    .test-ui button {
      all: revert;
    }
    .test-window {
      position: fixed;
      top: 0;
      left: 0;
      width: 100dvw;
      height: 100dvh;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
      z-index: 2147483638;
      padding-right: 10px;
    }
    .test-ui {
      color: #ffffffda;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 0.8rem;
      background-color: #1e1e1e;
      padding: 10px 0;
      box-shadow: 3px 3px 12px #00000090;
      line-height: 1.3;
      box-sizing: border-box;
      width: clamp(500px, 40%, 50%);
      position: relative;
      font-family: system-ui;
      pointer-events: all;
    }
    .test-ui .test-content {
      display: flex;
      max-height: calc(100% - 70px);
      flex-grow: 1;
    }
    .test-window .test-preview {
      all: initial;
      padding: 10px;
      outline: 3px solid red;
      outline-offset: -3px;
      flex-grow: 1;
    }
    .test-ui button {
      border: none;
      outline: none;
      background-color: #06507d;
      color: #cbcbcb;
      border-radius: 4px;
      padding: 2px 4px;
      transition: background-color 0.25s, color 0.25s;
    }
    .test-ui button:hover {
      background-color: #0b8ad8;
      color: #fff;
    }
    .test-ui .test-list {
      overflow: auto;
      margin-top: -10px;
      background-color: #171717;
      flex-grow: 1;
      width: min(740px, 100%);
    }
    .test-ui {
      scrollbar-color: #848484 #0000;
    }
    .test-ui .test-list::-webkit-scrollbar {
      width: 8px;
    }
    .test-ui .test-list::-webkit-scrollbar-track {
      background: #57575700;
    }
    .test-ui .test-list::-webkit-scrollbar-thumb {
      background-color: #848484;
    }
    .test-ui .close {
      position: absolute;
      right: 0;
      top: 0;
      background-color: #222;
      border: none;
      width: 32px;
      height: 32px;
      color: #ccc;
      font-size: 1rem;
    }
    .test-ui .close:hover {
      background-color: var(--test-fail-accent);
      color: #fff;
    }
    .test-ui .testui-header {
      display: flex;
      justify-content: space-between;
    }
    .test-ui .testui-header h2 {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .test-ui .testui-toggle-passed-wrapper {
      display: flex;
      align-items: center;
      padding-right: 36px;
      font-weight: 700;
      font-size: 14px;
    }
    .test-ui h2 {
      margin: 0 0 2px;
      padding-left: 14px;
    }
    .test-ui .warning {
      padding-left: 16px;
      padding-right: 16px;
      color: #bb9e0cd7;
    }
    .test-ui .testlog {
      display: block;
      padding-left: 16px;
      padding-top: 2px;
      padding-bottom: 1px;
    }
    .test-ui .testlog.fail {
      background-color: var(--test-fail-bg);
      box-shadow: 0 -1px #ffffff30, 0 1px #ffffff30;
      padding-top: 4px;
      padding-bottom: 2px;
    }
    .test-ui .testlog .title {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .test-ui .testlog .title:hover {
      color: #fff;
    }
    .test-ui .testlog .test-meta {
      color: var(--test-user-info);
      padding-left: 22px;
      display: block;
      background-color: #0000;
      margin: 0;
    }
    .test-ui .testlog.fail .title {
      font-weight: 700;
    }
    .test-ui .testlog .title span {
      display: block;
    }
    .test-ui .success-indicator {
      font-weight: 700;
      width: 16px;
      height: 16px;
      margin-right: 5px;
      text-align: center;
      border-radius: 50%;
    }
    .test-ui .success-symbol {
      color: #fff;
      font-size: 16px;
      margin-top: -3px;
    }
    .test-ui.hide-passed .testlog.pass,
    .test-ui.hide-passed .suite-title.pass {
      display: none;
    }
    .test-ui .testlog.pass .success-symbol {
      margin-top: -2px;
    }
    .test-ui .fail .success-indicator {
      background-color: #bb1e1e;
    }
    .test-ui .pass .success-indicator {
      background-color: var(--test-success-accent);
    }
    .test-ui .pass .success-indicator.fail,
    .test-ui .fail .success-indicator.pass {
      display: none;
    }
    .test-ui .failed-checks-container {
      padding-top: 4px;
      display: flex;
      flex-direction: column;
    }
    .test-ui .failed-check {
      padding: 4px 0;
    }
    .test-ui .failed-check .user-info {
      color: var(--test-user-info);
    }
    .test-ui .testlog .stack {
      color: #ffde9bdc;
    }
    .test-ui .hidden {
      display: none;
    }
    .test-ui .suite-title {
      margin-bottom: 5px;
      margin-top: 12px;
      padding-left: 12.5px;
      display: flex;
      align-items: center;
    }
    .test-ui .suite-title h3 {
      font-weight: 700;
      font-size: 1rem;
      margin: 0;
    }
    .test-ui .suite-title .success-indicator {
      width: 24px;
      height: 24px;
    }
    .test-ui .suite-title .success-indicator .success-symbol {
      margin-top: 1.5px;
    }
    .test-ui .final-result {
      padding-left: 14px;
      font-weight: 700;
      display: flex;
      gap: 6px;
      padding-right: 8px;
    }
    .test-ui .final-result.fail {
      color: #ff4e4e;
    }
    .test-ui .final-result.success {
      color: #02d448;
    }
    .test-ui .spacer {
      flex-grow: 1;
    }
    `))


    this.testWindow = document.createElement("div");
    document.head.append(styleTag);
    this.testWindow.classList.add("test-window");
    this.testUi = document.createElement("div");
    this.testUi.classList.add("test-ui");
    this.testUi.classList.add(this.hidePassed ? "hide-passed" : "show-passed");
    this.testUi.innerHTML = `
        <div class="unset testui-header">
          <h2>Test that...</h2>
          <div class="unset testui-toggle-passed-wrapper">
            <input type="checkbox" id="test-toggle-passed" name="checkbox" ${
              this.hidePassed ? "checked" : ""
            } ">
            <label for="test-toggle-passed">hide passed</label>
          </div>
        </div>
        `;

    const togglePassed = this.testUi.querySelector(
      ".testui-toggle-passed-wrapper"
    ) as HTMLInputElement;

    togglePassed.checked = this.hidePassed;

    togglePassed.addEventListener("mouseup", () => {
      const ui = document.querySelector(".test-ui");
      this.hidePassed = !this.hidePassed;
      console.log(this.hidePassed);
      if (this.hidePassed) {
        ui?.classList.remove("show-passed");
        ui?.classList.add("hide-passed");
      } else {
        ui?.classList.remove("hide-passed");
        ui?.classList.add("show-passed");
      }
    });

    this.content = document.createElement("div");
    this.content.classList.add("test-content");

    const preview = document.createElement("div");
    preview.classList.add("test-preview");
    
    this.testList = document.createElement("div");
    this.testList.classList.add("test-list");
    this.testWindow.append(preview);
    this.content.append(this.testList);
    this.testUi.append(this.content);

    const closeButton = document.createElement("button");
    closeButton.title = "close (ESC)";
    closeButton.innerText = "✖";
    closeButton.classList.add("close");
    closeButton.onclick = () => {
      this.testWindow.remove();
    };
    this.testUi.append(closeButton);

    this.testWindow.append(this.testUi);
    document.body.append(this.testWindow);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.testWindow.remove();
      }
    });
  }

  public static prepareUI() {
    this.testList?.remove();
    this.testList = document.createElement("div");
    this.testList?.classList.add("test-list");
    this.content?.append(this.testList);
    this.testUi?.querySelector(".final-result")?.remove();
    this.createWindowHtml();
  }

  public static drawTestResult(result: TestResult) {
    const testlog = document.createElement("div");
    testlog.classList.add("testlog");

    const failed = result.checkResults.length > 0;

    testlog.classList.add(failed ? "fail" : "pass");

    testlog.innerHTML = `
    <div class="unset title">
      <span class="unset success-indicator"><div class="unset success-symbol">${
        failed ? "×" : "✓"
      }</div></span>
      <span class="unset title-names">${result.testName}</span>
    </div>`;

    const title: HTMLElement = testlog.querySelector(".title")!;

    title!.onclick = () => {
      navigator.clipboard.writeText(result.testName);
    };
    title!.title = `click to copy testname to clipboard`;

    if (result.meta != undefined) {
      const metaSpan = document.createElement("pre");
      metaSpan.innerText = TestLogger.parseMeta(result, 2);
      metaSpan.classList.add("test-meta");
      testlog.append(metaSpan);
    }

    const failedChecks = document.createElement("div");
    failedChecks.classList.add("failed-checks-container");
    testlog.append(failedChecks);

    for (const failedCheckResult of result.checkResults) {
      const failDiv = document.createElement("div");
      failDiv.classList.add("failed-check");
      failDiv.innerHTML = `
        <span class="unset message"><span class="unset user-info" title="additional info provided by the test creator">${
          failedCheckResult.userInfo ?? ""
        }</span> ${failedCheckResult.message}</span><br>
        <details class="unset stack">
        <summary class="unset">stack</summary>
        ${failedCheckResult.stack}
        </details>
        `;

      failedChecks.append(failDiv);
    }

    if (result.checkResults.length > 0) {
      const suiteTitle = this.testUi.querySelector(
        ".suite-title-" + this.makeSafeCssClassname(result.suiteName)
      );
      suiteTitle?.classList.remove("pass");
      suiteTitle?.classList.add("fail");
    }

    this.testList.append(testlog);
  }

  public static drawTestSuiteHeader(suiteName: string) {
    const div = document.createElement("div");
    div.innerHTML = `
    <span class="unset success-indicator pass">
      <div class="unset success-symbol">✓</div>
    </span>
    <span class="unset success-indicator fail">
      <div class="unset success-symbol">×</div>
    </span>
    <h3>${suiteName}</h3>
`;
    div.classList.add("suite-title-" + this.makeSafeCssClassname(suiteName));
    div.classList.add("suite-title");
    div.classList.add("pass");

    this.testList.append(div);
  }

  public static drawFinalResult(passed: number, failed: number) {
    const div = document.createElement("div");

    div.classList.add("final-result");
    div.classList.add(failed == 0 ? "success" : "fail");
    div.innerHTML = `
        <span class="unset prefix">Testrun completed</span>
        <span class="unset fail">${failed} Tests failed </span>
        <span class="unset pass">${passed} Tests passed</span>
        <div class="spacer"></div>
        <button class="unset">export report</button>`;

    div.querySelector("button")!.onclick = () => {
        var newWindow = window.open();
        const finalResult = TestState.getRunResult();
        const report = TestReportRenderer.renderReport(TestState.getFullResult(), finalResult.failed, finalResult.passed);
        newWindow!.document.write(report.innerHTML);
    };

    this.testUi.append(div);
  }

  static drawLog(message: string, level: "info" | "warning" | "error") {
    const div = document.createElement("span");

    div.classList.add(level);
    div.innerText = message;

    this.testUi?.append(div);
  }

  private static makeSafeCssClassname(name: string) {
    return name.replace(/[^a-z0-9]/g, function (s) {
      var c = s.charCodeAt(0);
      if (c == 32) return "-";
      if (c >= 65 && c <= 90) return "_" + s.toLowerCase();
      return "__" + ("000" + c.toString(16)).slice(-4);
    });
  }
}
