import { Component, OnInit } from '@angular/core';
import {
  Observable,
  combineLatest,
  debounce,
  switchMap,
  timer,
  tap,
  BehaviorSubject,
} from 'rxjs';
import { Currency, CurrencyInputValue } from 'src/app/models/currency';
import { ExchangeApiService } from 'src/app/services/exchange-api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  amountFrom = 1;
  currencyFrom: Currency = { value: 'USD', label: 'USD', symbol: 'USD' };
  amountTo$: Observable<number>;
  currencyTo: Currency = { value: 'UAH', label: 'UAH', symbol: 'UAH' };

  currencyAggregateFrom = new BehaviorSubject<CurrencyInputValue>({
    amount: this.amountFrom,
    currency: this.currencyFrom,
  });
  currencyAggregateTo = new BehaviorSubject<CurrencyInputValue>({
    amount: 0,
    currency: this.currencyTo,
  });

  currencies$: Observable<Currency[]>;

  constructor(private exchangeApi: ExchangeApiService) {
    this.currencies$ = this.exchangeApi.getCurrencies().pipe(
      tap(([from, to]) => {
        this.currencyAggregateFrom.next({
          amount: this.amountFrom,
          currency: (this.currencyFrom = from),
        });
        this.currencyAggregateTo.next({
          amount: 0,
          currency: (this.currencyTo = to),
        });
      })
    );
    this.amountTo$ = combineLatest([
      this.currencyAggregateFrom,
      this.currencyAggregateTo,
    ]).pipe(
      debounce(() => timer(400)),
      switchMap(([currencyAggrFrom, currencyAggrTo]) =>
        this.exchangeApi.convert(
          currencyAggrFrom.amount,
          currencyAggrFrom.currency.value,
          currencyAggrTo.currency.value
        )
      )
    );
  }

  onButtonSwapClick(): void {
    const { currency: currencyFrom, amount: amountFrom } =
      this.currencyAggregateFrom.value;
    const { currency: currencyTo } = this.currencyAggregateTo.value;
    this.amountFrom = amountFrom;
    this.currencyTo = currencyFrom;
    this.currencyFrom = currencyTo;
  }

  ngOnInit() {
    console.log('ng on init');
  }
}
