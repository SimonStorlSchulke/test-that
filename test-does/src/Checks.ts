import { arrayEquals, mockCall } from "./Mock";
import { TestLogger } from "./TestLogger";
import { TestState } from "./TestState";

// TODO add convenient way to define custom checks

class Check {
  toCheck?: any;
  config: {
    info?: string;
    invert: boolean;
  } = {
    invert: false,
  };

  constructor(toAssert?: any) {
    this.toCheck = toAssert;
  }

  withInfo(info: string) {
    this.config.info = info;
    return this;
  }

  public get not(): Check {
    this.config.invert = true;
    return this;
  }

  equals(expected: any) {
    const failed = (this.toCheck !== expected) !== this.config.invert;

    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${
          this.toCheck
        }: ${typeof this.toCheck}' to equal '${expected}: ${typeof expected}'`,
      });
    }
  }

  equalsObject(expected: object) {
    const obJsonToCheck = JSON.stringify(this.toCheck);
    const obJsonExpected = JSON.stringify(expected);
    const failed = (obJsonToCheck !== obJsonExpected) !== this.config.invert;

    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${
          this.toCheck
        }: ${typeof this.toCheck}' to equal '${expected}: ${typeof expected}'`,
      });
    }
  }

  equalsShallow(expected: any) {
    const failed = (this.toCheck != expected) !== this.config.invert;

    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}: ${typeof this.toCheck}' to "equal" the value '${expected}: ${typeof expected}'`,
      });
    }
  }

  notEqualsShallow(expected: any) {
    const failed = (this.toCheck == expected) !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}: ${typeof this.toCheck}' to "equal" the value of '${expected}: ${typeof expected}'`,
      });
    }
  }

  fail() {
    TestState.addFailedCheck({
      userInfo: this.config.info,
      message: `${this.preamble()} fail assertion to not have been reached`,
    });
  }

  greater(expected: number) {
    const failed = !(this.toCheck > expected) !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}' to be greater than '${expected}'`,
      });
    }
  }

  smaller(expected: number) {
    const failed = !(this.toCheck < expected) !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}' to be smaller than '${expected}'`,
      });
    }
  }

  between(expectedMinimum: number, expectedMaximum: number) {
    const failed =
      (this.toCheck < expectedMinimum || this.toCheck > expectedMaximum) !==
      this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}' to be within '${expectedMinimum}' and '${expectedMaximum}'`,
      });
    }
  }

  includes(expectedValue: any) {
    const failed = !this.toCheck.includes(expectedValue) !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '[${this.toCheck}]' to include '${expectedValue}: ${typeof expectedValue}'`,
      });
    }
  }

  stringIncludes(expectedPart: string) {
    const failed = !this.toCheck.includes(expectedPart) !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}' to include '${expectedPart}'`,
      });
    }
  }

  stringStartsWith(expectedStart: string) {
    const failed = !this.toCheck.startsWith(expectedStart) !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${!this.toCheck}' to start with '${expectedStart}'`,
      });
    }
  }

  stringEndsWith(expectedEnd: string) {
    const failed = !this.toCheck.endsWith(expectedEnd) !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}' to end with '${expectedEnd}'`,
      });
    }
  }

  stringMatches(regex: RegExp) {
    const failed = !regex.test(this.toCheck) !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}' to match regex '${regex}'`,
      });
    }
  }

  truthy() {
    const failed = !this.toCheck !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}: ${typeof this.toCheck}' to be truthy`,
      });
    }
  }

  falsy() {
    const failed = this.toCheck !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '${this.toCheck}: ${typeof this.toCheck}' to be falsy`,
      });
    }
  }

  objectHasEntry(entryName: string) {
    const failed = !this.toCheck[entryName];
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} '\n${JSON.stringify(this.toCheck, null, 2)}\n' to have entry with key '${entryName}'`,
      });
    }
  }


  mapHasKey(key: any) {
    const hasKey = (this.toCheck as Map<any, any>).has(key);
    const failed = !hasKey;
    if (failed) {

      const keys = Array.from((this.toCheck as Map<any, any>).keys()).join(", ")

      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} keys of map '[${keys}]' to include '${key}'`,
      });
    }
  }


  hasCssClass(className: string) {

    if(!this.toCheck) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `Tried to check classList of element, but the Element is null'`,
      });
      return;
    }
    
    const failed = !(this.toCheck as HTMLAreaElement).classList.contains(className) !== this.config.invert;
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} elements ClassList to contain ${className}, but the actual classList was '${this.toCheck.classList}'`,
      });
    }
  }

  calledTimes(times: number) {
    if (!this.toCheckIsMock()) return;
    
    const failed = (this.toCheck.calls.length !== times) !== this.config.invert;

    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} mock to have been called ${times} times, but was actually called ${this.toCheck.calls.length} times`,
      });
    }
  }

  called() {
    if (!this.toCheckIsMock()) return;
    
    const failed = (!this.toCheck.calls || this.toCheck.calls.length == 0) !== this.config.invert;
    
    if (failed) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} mock to have been called`,
      });
    }
  }

  calledWithArgs(args: any[]) {
    
    if (!this.toCheckIsMock()) {
      return;
    }

    if (!this.toCheck.calls) {
      const failed = true !== this.config.invert;
      if(failed) {
        TestState.addFailedCheck({
          userInfo: this.config.info,
          message: `${this.preamble()} mock to have been called with '${args}', but it was never called`,
        });
        return;
      }
    }

    const foundCall = this.toCheck.calls.find((_: mockCall) =>
      arrayEquals(_.args, args)
    );

    if ((!foundCall) !== this.config.invert ) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `${this.preamble()} mock to have been called with [${args}]. Actual calls were: ${TestLogger.mockCallsToString(
          this.toCheck.calls
        )}`,
      });
    }
  }

  private preamble(): string {
    return this.config.invert ? "Didn't expect" : "Expected"
  }

  private toCheckIsMock(): boolean {
    if (this.toCheck.calls == null) {
      TestState.addFailedCheck({
        userInfo: this.config.info,
        message: `the provided object is not a mock. Use e.g. '(functionToMock as Mock) = mock.spyOnly(functionToMock)' to mock it`,
      });
      return false;
    }
    return true;
  }
}

export function check(toCheck: any = null) {
  return new Check(toCheck);
}
