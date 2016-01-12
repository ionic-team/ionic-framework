import {ElementRef} from 'angular2/core';
import {Config} from '../config/config';
import {isArray} from '../util';
import * as dom from '../util/dom';


/**
 * Base class for all Ionic components. Exposes some common functionality
 * that all Ionic components need, such as accessing underlying native elements and
 * sending/receiving app-level events.
 */
export class Ion {
  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  getElementRef() {
    return this.elementRef;
  }

  getNativeElement() {
    return this.elementRef.nativeElement;
  }

  getDimensions() {
    return dom.getDimensions(this);
  }

  width() {
    return dom.getDimensions(this).width;
  }

  height() {
    return dom.getDimensions(this).height;
  }

}
