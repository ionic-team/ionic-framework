import {IonicConfig} from '../config/config';
import {Platform} from '../platform/platform';
import * as util from 'ionic/util';


/**
 * Base class for all Ionic components. Exposes some common functionality
 * that all Ionic components need, such as accessing underlying native elements and
 * sending/receiving app-level events.
 */
export class Ion {
  constructor(elementRef: ElementRef, config: IonicConfig) {
    this.elementRef = elementRef;
    this.config = config;
  }

  onInit() {
    let cls = this.constructor;

    if (cls.defaultProperties && this.config) {
      for (let prop in cls.defaultProperties) {
        // Priority:
        // ---------
        // 1) Value set from within constructor
        // 2) Value set from the host element's attribute
        // 3) Value set by the users global config
        // 4) Value set by the default mode/platform config
        // 5) Value set from the component's default

        if (this[prop]) {
          // this property has already been set on the instance
          // could be from the user setting the element's attribute
          // or from the user setting it within the constructor
          continue;
        }

        // get the property values from a global user/platform config
        let configVal = this.config.setting(prop);
        if (configVal) {
          this[prop] = configVal;
          continue;
        }

        // wasn't set yet, so go with property's default value
        this[prop] = cls.defaultProperties[prop];
      }
    }
  }

  getDelegate(delegateName) {
    let cls = this.constructor;

    if (cls.delegates) {
      let cases = cls.delegates[delegateName] || [];

      for (let i = 0; i < cases.length; i++) {
        let delegateCase = cases[i];
        if (util.isArray(delegateCase)) {
          let [ check, DelegateConstructor ] = delegateCase;
          if (check(this)) {
            return new DelegateConstructor(this);
          }

        } else {
          return new delegateCase(this);
        }
      }
    }
  }

  getElementRef() {
    return this.elementRef;
  }

  getNativeElement() {
    return this.elementRef.nativeElement;
  }

  width() {
    return Platform.getDimensions(this).w;
  }

  height() {
    return Platform.getDimensions(this).h;
  }

}
