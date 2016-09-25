import { ElementRef, Renderer } from '@angular/core';

import { Config } from '../config/config';
import { getDimensions, clearDimensions } from '../util/dom';

/**
 * Base class for all Ionic components. Exposes some common functionality
 * that all Ionic components need, such as accessing underlying native elements and
 * sending/receiving app-level events.
 */
export class Ion {
  private _ionId: string;

  /** @private */
  _config: Config;

  /** @private */
  _elementRef: ElementRef;

  /** @private */
  _renderer: Renderer;

  /** @private */
  _color: string;

  /** @private */
  _mode: string;

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    this._config = config;
    this._elementRef = elementRef;
    this._renderer = renderer;
  }

  /** @private */
  setElementClass(className: string, isAdd: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, isAdd);
  }

  /** @private */
  setElementAttribute(attributeName: string, attributeValue: any) {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, attributeName, attributeValue);
  }

  /** @private */
  setElementStyle(property: string, value: string) {
    this._renderer.setElementStyle(this._elementRef.nativeElement, property, value);
  }

  /** @private */
  _setColor(componentName: string, newColor: string) {
    if (this._color) {
      this.setElementClass(`${componentName}-${this._mode}-${this._color}`, false);
    }
    if (newColor) {
      this.setElementClass(`${componentName}-${this._mode}-${newColor}`, true);
      this._color = newColor;
    }
  }

  /** @private */
  _setMode(componentName: string, newMode: string) {
    if (this._mode) {
      this.setElementClass(`${componentName}-${this._mode}`, false);
    }
    if (newMode) {
      this.setElementClass(`${componentName}-${newMode}`, true);

      // Remove the color class associated with the previous mode,
      // change the mode, then add the new color class
      this._setColor(componentName, null);
      this._mode = newMode;
      this._setColor(componentName, this._color);
    }
  }

  /** @private */
  getElementRef(): ElementRef {
    return this._elementRef;
  }

  /** @private */
  getNativeElement(): any {
    return this._elementRef.nativeElement;
  }

  /** @private */
  getDimensions(): { width: number, height: number, left: number, top: number} {
    return getDimensions(this.getNativeElement(), this._getId());
  }

  /** @private */
  width(): number {
    return getDimensions(this.getNativeElement(), this._getId()).width;
  }

  /** @private */
  height(): number {
    return getDimensions(this.getNativeElement(), this._getId()).height;
  }

  /** @private */
  destroy() {
    clearDimensions(this._ionId);
  }

  /** internal */
  _getId() {
    if (!this._ionId) {
      this._ionId = 'i' + ids++;
    }
    return this._ionId;
  }

}

let ids: number = 0;
