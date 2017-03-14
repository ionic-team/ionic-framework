import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * @hidden
 */
@Directive({
  selector: '[next-input]'
})
export class NextInput {
  @Output() focused: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('focus')
  receivedFocus() {
    console.debug('native-input, next-input received focus');
    this.focused.emit(true);
  }

}
