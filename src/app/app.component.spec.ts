import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { FinancialService } from './services/financial.service';
import { AppComponent } from './app.component';
import { NGX_ECHARTS_CONFIG, NgxEchartsDirective } from 'ngx-echarts';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { EChartsOption } from 'echarts';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let financialServiceMock: any;

  beforeEach(async () => {
    financialServiceMock = jasmine.createSpyObj('FinancialService', [
      'getStockData',
    ]);
    financialServiceMock.getStockData.and.returnValue(
      of([
        { date: '2023-01-01', open: 100, close: 105, low: 95, high: 110 },
        { date: '2023-01-02', open: 105, close: 110, low: 100, high: 115 },
      ])
    );

    await TestBed.configureTestingModule({
      imports: [RouterOutlet, NgxEchartsDirective, NgClass, AppComponent],
      providers: [
        { provide: FinancialService, useValue: financialServiceMock },
        ChangeDetectorRef,
        // {
        //   provide: NGX_ECHARTS_CONFIG,
        //   useValue: { echarts: () => import('echarts') },
        // },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stock data on init', () => {
    spyOn(component, 'loadStockData').and.callThrough();
    component.ngOnInit();
    expect(component.loadStockData).toHaveBeenCalledWith('NKE');
  });

  it('should change selected symbol and load stock data on symbol change', () => {
    spyOn(component, 'loadStockData').and.callThrough();
    component.onSymbolChange('AAPL');
    expect(component.selectedSymbol).toBe('AAPL');
    expect(component.loadStockData).toHaveBeenCalledWith('AAPL');
  });

  it('should process stock data and set chart options', () => {
    const sampleData = [
      { date: '2023-01-01', open: 100, close: 105, low: 95, high: 110 },
      { date: '2023-01-02', open: 105, close: 110, low: 100, high: 115 },
    ];
    component.processData(sampleData);
    expect(component.chartOption).toBeDefined();

    const xAxis = (component.chartOption as EChartsOption).xAxis as any | any[];
    if (Array.isArray(xAxis)) {
      expect(xAxis[0].data).toEqual(['2023-01-01', '2023-01-02']);
    } else {
      expect((xAxis as any).data).toEqual(['2023-01-01', '2023-01-02']);
    }

    const series = (component.chartOption as EChartsOption).series;
    if (Array.isArray(series)) {
      expect(series[0].data).toEqual([
        [100, 105, 95, 110],
        [105, 110, 100, 115],
      ]);
    } else {
      expect(series?.data).toEqual([
        [100, 105, 95, 110],
        [105, 110, 100, 115],
      ]);
    }
  });
});
