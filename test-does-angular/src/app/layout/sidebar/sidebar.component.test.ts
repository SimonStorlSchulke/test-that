import {
  TestFixture,
  testFixture,
} from '../../../test-does-ng/FixtureExtensions';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { TestSuite, check, setup, test } from 'test-does';
import { By } from '@angular/platform-browser';

let fixture: TestFixture<SidebarComponent>;

new TestSuite(
  'SidebarComponent',

  setup(async () => {
    fixture = await testFixture(SidebarComponent, {
      imports: [RouterTestingModule]
    });
    await fixture.peak();
  }),
  
  test.does('navigates to documentation', () => {
    check(
      fixture.debugElement.query(By.css('.documentation')).nativeElement.href
    ).stringIncludes('/documentation');
  })
);
