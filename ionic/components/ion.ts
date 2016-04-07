import {ElementRef} from 'angular2/core';
import * as dom from '../util/dom';

let ids: number = 0;

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

  getElementRef(): ElementRef {
    return this.elementRef;
  }

  getNativeElement(): any {
    return this.elementRef.nativeElement;
  }

  getDimensions(): {
    width: number, height: number, left: number, top: number
  } {
    return dom.getDimensions(this.elementRef.nativeElement, this._id);
  }

  width(): number {
    return dom.getDimensions(this.elementRef.nativeElement, this._id).width;
  }

  height(): number {
    return dom.getDimensions(this.elementRef.nativeElement, this._id).height;
  }

  ngOnDestroy() {
    dom.clearDimensions(this._id);
  }

}
