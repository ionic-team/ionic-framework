import {Component, ElementRef, onInit} from 'angular2/angular2';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {Gesture} from '../../gestures/gesture';
import {CSS} from '../../util/dom';
import {Animation} from '../../animations/animation';

import * as util from 'ionic/util';

/**
 * Scroll is a non-flexboxed scroll area that can scroll horizontally or
 * vertically.
 */
@Component({
  selector: 'ion-scroll',
  inputs: [
    'scrollX', 'scrollY', 'zoom', 'maxZoom'
  ],
  host: {
    '[class.scroll-x]': 'scrollX',
    '[class.scroll-y]': 'scrollY'
  },
  template:
    '<scroll-content>' +
      '<div class="scroll-zoom-wrapper">' +
        '<ng-content></ng-content>' +
      '</div>' +
    '</scroll-content>'
})
export class Scroll extends Ion {

  constructor(elementRef: ElementRef, Config: Config) {
    super(elementRef, Config);

    this.maxScale = 3;
    this.zoomDuration = 250;
  }

  /**
   * @private
   */
  onInit() {
    this.scrollElement = this.getNativeElement().children[0];
  }

  /**
   * Add a scroll event handler to the scroll element if it exists.
   * @param {Function} handler  The scroll handler to add to the scroll element.
   * @returns {?Function} a function to remove the specified handler, otherwise
   * undefined if the scroll element doesn't exist.
   */
  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }

}
