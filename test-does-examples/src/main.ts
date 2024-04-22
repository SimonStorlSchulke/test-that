import {TestSuiteRegister} from '../../test-does/src/TestSuiteRegister.ts';

import "./tests/basics.test.ts";
import "./tests/mocking-functions.test.ts";
import "./tests/spies.test.ts";

TestSuiteRegister.runAll();

