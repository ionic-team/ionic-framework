import {Directive, Renderer, ElementRef} from 'angular2/core';


/**
 * @name Blur
 * @description
 * The blur attribute applies the CSS blur attribute to an element. Safari only.
 *
 * @usage
 * ```html
 * <ion-card blur>
 *    This card will blur the content behind it.
 * </ion-card>
 * ```
 *
 * @demo /docs/v2/demos/blur/
 * @private
 */
@Directive({
  selector: '[blur]'
})
export class Blur {
  constructor(private _elementRef: ElementRef, private _renderer: Renderer) {
    _renderer.setElementStyle(_elementRef.nativeElement, '-webkit-backdrop-filter', 'blur(10px)');
  }
}
