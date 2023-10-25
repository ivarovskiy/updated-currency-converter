import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExchangeApiService } from 'src/app/services/exchange-api.service';
import { interval, Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  usd = 0;
  eur = 0;
  date!: Date;

  constructor(private exchangeApi: ExchangeApiService) {}

  ngOnInit() {
    this.updateCurrencyRates();

    interval(60000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.exchangeApi.getCurrenciesRates())
      )
      .subscribe(data => {
        console.log(data);
        this.usd = +(data.rates['USD'] * data.rates['UAH']).toFixed(2);
        this.eur = +(data.rates['EUR'] * data.rates['UAH']).toFixed(2);
        this.date = new Date();
      });
  }

  updateCurrencyRates() {
    this.exchangeApi.getCurrenciesRates().subscribe(data => {
      console.log(data);
      this.usd = +(data.rates['USD'] * data.rates['UAH']).toFixed(2);
      this.eur = +(data.rates['EUR'] * data.rates['UAH']).toFixed(2);
      this.date = new Date();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
