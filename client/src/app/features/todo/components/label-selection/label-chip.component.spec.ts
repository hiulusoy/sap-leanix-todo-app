import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LabelChipComponent } from './label-chip.component';
import { LabelFacade } from '../../+state/label/label.facade';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LabelModel } from '../../models/label.model';

describe('LabelChipComponent', () => {
  let component: LabelChipComponent;
  let fixture: ComponentFixture<LabelChipComponent>;
  let labelFacadeMock: any;
  const mockLabels$ = new BehaviorSubject<LabelModel[]>([
    { id: 1, name: 'Priority' },
    { id: 2, name: 'Bug' },
    { id: 3, name: 'Feature' }
  ]);

  beforeEach(async () => {
    // Create mock for LabelFacade
    labelFacadeMock = {
      labels$: mockLabels$.asObservable(),
      loadLabels: jasmine.createSpy('loadLabels'),
      createLabel: jasmine.createSpy('createLabel')
    };

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        LabelChipComponent
      ],
      providers: [
        { provide: LabelFacade, useValue: labelFacadeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LabelChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load and display available labels on initialization', () => {
    // Check if loadLabels was called
    expect(labelFacadeMock.loadLabels).toHaveBeenCalled();

    // Check if labels were loaded from the BehaviorSubject
    expect(component.availableLabels.length).toBe(3);
    expect(component.availableLabels[0].name).toBe('Priority');
  });

  it('should add and remove labels from selected labels array', () => {
    // Initial state
    expect(component.selectedLabels.length).toBe(0);

    // Setup output event spy
    const outputSpy = jasmine.createSpy('selectedLabelsChange');
    component.selectedLabelsChange.subscribe(outputSpy);

    // Add a label
    component.addLabel('New Label');

    // Check that the label was added
    expect(component.selectedLabels.length).toBe(1);
    expect(component.selectedLabels[0]).toBe('New Label');
    expect(outputSpy).toHaveBeenCalledWith(['New Label']);
    expect(labelFacadeMock.createLabel).toHaveBeenCalledWith('New Label');

    // Remove the label
    component.removeLabel(0);

    // Check that the label was removed
    expect(component.selectedLabels.length).toBe(0);
    expect(outputSpy).toHaveBeenCalledWith([]);
  });

  it('should filter labels correctly based on input', () => {
    // Initial state - all labels available
    expect(component.getFilteredLabels().length).toBe(3);

    // Set filter value
    component.newLabelName = 'bug';

    // Check filtered labels
    const filteredLabels = component.getFilteredLabels();
    expect(filteredLabels.length).toBe(1);
    expect(filteredLabels[0].name).toBe('Bug');

    // Test case insensitivity
    component.newLabelName = 'FEATURE';
    expect(component.getFilteredLabels().length).toBe(1);
    expect(component.getFilteredLabels()[0].name).toBe('Feature');

    // Test partial matching
    component.newLabelName = 'ri';
    expect(component.getFilteredLabels().length).toBe(1);
    expect(component.getFilteredLabels()[0].name).toBe('Priority');

    // No matches
    component.newLabelName = 'xyz';
    expect(component.getFilteredLabels().length).toBe(0);
  });
});
