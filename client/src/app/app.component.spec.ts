import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let consoleSpy: jasmine.Spy;

  beforeEach(async () => {
    // Spy on console.log to avoid polluting test output and to verify logs
    consoleSpy = spyOn(console, 'log');

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // To handle any unknown elements in the template
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'sap-leanix-todo-client'`, () => {
    expect(component.title).toEqual('sap-leanix-todo-client');
  });

  it('should initialize with logging', () => {
    // Trigger ngOnInit
    fixture.detectChanges();

    // Verify first console.log call
    expect(consoleSpy.calls.argsFor(0)[0]).toBe('app works');

    // Verify second console.log call
    expect(consoleSpy.calls.argsFor(1)[0]).toBe('Application Routes:');
    expect(consoleSpy.calls.count()).toBe(2);
  });

  it('should render app-root', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
