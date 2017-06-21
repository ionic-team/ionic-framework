import { Directive, ElementRef, Renderer } from '@angular/core';

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
  constructor(private _elementRef: ElementRef, private _renderer: Renderer) {
  }

  getNativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  setElementClass(className: string, add: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
  }

}
