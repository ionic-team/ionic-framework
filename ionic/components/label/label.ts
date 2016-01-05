import {Directive, ElementRef, Renderer} from 'angular2/core';

import {Form} from '../../util/form';


/**
 * @name Label
 * @description
 * Labels describe the data that the user should enter in to an input element.
 * @usage
 * ```html
 * <ion-input>
 *   <ion-label>Username</ion-label>
 *   <input type="text" value="">
 * </ion-input>
 * ```
 *
 * @demo /docs/v2/demos/label/
 * @see {@link ../../../../components#inputs Input Component Docs}
 * @see {@link ../Input Input API Docs}
 *
 */

@Directive({
  selector: 'ion-label',
  inputs: [
    'id'
  ],
  host: {
    '[attr.id]': 'id'
  }
})
export class Label {

  constructor(
    private _form: Form,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {}

/**
 * @private
 */
  ngOnInit() {
    if (!this.id) {
      this.id = 'lbl-' + this._form.nextId();
    }
  }

  /**
   * @private
   */
  addClass(className) {
    this._renderer.setElementClass(this._elementRef, className, true);
  }

}
