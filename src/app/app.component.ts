import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinancialService } from './services/financial.service';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxEchartsDirective, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  stockData: any;
  selectedSymbol: string = 'NKE';
  chartOption: EChartsOption | undefined;
  constructor(
    private financialDataService: FinancialService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStockData(this.selectedSymbol);
  }

  onSymbolChange(symbol: string): void {
    this.selectedSymbol = symbol;
    this.loadStockData(symbol);
  }

  loadStockData(symbol: string) {
    this.financialDataService.getStockData(symbol).subscribe((data: any) => {
      this.stockData = data;
      this.processData(data);
    });
  }
  public processData(data: any): void {
    const dates = data.map((data: { date: any }) => data.date);
    const values = data.map(
      (data: { open: any; close: any; low: any; high: any }) => [
        data.open,
        data.close,
        data.low,
        data.high,
      ]
    );

    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      formatter: (params: any) => {
        const param = params[0];
        return `
          Date: ${param.name}<br/>
          Open: ${param.data[0]}<br/>
          Close: ${param.data[1]}<br/>
          Low: ${param.data[2]}<br/>
          High: ${param.data[3]}
        `;
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
      yAxis: {
        scale: true,
        splitArea: {
          show: true,
        },
      },
      series: [
        {
          type: 'candlestick',
          data: values,
        },
      ],
    };
    this.cdr.markForCheck();
  }
}
