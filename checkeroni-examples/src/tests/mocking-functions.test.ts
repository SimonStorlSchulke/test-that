import { Mock, mock } from '../../../checkeroni/src/index.ts';
import { check } from '../../../checkeroni/src/Checks.ts';
import { test } from '../../../checkeroni/src/Test.ts';
import { TestSuite } from '../../../checkeroni/src/TestSuite.ts';
import { beforeEach } from '../../../checkeroni/src/TestSuiteOperators.ts';

function mockedFunction(a: number, b: number) {
    return a + b;
}

function add(a: number, b: number) {
    return mockedFunction(a, b);
}

new TestSuite(
    "My testsuite",
    beforeEach(() => {
        console.log("I run before each test");
    }),

    test.that("test mocking functions", () => {
        (mockedFunction as Mock) = mock.returnValue(12);

        check(add(31, 24)).equals(12);

        (mockedFunction as Mock) = mock.implementation(() => 4);

        check(add(1, 2)).withInfo("intentional fail").equals(3);

        (mockedFunction as Mock) = mock.returnWithArgs([
            { args: [6, 3], returnVal: 212 },
            { args: [1, 2], returnVal: 3 }
        ],
            12);

        check(add(6, 3)).equals(212);
        check(add(3, 3)).equals(12);

        (mockedFunction as Mock) = mock.implementationWithArgs([
            { args: [6, 3], implementation: (a: number, b: number) => 2 * a - b },
        ],
            () => 2);

    })
)

