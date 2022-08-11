import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferanalysisboxComponent } from './bufferanalysisbox.component';

describe('BufferanalysisboxComponent', () => {
  let component: BufferanalysisboxComponent;
  let fixture: ComponentFixture<BufferanalysisboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BufferanalysisboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BufferanalysisboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
