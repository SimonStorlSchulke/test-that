export type TestSuiteOperator = {
  identifier: "beforeEach" | "setup" | "afterEach" | "afterAll";
  fn: Function;
};

export function setup(fn: Function): TestSuiteOperator {
  return {
    identifier: "setup",
    fn: fn,
  };
}

export function beforeEach(fn: Function): TestSuiteOperator {
  return {
    identifier: "beforeEach",
    fn: fn,
  };
}

export function afterEach(fn: Function): TestSuiteOperator {
  return {
    identifier: "afterEach",
    fn: fn,
  };
}

export function afterAll(fn: Function): TestSuiteOperator {
  return {
    identifier: "afterAll",
    fn: fn,
  };
}
