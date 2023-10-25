import { Component, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  debounce,
  switchMap,
  timer,
  defaultIfEmpty,
  startWith,
} from 'rxjs';
import { Currency, CurrencyInputValue } from 'src/app/models/currency';
import { ExchangeApiService } from 'src/app/services/exchange-api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  currencyFrom!: any;
  currencyTo!: any;
  amountFrom!: number;

  currencyAggregateFrom: Subject<CurrencyInputValue> =
    new Subject<CurrencyInputValue>();
  currencyAggregateTo: Subject<CurrencyInputValue> =
    new Subject<CurrencyInputValue>();

  amountTo$: Observable<number> | null = new Observable<number>();
  currencies$: Observable<Currency[]> = new Observable<Currency[]>();

  constructor(private exchangeApi: ExchangeApiService) {
    this.exchangeApi.getCurrencies().subscribe((currencies: Currency[]) => {
      const keys = Object.keys(currencies);
      const values = Object.values(currencies);

      const firstKey = keys[0];
      const firstValue = values[0];
      const secondKey = keys[1];
      const secondValue = values[1];

      this.currencyFrom = { key: firstKey, value: firstValue };
      this.currencyTo = { key: secondKey, value: secondValue };

      this.amountFrom = 0;
    });

    this.currencies$ = this.exchangeApi.getCurrencies();

    this.amountTo$ = combineLatest([
      this.currencyAggregateFrom,
      this.currencyAggregateTo,
    ]).pipe(
      debounce(() => timer(400)),
      switchMap(([currencyAggrFrom, currencyAggrTo]) => {
        return this.exchangeApi.convert(
          currencyAggrFrom.amount,
          currencyAggrFrom.currency.value,
          currencyAggrTo.currency.value
        );
      }),
      catchError(err => {
        return new Observable<number>();
      }),
      startWith(0)
    );
  }

  onCurrencyInputChangeFrom(value: CurrencyInputValue): void {
    console.log('main onCurrencyInputChangeFrom', value);
    this.currencyAggregateFrom.next(value);
  }

  onCurrencyInputChangeTo(value: CurrencyInputValue): void {
    console.log('main onCurrencyInputChangeTo', value);
    this.currencyAggregateTo.next(value);
  }

  onButtonSwapClick(): void {
    [this.currencyAggregateFrom, this.currencyAggregateTo] = [
      this.currencyAggregateTo,
      this.currencyAggregateFrom,
    ];
  }

  ngOnInit() {
    console.log('ng on init');
  }
}
