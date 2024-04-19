import {check} from '../../test-that/src/Checks.ts';
import {test} from '../../test-that/src/Test.ts';
import {TestSuiteRegister} from '../../test-that/src/TestSuiteRegister.ts';
import {TestSuite} from '../../test-that/src/TestSuite.ts';

new TestSuite("App component", 

  test.that("a Test test", ()=> {
    check(1).equals(1);
  })
)

TestSuiteRegister.runAll();

