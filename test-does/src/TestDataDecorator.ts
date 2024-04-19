function cases(testCases: any[], fn: Function) {
    for (const testCase of testCases) {
        fn(testCase);
    }
}