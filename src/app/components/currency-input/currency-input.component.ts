import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject, Subscription, combineLatest, map } from 'rxjs';
import { Currency, CurrencyInputValue } from 'src/app/models/currency';

@Component({
  selector: 'app-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
})
export class CurrencyInputComponent implements OnDestroy {
  @Input() amount!: number;
  @Input() currencies!: Currency[];
  @Input() selectedCurrency!: Currency;
  @Output() handleChange!: EventEmitter<CurrencyInputValue>;

  amountStream: Subject<number> = new Subject<number>();
  currencyStream: Subject<Currency> = new Subject<Currency>();

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
        console.log('combine latest value: ', value);
        this.handleChange.emit(value);
      });
  }

  onAmountChange(newAmount: number) {
    console.log('on amount change: ', newAmount);
    this.amountStream.next(newAmount);
  }

  onCurrencySelect(newCurrency: Currency) {
    console.log('on currency change: ', newCurrency);
    this.currencyStream.next(newCurrency);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
