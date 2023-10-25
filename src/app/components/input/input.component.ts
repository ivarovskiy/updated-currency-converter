import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() value!: number | null;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(inputValue);

    if (!isNaN(parsedValue)) {
      this.value = parsedValue;
      this.valueChange.emit(this.value);
    } else {
      console.error('Введено некоректне число');
    }
  }
}
