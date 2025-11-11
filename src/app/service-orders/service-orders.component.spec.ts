import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrdersComponent } from './service-orders.component';

describe('ServiceOrders', () => {
  let component: ServiceOrdersComponent;
  let fixture: ComponentFixture<ServiceOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceOrdersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
