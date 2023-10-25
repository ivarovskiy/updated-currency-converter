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

  currencyAggregateFrom!: Subject<CurrencyInputValue>;
  currencyAggregateTo!: Subject<CurrencyInputValue>;

  amountTo$!: Observable<number>;
  currencies$!: Observable<Currency[]>;

  constructor(private exchangeApi: ExchangeApiService) {
    this.currencies$ = this.exchangeApi.getCurrencies();

    this.amountTo$ = combineLatest(
      this.currencyAggregateFrom,
      this.currencyAggregateTo
    ).pipe(
      debounce(() => timer(400)),
      switchMap(([currencyAggrFrom, currencyAggrTo]) =>
        this.exchangeApi.convert(
          currencyAggrFrom.amount,
          currencyAggrFrom.currency.value,
          currencyAggrTo.currency.value
        )
      ),
      defaultIfEmpty(0),
      catchError(err => {
        return new Observable<number>();
      })
    );
  }

  onCurrencyInputChangeFrom(value: CurrencyInputValue): void {
    console.log('main onCurrencyInputChangeFrom');
    this.currencyAggregateFrom.next(value);
  }

  onCurrencyInputChangeTo(value: CurrencyInputValue): void {
    console.log('main onCurrencyInputChangeTo');
    this.currencyAggregateTo.next(value);
  }

  onButtonSwapClick(): void {
    console.log('emit to main');

    [this.currencyAggregateFrom, this.currencyAggregateTo] = [
      this.currencyAggregateTo,
      this.currencyAggregateFrom,
    ];
  }

  ngOnInit() {
    this.exchangeApi.getCurrencies().subscribe((currencies: Currency[]) => {
      console.log('currencies: ', currencies);

      const keys = Object.keys(currencies);
      const values = Object.values(currencies);

      const firstKey = keys[0];
      const firstValue = values[0];
      const secondKey = keys[1];
      const secondValue = values[1];

      this.currencyFrom = { key: firstKey, value: firstValue };
      this.currencyTo = { key: secondKey, value: secondValue };

      console.log('ft ob: ', this.currencyFrom, 'sc ob: ', this.currencyTo);

      // const entries = Object.entries(currencies);
      // const [firstKey, firstValue] = entries[0];

      // this.currencyFrom = ['USD', 'United States Dollar'];
      // this.currencyTo = ['AED', 'United Arab Emirates Dirham'];
      // this.currencyFrom = currencies.slice(0, 1);
      // this.currencyTo = currencies.slice(1, 2);

      // if (currencies.length >= 2) {
      //   this.currencyFrom = {
      //     label: Object.keys(currencies)[0],
      //     value: Object.values(currencies)[0],
      //   };
      //   this.currencyTo = {
      //     label: Object.keys(currencies)[1],
      //     value: Object.values(currencies)[1],
      //   };
      // }
      // Ініціалізація amountFrom за потребою

      // this.currencyFrom = {
      //   key: currencies.entries()[0].key, // AED
      //   value: currencies.entries()[0].value, // United Arab Emirates Dirham
      // };

      this.amountFrom = 100;
    });
  }
}
