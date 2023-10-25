import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Currency, CurrencyInputValue } from '../models/currency';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExchangeApiService {
  private apiKey = '2987803a4aad4f309b3c374e2b0931ad';
  private baseUrl = 'https://openexchangerates.org/api';

  constructor(private http: HttpClient) {}

  getCurrenciesRates(): Observable<any> {
    const params = new HttpParams().set('app_id', this.apiKey);
    return this.http.get<any>(`${this.baseUrl}/latest.json`, {
      params,
    });
  }

  getCurrencies(): Observable<Currency[]> {
    const params = new HttpParams().set('app_id', this.apiKey);
    return this.http.get<any>(`${this.baseUrl}/currencies.json`, {
      params,
    });
  }

  convert(amount: number, from: string, to: string): Observable<number> {
    console.log('convert: ', amount, from, to);

    const params = new HttpParams().set('app_id', this.apiKey);

    return this.http
      .get<any>(`${this.baseUrl}/latest.json`, {
        params,
      })
      .pipe(
        catchError(error => of(`Bad Promise: ${error}`)),
        map(response => {
          const rates = response.rates;

          if (rates && rates[from] && rates[to]) {
            const fromRate = rates[from];
            const toRate = rates[to];

            const convertedValue = amount * (toRate / fromRate);

            return +convertedValue.toFixed(2);
          } else {
            throw new Error('Currency rates not found');
          }
        })
      );
    // change to CurrencyInputValue
  }

  getConvertRates(
    from: string,
    to: string,
    value: string,
    flag: boolean
  ): Observable<number> {
    const params = new HttpParams().set('app_id', this.apiKey);
    return this.http
      .get<any>(`${this.baseUrl}/latest.json`, {
        params,
      })
      .pipe(
        map(response => {
          const rates = response.rates;

          if (rates && rates[from] && rates[to]) {
            let fromRate;
            let toRate;

            if (flag === true) {
              fromRate = rates[from];
              toRate = rates[to];
            } else {
              fromRate = rates[to];
              toRate = rates[from];
            }
            const convertedValue = parseFloat(value) * (toRate / fromRate);

            return +convertedValue.toFixed(2);
          } else {
            throw new Error('Currency rates not found');
          }
        })
      );
  }
}

// import { Injectable } from '@angular/core';
// import { Observable, map } from 'rxjs';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { environment } from 'src/environment/environment.prod';

// @Injectable({
//   providedIn: 'root',
// })
// export class OpenExchangeRatesService {
//   private apiKey = environment.apiKey;
//   private baseUrl = 'https://openexchangerates.org/api';

//   constructor(private http: HttpClient) {}

//   getCurrencyRates(): Observable<any> {
//     const params = new HttpParams().set('app_id', this.apiKey);
//     return this.http.get<any>(`${this.baseUrl}/latest.json`, {
//       params,
//     });
//   }

//   getCurrencies(): Observable<any> {
//     const params = new HttpParams().set('app_id', this.apiKey);
//     return this.http.get<any>(`${this.baseUrl}/currencies.json`, {
//       params,
//     });
//   }

//   getConvertRates(
//     from: string,
//     to: string,
//     value: string,
//     flag: boolean
//   ): Observable<number> {
//     const params = new HttpParams().set('app_id', this.apiKey);
//     return this.http
//       .get<any>(`${this.baseUrl}/latest.json`, {
//         params,
//       })
//       .pipe(
//         map(response => {
//           const rates = response.rates;

//           if (rates && rates[from] && rates[to]) {
//             let fromRate;
//             let toRate;

//             if (flag === true) {
//               fromRate = rates[from];
//               toRate = rates[to];
//             } else {
//               fromRate = rates[to];
//               toRate = rates[from];
//             }
//             const convertedValue = parseFloat(value) * (toRate / fromRate);

//             return +convertedValue.toFixed(2);
//           } else {
//             throw new Error('Currency rates not found');
//           }
//         })
//       );
//   }
// }
