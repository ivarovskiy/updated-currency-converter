import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Output() buttonClicked: EventEmitter<Event> = new EventEmitter<Event>();

  onButtonClicked() {
    this.buttonClicked.emit();
  }
}
