import { TestLogger } from "./TestLogger";
import { TestRunState } from "./TestRunState";

export function testSet(name: string, testSetContent: () => void) {
    
    // add to register
    // set current test suite globally
    TestRunState.currentTest = name;

    //TestSuiteRegister.add()
    try {
        testSetContent();
    } catch (ex) {
        TestLogger.logError(`Error while running TestSuite '${name}'`, ex)
    }
}