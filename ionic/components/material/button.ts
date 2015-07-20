import {ElementRef, Directive, onDestroy} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {MaterialRippleEffect} from '../material/ripple';

@Directive({
  selector: 'button,[button]',
  lifecycle: [onDestroy]
})
export class MaterialButton {
  constructor(elementRef: ElementRef, config: IonicConfig) {
    this.elementRef = elementRef;

    if(config.setting('mdRipple')) {
      this.ripple = new MaterialRippleEffect(this);
    }
  }

  onDestroy() {

  }
}
