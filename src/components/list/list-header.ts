import { Attribute, Directive, ElementRef, Renderer } from '@angular/core';


/**
 * @private
 */
@Directive({
  selector: 'ion-list-header'
})
export class ListHeader {
  constructor(private _renderer: Renderer, private _elementRef: ElementRef, @Attribute('id') private _id: string) { }

  get id(): string {
    return this._id;
  }

  set id(val: string) {
    this._id = val;
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'id', val);
  }
}
