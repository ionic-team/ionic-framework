import {ElementRef, Directive} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {MaterialRippleEffect} from '../material/ripple';

/**
 * TODO
 */
@Directive({
  selector: 'button,[button]'
})
export class MaterialButton {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(elementRef: ElementRef, config: IonicConfig) {
    this.elementRef = elementRef;
    this.config = config;
  }

  onInit() {
    if (this.config.setting('mdRipple')) {
      //this.ripple = new MaterialRippleEffect(this);
    }
  }
}
