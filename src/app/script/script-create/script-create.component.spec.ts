import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptCreateComponent } from './script-create.component';

describe('ScriptCreateComponent', () => {
  let component: ScriptCreateComponent;
  let fixture: ComponentFixture<ScriptCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScriptCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
