import { DebugElement, Type } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  TestModuleMetadata,
} from '@angular/core/testing';
import { TestUIRenderer, peak } from 'test-does';

export class TestFixture<T> {
  constructor(private _componentFixture: ComponentFixture<T>) {}

  detectChanges() {
    this._componentFixture.detectChanges();
  }

  /** in case TestThatFixture does not expose a needed member of ComponentFixture, use this to access the underlying ComponentFixture directly */
  public get componentFixture(): ComponentFixture<T> {
    return this._componentFixture;
  }

  public get componentInstance(): T { //TODO - check wether or not supporting other types besides HTMLElement makes sense here
    return this._componentFixture.componentInstance;
  }

  public get debugElement(): DebugElement {
    return this._componentFixture.debugElement;
  }

  public dom = {
    element: <T extends Element>() => {
      return this._componentFixture.nativeElement as T},
    queryTestId: <T extends Element>(testId: string) => {
      return (this._componentFixture.nativeElement as HTMLElement).querySelector<T>(
        `[testId='${testId}'`
      );
    },
    /** shortcut for testThatFixture.htmlElement.querySelector() */
    query: <T extends Element>(query: string) => {
      return (this._componentFixture.nativeElement as HTMLElement).querySelector<T>(query);
    },
  };

  public async peak(forSeconds: number = 2, backgroundColor: string = '') {
    const componentName = ((this.componentInstance as any).constructor.name as string).substring(1);
    await peak(this._componentFixture.nativeElement, forSeconds, backgroundColor, componentName);
  }
}

export async function testFixture<T>(
  component: Type<T>,
  moduleDef?: TestModuleMetadata)
  : Promise<TestFixture<T>> {

  TestBed.resetTestingModule();
  await TestBed.configureTestingModule(moduleDef ?? {});
  const fixture = new TestFixture(TestBed.createComponent(component));
  fixture.detectChanges();
  return fixture;
}

