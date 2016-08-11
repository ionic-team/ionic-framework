import { Directive, ElementRef, Renderer, Attribute } from '@angular/core';

import { Config } from '../../config/config';

/**
  * @name Chip
  * @module ionic
  * @description
  * Chips represent complex entities in small blocks, such as a contact.
  * @see {@link /docs/v2/components/#chips Chips Component Docs}
 **/

@Directive({
  selector: 'ion-chip'
})
export class Chip {

  constructor(
    config: Config,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {
    let element = _elementRef.nativeElement;

    this._readAttrs(element);
  }

  /**
   * @private
   */
  private _readAttrs(element: HTMLElement) {
    let elementAttrs = element.attributes;
    let attrName: string;

    console.info("mushroom");

    for (let i = 0, l = elementAttrs.length; i < l; i++) {
      if (elementAttrs[i].value !== '') continue;

      attrName = elementAttrs[i].name;

      // Ignore attributes item-left, item-right
      if (attrName.indexOf('item') === -1) {
        this._setClass(attrName);
      }
    }
  }

  /**
   * @private
   */
  private _setClass(color: string) {
    this._renderer.setElementClass(this._elementRef.nativeElement, 'chip-' + color, true);
  }
}
