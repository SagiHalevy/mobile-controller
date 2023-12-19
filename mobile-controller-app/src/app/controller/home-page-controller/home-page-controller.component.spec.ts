import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageControllerComponent } from './home-page-controller.component';

describe('HomePageControllerComponent', () => {
  let component: HomePageControllerComponent;
  let fixture: ComponentFixture<HomePageControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageControllerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePageControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
