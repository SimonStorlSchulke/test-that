import { TestSuite, check, test } from 'checkeroni';

new TestSuite("App component", 

  test.that("app starts", ()=> {
    check(1).equals(1);
  })
)
