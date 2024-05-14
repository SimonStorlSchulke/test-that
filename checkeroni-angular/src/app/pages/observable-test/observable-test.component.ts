import { AsyncPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

type UserPages = {
  data: Array<User>;
};

@Component({
  selector: 'app-observable-test',
  standalone: true,
  imports: [HttpClientModule, AsyncPipe],
  templateUrl: './observable-test.component.html',
  styleUrl: './observable-test.component.scss',
})
export class ObservableTestComponent implements OnInit {
  
  http = inject(HttpClient);

  users$: Observable<User[]> | null = null;
  userNumber$: Observable<number> | null = null;

  ngOnInit() {
    this.users$ = this.http
      .get<UserPages>('https://reqres.in/api/users')
      .pipe(map((userPages) => userPages.data));

    this.userNumber$ = this.users$.pipe(map((users) => users.length));
  }
}
