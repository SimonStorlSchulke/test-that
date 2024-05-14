import { TestLogger } from "./TestLogger";
import { TestReportRenderer } from "./TestReportRenderer";
import { TestResult, TestState } from "./TestState";
import { testUiStyle } from "./TestUIStyle";

export class TestUIRenderer {
  static testWindow: HTMLElement;
  static testUi: HTMLElement;
  static content: HTMLElement;
  static testList: HTMLElement;
  static hidePassed = false;

  private static createWindowHtml() {
    if (document.querySelector(".test-window")) return;

    const styleTag = document.createElement("style");
    styleTag.appendChild(document.createTextNode(testUiStyle));
    document.head.append(styleTag);

    this.testWindow = document.createElement("div");
    this.testWindow.classList.add("test-window");
    this.testUi = document.createElement("div");
    this.testUi.classList.add("test-ui");
    this.testUi.classList.add(this.hidePassed ? "hide-passed" : "show-passed");
    this.testUi.innerHTML = `
        <div class="unset testui-header">
          <h2>Test does...</h2>
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
    this.clearPreview();
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
      const report = TestReportRenderer.renderReport(
        TestState.getFullResult(),
        finalResult.failed,
        finalResult.passed
      );
      newWindow!.document.write(report.innerHTML);
    };

    this.testUi.append(div);
  }

  static drawLog(message: string, level: "info" | "warning" | "error") {
    const div = document.createElement("span");

    div.classList.add("log");
    div.classList.add(level);
    div.innerText = message;

    this.testUi?.append(div);
  }

  static drawError(message: string, error: any, stack: string | undefined) {
    const div = document.createElement("span");

    div.classList.add("unset");
    div.classList.add("log");
    div.classList.add("error");

    div.innerHTML = `
    <span class=" unset test-error-message"><span>ERROR</span>${message}</span>
    <span class=" unset test-error-error">${error}</span>
    <details class="unset stack">
    <summary class="unset">stack</summary>
    ${stack}
    </details>
    `;

    this.testList.append(div);
  }

  public static appendPreviewHtml(element: HTMLElement) {
    const preview = document.querySelector(".test-preview");
    preview?.querySelector(".test-preview-message")?.remove();
    if (!preview) {
      console.error("could not find preview window with the css class test-preview on the document");
      return;
    }
    preview.append(element);
  }

  
  public static clearPreview() {
    const preview = document.querySelector(".test-preview");
    if (!preview) {
      console.error("could not find preview window with the css class test-preview on the document");
      return;
    }
    preview.innerHTML = '<span class="test-preview-message"> checkeroni preview - use <br> <em>TestUIRenderer.appendPreviewHtml(element)</em> <br> to preview any HTML Element</span>';
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

export async function peak(element: HTMLElement, forSeconds: number = 5, backgroundColor = "", customLabel = ""): Promise<void> {
  TestUIRenderer.appendPreviewHtml(element);
    
    const countdown = document.createElement("span");

    const label = customLabel || element.tagName;
        
    countdown.innerHTML = `previewing <span style="color: #22aaff;">${label}</span>`;
    countdown.style.cssText = "position: absolute; bottom: 0px; background: #000; padding: 3px 12px; color: #fff;"
    
    TestUIRenderer.appendPreviewHtml(countdown);
    
    const previewWindow = document.querySelector<HTMLElement>('.test-preview')!;
    if (backgroundColor != "") previewWindow.style.backgroundColor = backgroundColor;

    let countdownTimer = forSeconds;

    const timeOutIndex = window.setInterval(() => {
      countdownTimer -= 0.1;
      if(countdownTimer > 0) {

        const progress = countdownTimer / forSeconds;
        countdown.style.background = `linear-gradient(90deg, #004412 ${progress * 100}%, black ${progress * 100}%)`
        countdown.innerHTML = `previewing <span style="color: #22aaff;">${label}</span>: ${progress.toFixed(2)}s`;
      } else {
        TestUIRenderer.clearPreview();
        clearInterval(timeOutIndex);
      }
    }, 100);

    return new Promise((resolve) =>
      window.setTimeout(() => {
        resolve();
      }, forSeconds * 1000)
    );
  }
