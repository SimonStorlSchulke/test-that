import { TestRunner } from "../../test-does/src/TestRunner.ts";

import "./tests/basics.test.ts";
import "./tests/mocking-functions.test.ts";
import "./tests/mocking-objects.test.ts";
import "./tests/spies.test.ts";
import "./tests/custom-checks.test";

TestRunner.setup(() => {
});

TestRunner.runAll();
