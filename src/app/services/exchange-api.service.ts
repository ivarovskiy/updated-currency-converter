import { Injectable, isDevMode } from '@angular/core';
import { Observable, map, of, iif } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../models/currency';
import { catchError } from 'rxjs/operators';
import currencies from './currencies.json';
import latest from './latest.json';

@Injectable({
  providedIn: 'root',
})
export class ExchangeApiService {
  constructor(private http: HttpClient) {}

  getCurrenciesRates(): Observable<any> {
    return iif(isDevMode, of(latest), this.http.get('/latest.json'));
  }

  getCurrencies(): Observable<Currency[]> {
    return iif(
      isDevMode,
      of(currencies),
      this.http.get('/currencies.json')
    ).pipe(
      map(obj =>
        Object.entries(obj).map(([value, label]) => ({
          label,
          value,
          symbol: value,
        }))
      )
    );
  }

  convert(amount: number, from: string, to: string): Observable<number> {
    return this.getCurrenciesRates().pipe(
      catchError(error => of(`Bad Promise: ${error}`)),
      map(({ rates }) => {
        let convertedValue = 0;
        if (rates && rates[from] && rates[to]) {
          const fromRate = rates[from];
          const toRate = rates[to];

          convertedValue = amount * (toRate / fromRate);
        }
        return +convertedValue.toFixed(2);
      })
    );
  }
}
