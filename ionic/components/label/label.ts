import {Directive, ElementRef, Renderer, Input, Optional, Attribute} from 'angular2/core';


/**
 * @name Label
 * @description
 * Labels are placed inside of an `ion-item` element and can be used
 * to describe an `ion-input`, `ion-toggle`, `ion-checkbox`, and more.
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
 *    <ion-label fixed>Website</ion-label>
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
 *  <ion-item>
 *    <ion-label>Toggle</ion-label>
 *    <ion-toggle></ion-toggle>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label>Checkbox</ion-label>
 *    <ion-checkbox></ion-checkbox>
 *  </ion-item>
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

  /**
   * @private
   */
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

  /**
   * @private
   */
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

  /**
   * @private
   */
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
