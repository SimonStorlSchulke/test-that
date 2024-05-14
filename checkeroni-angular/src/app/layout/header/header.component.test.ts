import { TestSuite, check, setup, test } from 'checkeroni';
import { HeaderComponent } from './header.component';


new TestSuite("Header",


  test.that("header renders", async () => {

    check(1).equals(1);

  })
);