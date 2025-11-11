import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrderDetailComponent } from './service-order-detail.component';

describe('ServiceOrderDetailComponent', () => {
  let component: ServiceOrderDetailComponent;
  let fixture: ComponentFixture<ServiceOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceOrderDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
