import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * @hidden
 */
@Directive({
  selector: 'ion-backdrop',
  host: {
    'role': 'presentation',
    'tappable': '',
    'disable-activated': ''
  },
})
export class Backdrop {

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) { }

  getNativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  setElementClass(className: string, add: boolean) {
    if (add) {
      this._renderer.addClass(this._elementRef.nativeElement, className);
    } else {
      this._renderer.removeClass(this._elementRef.nativeElement, className);
    }
  }

}
