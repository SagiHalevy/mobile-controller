import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePagePcComponent } from './home-page-pc.component';

describe('HomePagePcComponent', () => {
  let component: HomePagePcComponent;
  let fixture: ComponentFixture<HomePagePcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePagePcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePagePcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
