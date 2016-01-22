import {ElementRef} from 'angular2/core';
import {Config} from '../config/config';
import {isArray} from '../util';
import * as dom from '../util/dom';

let ids:number = 0;

/**
 * Base class for all Ionic components. Exposes some common functionality
 * that all Ionic components need, such as accessing underlying native elements and
 * sending/receiving app-level events.
 */
export class Ion {
  private _id: string;

  constructor(protected elementRef: ElementRef) {
    this._id = 'i' + ids++;
  }

  getElementRef() {
    return this.elementRef;
  }

  getNativeElement() {
    return this.elementRef.nativeElement;
  }

  getDimensions() {
    return dom.getDimensions(this.elementRef.nativeElement, this._id);
  }

  width() {
    return dom.getDimensions(this.elementRef.nativeElement, this._id).width;
  }

  height() {
    return dom.getDimensions(this.elementRef.nativeElement, this._id).height;
  }

}
