import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FinancialService } from './financial.service';
import { environment } from '../environments/environment.development';

describe('FinancialService', () => {
  let service: FinancialService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinancialService],
    });
    service = TestBed.inject(FinancialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stock data', () => {
    const dummyData = [
      { date: '2023-01-01', open: 100, close: 105, low: 95, high: 110 },
      { date: '2023-01-02', open: 105, close: 110, low: 100, high: 115 },
    ];

    service.getStockData('NKE').subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/stocks/NKE`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });
});
