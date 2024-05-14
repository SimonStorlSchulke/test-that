export type mockCall = {
  args: any[];
};

export type Mock = (Function & { calls: mockCall[] }) | (object & { calls: mockCall[] }) | any;

export function arrayEquals(a: any[], b: any[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

function makeMock(rf: Mock) {
  if (rf.calls == undefined) rf.calls = [];
}

function addCall(rf: Mock, call: mockCall) {
  rf.calls.push(call);
}

function isKey<T extends object>(
  x: T,
  k: PropertyKey
): k is keyof T {
  return k in x;
}

export const mock = {
  returnValue(returnValue: any) {
    const rf: Mock = (...fnArgs: any[]) => {
      addCall(rf, { args: fnArgs });
      return returnValue;
    };
    makeMock(rf);
    return rf as Mock;
  },

  /** Use void if the mocked function returns nothing or if your tested object doesn't use about its returned value. */
  void() {
    const rf: Mock = (...fnArgs: any[]) => {
      addCall(rf, { args: fnArgs });
    };
    makeMock(rf);
    return rf as Mock;
  },


  value(value: any) {
    return value as Mock;
  },

  object<T>(value?: object, config?: {dummyFunctions: string[]}): T {
    const rf: Mock = {
      ...value,
    };

    for (const dummyName of config?.dummyFunctions ?? []) {
      rf[dummyName] = () => {}
    }

    return rf;
  },
/** cannot be used like the other mocks because reassigning constants is impossible.
 * The first value is the object you want to mock, the second one the imposter.
 * Only the fields you want to overwrite have to be provided */
  constantObject(original: object, value: object) {
    Object.keys(original as any).forEach((key) => {
      if (isKey(original, key)) {
        original[key] = value[key]
      }
    })
  },


  implementation(implementation: Function) {
    const rf: Mock = (...fnArgs: any[]) => {
      addCall(rf, { args: fnArgs });
      return implementation(...fnArgs);
    };
    makeMock(rf);
    return implementation;
  },

  implementationWithArgs(
    cases: { args: any[]; implementation: Function }[],
    defaultImplementation?: Function
  ): Mock {
    const rf: Mock = (...fnArgs: any[]) => {
      const foundCase = cases.find((_) => arrayEquals(_.args, fnArgs));

      addCall(rf, { args: fnArgs });

      if (foundCase) {
        return foundCase.implementation(...foundCase.args);
      }
      if(defaultImplementation) return defaultImplementation();
    };
    makeMock(rf);
    return rf;
  },

  /** Spy on calls of this function, but keep the original implementation */
  spyOnly(spiedFunction: Function) {
    const rf: Mock = (...fnArgs: any[]) => {
      addCall(rf, { args: fnArgs });
      return spiedFunction(...fnArgs);
    };
    makeMock(rf);
    return rf as Mock;
  },

  returnWithArgs(
    cases: { args: any[]; returnVal: any }[],
    defaultReturn?: any
  ): Mock {
    const rf: Mock = (...fnArgs: any[]) => {
      const foundCase = cases.find((_) => arrayEquals(_.args, fnArgs));

      addCall(rf, { args: fnArgs });

      if (foundCase) {
        return foundCase.returnVal;
      }
      return defaultReturn;
    };
    makeMock(rf);
    return rf as Mock;
  },
};
