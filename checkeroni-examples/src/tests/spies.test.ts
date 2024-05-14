import { Mock, mock } from '../../../checkeroni/src/index.ts';
import { check } from '../../../checkeroni/src/Checks.ts';
import { test } from '../../../checkeroni/src/Test.ts';
import { TestSuite } from '../../../checkeroni/src/TestSuite.ts';
import { beforeEach } from '../../../checkeroni/src/TestSuiteOperators.ts';

function spiedFunction(a: number, b: number) {
    return a + b;
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

