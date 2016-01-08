import {Directive, ElementRef, Input} from 'angular2/core';

/**
 * @name Option
 */
@Directive({
  selector: 'ion-option'
})
export class Option {
  constructor(private _elementRef: ElementRef) {
    this._checked = false;
  }

  @Input() value: string;

  get checked(): boolean {
    return this._checked;
  }
  @Input() checked;
  set checked(val:string) {
    this._checked = (val === 'true' || val === true || val === '');
  }

  get text() {
    return this._elementRef.nativeElement.textContent;
  }
}
