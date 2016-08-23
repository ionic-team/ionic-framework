import { Directive, ElementRef, Input, Renderer } from '@angular/core';


/**
  * @private
  * Select all of the HTML text elements with the color attribute to apply the text-color class.
 */
@Directive({
  selector: 'h1[color], h2[color], h3[color], h4[color], h5[color], h6[color], a[color], p[color], span[color], b[color], i[color], strong[color], em[color], small[color], sub[color], sup[color]'
})
export class Typography {
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
      this._renderer.setElementClass(this._elementRef.nativeElement, `text-${color}`, isAdd);
    }
  }
}
