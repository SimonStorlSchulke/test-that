import { TestSuiteRegister } from 'test-does';

// check how having to import all files manually can be avoided
import './app/app.component.test';
import './app/layout/header/header.component.test';
import './app/layout/sidebar/sidebar.component.test';
import './app/pages/observable-test/observable-test.component.test'

import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
TestSuiteRegister.runAll();
