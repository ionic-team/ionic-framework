import {IonicConfig} from '../config/config';

/**
 * Base class for all Ionic components. Exposes some common functionality
 * that all Ionic components need, such as accessing underlying native elements and
 * sending/receiving app-level events.
 */
export class Ion {
  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  getNativeElement() {
    return this.elementRef.nativeElement;
  }

  get cssClass() {
    // IonicConfig.global

    // should be able to set map of classes to add soon:
    // https://github.com/angular/angular/issues/2364

    let componentId = this.constructor.name;

    // let classes = {};
    // classes[componentId + '-ios'] = true;
    // return classes;

    return true;
  }
}
