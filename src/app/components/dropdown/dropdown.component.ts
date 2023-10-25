import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Currency } from 'src/app/models/currency';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  @Input() options!: Currency[];
  @Input() selected!: Currency;
  @Output() dropdownSelect: EventEmitter<Currency> =
    new EventEmitter<Currency>();

  onItemSelected(currency: Currency): void {
    this.dropdownSelect.emit(currency);
  }

  ngOnInit(): void {
    console.log('selected value: ', this.selected);
  }
}
