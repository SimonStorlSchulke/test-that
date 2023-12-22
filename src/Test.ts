import { TestLogger } from "./TestLogger";
import { CurrentTestStatus, TestState } from "./TestState";
import { TestSuiteRegister } from "./TestSuiteRegister";

type testConfig = {
  cases?: any[];
  runAsync?: boolean;
  meta?: any;
};

/** provides functions to invoke a test
 * @example test.that("testname", ()=>{ check(1).equals(1) })
 */
export const test = {
  /** invokes the test with the given name and function
   * @example test.that("testname", ()=>{ check(1).equals(1) })
   */
  that: (name: string, testFunction: Function) =>
    new Test().that(name, testFunction),

  /** adds testcases (array of anything) to the test.
   * The test will run once for each given item. Access the current item by passing it to the function.
   * @example test.withCases([1,2,3]).that("checks number", (currentNumber) => { check(currentNumber).smaller(1)})*/
  withCases: (cases: any[]) => new Test().withCases(cases),

  /** the test will only run, if the provided condition is true
   * @example test.when(myCondition).that("checks number", (currentNumber) => { //testcode })
   */
  when: (condition: boolean) => new Test().when(condition),

  /** Add any meta information to the test, that will be logged alongside running it.
   * If the value is an object and overrides toString, toString will be used. Otherwise JSON.stringify.
   * @example test.withMeta({storyNumber: 3142}).that("popup opens", ...*/
  withMeta: (meta: any) => new Test().withMeta(meta),
};

/** exclusive test - if any test is marked as xtest, only xtests will run. */
export const xtest = {
  /** invokes the exclusive test with the given name and function*/
  that: (name: string, testFunction: Function) =>
    new Test().setExclusive().that(name, testFunction),

  /** adds testcases (array of anything) to the exclusive test.
   * The test will run once for each given item. Access the current item by passing it to the function i.e.
   * test.withCases([1,2,3]).that("checks number", (currentNumber) => {...})*/
  withCases: (cases: any[]) => new Test().setExclusive().withCases(cases),

  /** the exclusice test will only run, if the provided condition is true */
  when: (condition: boolean) => new Test().setExclusive().when(condition),

  /** Add any meta information to the exclusive test, that will be logged alongside running it.
   * If the value is an object and overrides toString, toString will be used. Otherwise JSON.stringify.
   * @example test.withMeta({storyNumber: 3142}).that("popup opens", ...*/
  withMeta: (meta: any) => new Test().withMeta(meta),
};

export class Test {
  private fn?: Function;
  private testConfig: testConfig = {};
  public name?: string;
  public skipped = false;
  public exclusive = false;

  /** adds testcases (array of anything) to the test.
   * The test will run once for each given item. Access the current item by passing it to the function.
   * @example test.withCases([1,2,3]).that("checks number", (currentNumber) => { check(currentNumber).smaller(1)})*/
  public withCases(cases: any[]) {
    this.testConfig.cases = cases;
    return this;
  }

  /** Add any meta information to the test, that will be logged alongside running it.
   * If the value is an object and overrides toString, toString will be used. Otherwise JSON.stringify.
   * @example test.withMeta({storyNumber: 3142}).that("popup opens", ...*/
  public withMeta(meta: any) {
    this.testConfig.meta = meta;
    return this;
  }

  /** the test will only run, if the provided condition is true
   * @example test.when(myCondition).that("checks number", (currentNumber) => { //testcode })
   */
  public when(condition: boolean): Test {
    if (!condition) this.skipped = true;
    return this;
  }

  setExclusive() {
    TestSuiteRegister.hasExclusiveTests = true;
    this.exclusive = true;
    return this;
  }

  /** invokes the test with the given name and function
   * @example test.that("testname", ()=>{ check(1).equals(1) })
   */
  that(name: string, testFunction: Function) {
    if (!TestState.registerTestName(name)) {
      // add guid if testname already exists - will also warn the user
      name = name + crypto.randomUUID().substring(0, 10);
    }

    this.name = name;
    this.fn = testFunction;
    return this;
  }

  public async run() {
    CurrentTestStatus.testName = this.name ?? "unnamed test";
    CurrentTestStatus.meta = this.testConfig.meta;

    if (this.testConfig.cases) {
      for (const testCase of this.testConfig.cases) {
        await this.tryRunTestFn(testCase);
      }
    } else {
      await this.tryRunTestFn();
    }

    const failedResult = TestState.getTestResult(
      CurrentTestStatus.suiteName,
      this.name ?? ""
    );

    if (!failedResult) TestState.addPassedTest();

    TestLogger.logTestResult(
      TestState.getTestResult(CurrentTestStatus.suiteName, this.name ?? "")
    );
  }

  private async tryRunTestFn(testCase: any = null): Promise<void> {
    try {
      await this.fn!(testCase);
      return;
    } catch (ex) {
      console.error(`Test '${this.name}' threw exception:`, ex);
      TestState.addFailedCheck({
        userInfo: "",
        message: `Test threw Exception, see the console for details'`,
      });
    }
  }
}
