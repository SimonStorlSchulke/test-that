import {
  TestFixture,
  testFixture,
} from '../../../checkeroni-ng/FixtureExtensions';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { TestSuite, check, setup, test } from 'checkeroni';
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
  
  test.that('navigates to documentation', () => {
    check(
      fixture.debugElement.query(By.css('.documentation')).nativeElement.href
    ).stringIncludes('/documentation');
  })
);
