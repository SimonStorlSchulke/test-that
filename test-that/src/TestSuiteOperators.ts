export type SuiteOperator = {
  identifier: "beforeEach" | "init" | "afterEach" | "afterAll";
  fn: Function;
};

export function init(fn: Function): SuiteOperator {
  return {
    identifier: "init",
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
