import { Test } from "./Test";
import { SuiteOperator } from "./TestSuiteOperators";
import { TestLogger } from "./TestLogger";
import { TestSuiteRegister } from "./TestSuiteRegister";
import { CurrentTestStatus, TestState } from "./TestState";


export class TestSuite {
  name: string;
  operators: (Test | SuiteOperator)[];

  result = {
    passed: 0,
    failed: 0,
  };

  constructor(name: string, ...operators: (Test | SuiteOperator)[]) {

    TestState.registerSuiteName(name);

    this.name = name;
    this.operators = operators ?? [];
    TestSuiteRegister.add(this);
  }

  private getTests(): Test[] {
    const exclusives = this.getExclusiveTests();
    if(exclusives.length > 0 || TestSuiteRegister.hasExclusiveTests) {
      return exclusives;
    }
    return this.operators.filter(op => op instanceof Test) as Test[];
  }

  private getExclusiveTests(): Test[] {
    return this.operators.filter(op => op instanceof Test && (op as Test).exclusive) as Test[];
  }

  async run(specificTests: string[] = []) {

    const tests = this.getTests().filter(test => {
      const matches = !test.skipped && (specificTests.length == 0 || specificTests.includes(test.name ?? ""));
      return matches;
    });

    if(tests.length == 0) return;

    CurrentTestStatus.suiteName = this.name;

    TestLogger.logSuiteStart(this.name);


    const beforeEarchs: SuiteOperator[] = [];
    const inits: SuiteOperator[] = [];
    const afterEachs: SuiteOperator[] = [];
    const afterAlls: SuiteOperator[] = [];

    for (const operator of this.operators) {
      if (operator instanceof Test) {
        continue;
      }
      else if ((operator as SuiteOperator).identifier != null) {
        switch (operator.identifier) {
          case "init":
            inits.push(operator as SuiteOperator);
            break;
          case "beforeEach":
            beforeEarchs.push(operator as SuiteOperator);
            break;
          case "afterEach":
            afterEachs.push(operator as SuiteOperator);
            break;
          case "afterAll":
            afterAlls.push(operator as SuiteOperator);
            break;
        }
      }
    }

    if (
      inits.length > 1 ||
      beforeEarchs.length > 1 ||
      afterEachs.length > 1 ||
      afterAlls.length > 1
    ) {
      console.log("Define only one SuiteOperator (init, beforeEach). Only the first one will run.");
      return;
    }

    await runOperator(inits[0]); // TODO catch exceptions in each block (also below) and catch nicely

    // TODO allow running tests in "parallel"
    for (const test of tests) {
      await runOperator(beforeEarchs[0]);
      await test.run();
      await afterEachs[0]?.fn();
    }

    await afterAlls[0]?.fn();
  }
}

async function runOperator(operator: SuiteOperator | null) {
  if (!operator) return;

  try {
    await operator.fn()
  } catch (err) {
    TestLogger.logError(`in TestSuiteOperator ${operator.identifier}`, err);
  }
}