import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExchangeApiService } from 'src/app/services/exchange-api.service';
import { interval, Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  usd = 0;
  eur = 0;
  date!: Date;

  constructor(private exchangeApi: ExchangeApiService) {}

  ngOnInit() {
    this.updateCurrencyValues();

    const intervalSubscription = interval(60000)
      .pipe(switchMap(() => of(this.updateCurrencyValues())))
      .subscribe();

    this.subscription.add(intervalSubscription);
  }

  updateCurrencyValues(): void {
    this.subscription.add(
      this.exchangeApi
        .convert(1, 'USD', 'UAH')
        .subscribe(result => (this.usd = result))
    );

    this.subscription.add(
      this.exchangeApi
        .convert(1, 'EUR', 'UAH')
        .subscribe(result => (this.eur = result))
    );

    this.date = new Date();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
