import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Output() buttonClicked: EventEmitter<Event> = new EventEmitter<Event>();
  isRotated = false;

  onButtonClicked() {
    this.buttonClicked.emit();
  }

  addRotateClass() {
    this.isRotated = true;
  }

  removeRotateClass() {
    this.isRotated = false;
  }
}
