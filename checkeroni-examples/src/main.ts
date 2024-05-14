import { TestRunner } from "../../checkeroni/src/TestRunner.ts";

import "./tests/basics.test.ts";
import "./tests/mocking-functions.test.ts";
import "./tests/mocking-objects.test.ts";
import "./tests/spies.test.ts";
import "./tests/custom-checks.test.ts";

TestRunner.setup(() => {
    //not required, but useful for setting up custom checks etc.
});

TestRunner.runAll();
