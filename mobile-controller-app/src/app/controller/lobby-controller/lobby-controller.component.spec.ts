import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyControllerComponent } from './lobby-controller.component';

describe('LobbyControllerComponent', () => {
  let component: LobbyControllerComponent;
  let fixture: ComponentFixture<LobbyControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LobbyControllerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LobbyControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
