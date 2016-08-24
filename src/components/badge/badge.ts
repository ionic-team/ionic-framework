import { Directive, ElementRef, Input, Renderer } from '@angular/core';

import { Config } from '../../config/config';


/**
  * @name Badge
  * @module ionic
  * @description
  * Badges are simple components in Ionic containing numbers or text. You can display a badge to indicate that there is new information associated with the item it is on.
  * @see {@link /docs/v2/components/#badges Badges Component Docs}
 */
@Directive({
  selector: 'ion-badge'
})
export class Badge {
  /** @internal */ 
  _color: string;

  /**
   * @input {string} The predefined color to use. For example: `"primary"`, `"secondary"`, `"danger"`.
   */
  @Input()
  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._updateColor(value);
  }

  constructor(
    config: Config,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) { }

  /**
   * @internal
   */
  _updateColor(newColor: string) {
    this._setElementColor(this._color, false);
    this._setElementColor(newColor, true);
    this._color = newColor;
  }

  /**
   * @internal
   */
  _setElementColor(color: string, isAdd: boolean) {
    if (color !== null && color !== '') {
      this._renderer.setElementClass(this._elementRef.nativeElement, `badge-${color}`, isAdd);
    }
  }
}
