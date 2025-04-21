import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PythonEditorComponent } from './python-editor.component';

describe('PythonEditorComponent', () => {
  let component: PythonEditorComponent;
  let fixture: ComponentFixture<PythonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PythonEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PythonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
