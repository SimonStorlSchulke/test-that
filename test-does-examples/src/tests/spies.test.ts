import { Mock, mock } from '../../../test-does/src/index.ts';
import { check } from '../../../test-does/src/Checks.ts';
import { test } from '../../../test-does/src/Test.ts';
import { TestSuite } from '../../../test-does/src/TestSuite.ts';
import { beforeEach } from '../../../test-does/src/TestSuiteOperators.ts';

function spiedFunction(a: number, b: number) {
    return a + b;
}

function add(a: number, b: number) {
    return spiedFunction(a, b);
}

const originalImplementaion = spiedFunction;

new TestSuite(
    "Spies",
    beforeEach(() => {
        // currently, manually "unmocking" functions is not so straight forward...
        (spiedFunction as Mock) = mock.implementation(originalImplementaion);
    }),
    
    test.that("Spying on function while keeping the implementation", () => {
        (spiedFunction as Mock) = mock.spyOnly(spiedFunction);

        spiedFunction(1,2);
        
        check(spiedFunction).called();
        check(spiedFunction).withInfo("intentional fail").calledTimes(2);
        
        spiedFunction(4,4);
        
        check(spiedFunction).calledWith([4,4]);
    }),
)

