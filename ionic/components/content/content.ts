import {Component, View, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {ScrollTo} from '../../animations/scroll-to';


@Component({
  selector: 'ion-content',
  properties: [
    'parallax'
  ],
  host: {
    ['[class.scroll-padding]']: 'scrollPadding'
  }
})
@View({
  template: '<div class="scroll-content"><content></content></div>'
})
export class Content extends Ion {
  constructor(elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);

    this.scrollPadding = config.setting('keyboardScrollAssist');
  }

  onIonInit() {
    this.scrollElement = this.getNativeElement().children[0];
  }

  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }

  addTouchMoveListener(handler) {
    if(!this.scrollElement) { return; }

    this.scrollElement.addEventListener('touchmove', handler);

    return () => {
      this.scrollElement.removeEventListener('touchmove', handler);
    }
  }

  scrollTo(x, y, duration, tolerance) {
    if (this._scrollTo) {
      this._scrollTo.dispose();
    }

    this._scrollTo = new ScrollTo(this.scrollElement);

    return this._scrollTo.start(x, y, duration, tolerance);
  }

  get scrollPadding() {
    return this._sp;
  }

  set scrollPadding(val) {
    this._sp = val;
  }

}
