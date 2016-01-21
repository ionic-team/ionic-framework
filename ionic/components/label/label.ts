import {Directive, ElementRef, Renderer, Input, Optional, Attribute} from 'angular2/core';


/**
 * @name Label
 * @description
 * Labels describe the data that the user should enter in to an input
 * element. You can give `ion-label` attributes to tell it how to
 * handle its display type, which is especially useful for an
 * `ion-item` which contains a text input.
 *
 * @property [fixed] - a persistant label that sits next the the input
 * @property [floating] - a label that will float about the input if the input is empty of looses focus
 * @property [stacked] - A stacked label will always appear on top of the input

 *
 * @usage
 * ```html
 *  <ion-item>
 *    <ion-label>Username</ion-label>
 *    <ion-input></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-labe fixed>Website</ion-label>
 *    <ion-input type="url"></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label floating>Email</ion-label>
 *    <ion-input type="email"></ion-input>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label stacked>Phone</ion-label>
 *    <ion-input type="tel"></ion-input>
 *  </ion-item>
 *
 * ```
 *
 * @demo /docs/v2/demos/label/
 * @see {@link ../../../../components#inputs Input Component Docs}
 * @see {@link ../Input Input API Docs}
 *
 */

@Directive({
  selector: 'ion-label'
})
export class Label {
  private _id: string;

  type: string;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    @Attribute('floating') isFloating: string,
    @Attribute('stacked') isStacked: string,
    @Attribute('fixed') isFixed: string,
    @Attribute('inset') isInset: string
  ) {
    this.type = (isFloating === '' ? 'floating' : (isStacked === '' ? 'stacked' : (isFixed === '' ? 'fixed' : (isInset === '' ? 'inset' : null))));
  }

  @Input()
  get id(): string {
    return this._id;
  }

  set id(val: string) {
    this._id = val;
    if (val) {
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'id', val);
    }
  }

  get text(): string {
    return this._elementRef.nativeElement.textContent || '';
  }

  /**
   * @private
   * @param {string} add class name
   */
  addClass(className: string) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, true);
  }

}
