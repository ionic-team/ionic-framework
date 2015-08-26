import {Component, View, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {ScrollTo} from '../../animations/scroll-to';
import {Platform} from '../../platform/platform';


@Component({
  selector: 'ion-content',
  properties: [
    'parallax'
  ]
})
@View({
  template: '<div class="scroll-content"><ng-content></ng-content></div>'
})
export class Content extends Ion {
  constructor(elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);
  }

  onIonInit() {
    this.scrollElement = this.getNativeElement().children[0];
  }

  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener('scroll', handler);

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }

  addTouchMoveListener(handler) {
    if(!this.scrollElement) { return; }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener('touchmove', handler);

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

  getDimensions() {
    let scrollElement = this.scrollElement;
    let parentElement = scrollElement.parentElement;

    return {
      height: parentElement.offsetHeight,
      top: parentElement.offsetTop,
      bottom: parentElement.offsetTop + parentElement.offsetHeight,

      width: parentElement.offsetWidth,
      left: parentElement.offsetLeft,
      right: parentElement.offsetLeft + parentElement.offsetWidth,

      scrollHeight: scrollElement.scrollHeight,
      scrollTop: scrollElement.scrollTop,
      scrollBottom: scrollElement.scrollTop + scrollElement.scrollHeight,

      scrollWidth: scrollElement.scrollWidth,
      scrollLeft: scrollElement.scrollLeft,
      scrollRight: scrollElement.scrollLeft + scrollElement.scrollWidth,

      keyboardTop: (Platform.height() * 0.6)
    }
  }

}
