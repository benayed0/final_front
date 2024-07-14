import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinancialService } from './services/financial.service';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxEchartsDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  stockData: any;
  selectedSymbol: string = 'AAPL';
  chartOption: EChartsOption | undefined;
  symbols = ['APPL'];
  constructor(private financialDataService: FinancialService) {}

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
      this.processData();
    });
  }
  private processData(): void {
    const dates = this.stockData.map((data: { date: any }) => data.date);
    const values = this.stockData.map(
      (data: { open: any; close: any; low: any; high: any }) => [
        data.open,
        data.close,
        data.low,
        data.high,
      ]
    );

    this.chartOption = {
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
  }
}
