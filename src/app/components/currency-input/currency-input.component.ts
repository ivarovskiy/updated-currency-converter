import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  Subject,
  Subscription,
  combineLatest,
  map,
  BehaviorSubject,
  distinctUntilChanged,
} from 'rxjs';
import { Currency, CurrencyInputValue } from 'src/app/models/currency';

@Component({
  selector: 'app-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
})
export class CurrencyInputComponent implements OnDestroy, OnChanges {
  @Input() disabled!: boolean;
  @Input() amount!: number;
  @Input() currencies!: Currency[];
  @Input() selectedCurrency!: Currency;
  @Output() handleChange: EventEmitter<CurrencyInputValue> =
    new EventEmitter<CurrencyInputValue>();

  amountStream: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currencyStream: BehaviorSubject<Currency> = new BehaviorSubject<Currency>({
    symbol: '',
    value: '',
    label: '',
  });

  subscription: Subscription = new Subscription();

  constructor() {
    this.subscription = combineLatest([this.amountStream, this.currencyStream])
      .pipe(
        map(([amount, currency]) => ({
          amount,
          currency,
        }))
      )
      .subscribe(value => {
        this.handleChange.emit(value);
      });
  }

  ngOnChanges() {
    this.amountStream.next(this.amount);
    this.currencyStream.next(this.selectedCurrency);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
