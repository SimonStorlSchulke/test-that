
import { ObservableTestComponent } from './observable-test.component';

import { Mock, TestSuite, check, setup, mock, test, peak } from 'test-does';
import { of } from 'rxjs';
import { TestFixture, testFixture } from '../../../test-does-ng/FixtureExtensions';

let fixture: TestFixture<ObservableTestComponent>;

new TestSuite(
  'Observables',

  setup(async () => {
    fixture = await testFixture(ObservableTestComponent);
  }),

  test.does('Users get fetched and displayed', async () => {

    (fixture.componentInstance.http.get as Mock) = mock.returnWithArgs([
      {args: ["https://reqres.in/api/users"], returnVal: of({
        data: [
          {
            id: 1,
            email: 'george.bluth@reqres.in',
            first_name: 'George',
            last_name: 'Bluth',
            avatar: 'https://reqres.in/img/faces/1-image.jpg',
          },
          {
            id: 2,
            email: 'janet.weaver@reqres.in',
            first_name: 'Janet',
            last_name: 'Weaver',
            avatar: 'https://reqres.in/img/faces/2-image.jpg',
          },
        ],
      })}
    ], null);

    fixture.componentInstance.ngOnInit();

    fixture.detectChanges();

    fixture.peak(2.13);

    const george = fixture.dom.queryTestId<HTMLElement>('user-name');
    const totalUsers = fixture.dom.queryTestId<HTMLElement>('total-users');

    check(fixture.componentInstance.http.get).calledWithArgs([
      'https://reqres.in/api/users',
    ]);

    check(george?.innerText).stringIncludes('George');
    check(totalUsers?.innerText).equals('Total users: 2');
  })
);
