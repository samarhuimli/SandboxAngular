import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionResultComponent } from './execution-result.component';

describe('ExecutionResultComponent', () => {
  let component: ExecutionResultComponent;
  let fixture: ComponentFixture<ExecutionResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
