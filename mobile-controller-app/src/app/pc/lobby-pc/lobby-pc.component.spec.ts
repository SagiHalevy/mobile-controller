import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyPcComponent } from './lobby-pc.component';

describe('LobbyPcComponent', () => {
  let component: LobbyPcComponent;
  let fixture: ComponentFixture<LobbyPcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LobbyPcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LobbyPcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
