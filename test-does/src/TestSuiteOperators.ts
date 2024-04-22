export type SuiteOperator = {
  identifier: "beforeEach" | "setup" | "afterEach" | "afterAll";
  fn: Function;
};

export function setup(fn: Function): SuiteOperator {
  return {
    identifier: "setup",
    fn: fn,
  };
}

export function beforeEach(fn: Function): SuiteOperator {
  return {
    identifier: "beforeEach",
    fn: fn,
  };
}

export function afterEach(fn: Function): SuiteOperator {
  return {
    identifier: "afterEach",
    fn: fn,
  };
}

export function afterAll(fn: Function): SuiteOperator {
  return {
    identifier: "afterAll",
    fn: fn,
  };
}
