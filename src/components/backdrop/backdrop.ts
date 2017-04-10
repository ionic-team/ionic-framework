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
  test: any;
  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {
    this.test = 'Backdrop component';
  }

  getNativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  setElementClass(className: string, add: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
  }

}
