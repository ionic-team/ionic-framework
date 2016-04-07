import {Directive, ElementRef, Renderer, Attribute} from 'angular2/core';

import {Config} from '../../config/config';


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
    let attrName;
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
    this._renderer.setElementClass(this._elementRef.nativeElement, 'badge-' + color, true);
  }
}
