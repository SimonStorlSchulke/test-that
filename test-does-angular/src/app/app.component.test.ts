import { TestSuite, check, test } from 'test-does';

new TestSuite("App component", 

  test.does("app starts", ()=> {
    check(1).equals(1);
  })
)
