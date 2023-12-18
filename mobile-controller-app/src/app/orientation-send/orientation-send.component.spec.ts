import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrientationSendComponent } from './orientation-send.component';

describe('OrientationSendComponent', () => {
  let component: OrientationSendComponent;
  let fixture: ComponentFixture<OrientationSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrientationSendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrientationSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
