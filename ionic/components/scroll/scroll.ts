import {Component, ElementRef} from 'angular2/core';

import {Ion} from '../ion';
import {Gesture} from '../../gestures/gesture';
import {CSS} from '../../util/dom';
import {Animation} from '../../animations/animation';

import * as util from '../../util';

/**
 * @name Scroll
 * @description
 * Scroll is a non-flexboxed scroll area that can scroll horizontally or vertically. `ion-Scroll` Can be used in places were you may not need a full page scroller, but a highly customized one, such as image scubber or comment scroller.
 * @usage
 * ```html
 * <ion-scroll scrollX="true">
 * </ion-scroll>
 *
 * <ion-scroll scrollY="true">
 * </ion-scroll>
 *
 * <ion-scroll scrollX="true" scrollY="true">
 * </ion-scroll>
 * ```
 *@property {boolean} [scrollX] - whether to enable scrolling along the X axis
 *@property {boolean} [scrollY] - whether to enable scrolling along the Y axis
 *@property {boolean} [zoom] - whether to enable zooming
 *@property {number} [maxZoom] - set the max zoom amount for ion-scroll
 * @demo /docs/v2/demos/scroll/
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
  /**
   * @private
   */
  private maxScale: number = 3;
  /**
   * @private
   */
  private zoomDuration: number = 250;
  /**
   * @private
   */
  private scrollElement: HTMLElement;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  /**
   * @private
   */
  ngOnInit() {
    this.scrollElement = this.getNativeElement().children[0];
  }

  /**
   * @private
   * Add a scroll event handler to the scroll element if it exists.
   * @param {Function} handler  The scroll handler to add to the scroll element.
   * @returns {?Function} a function to remove the specified handler, otherwise
   * undefined if the scroll element doesn't exist.
   */
  addScrollEventListener(handler) {
    if (!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    };
  }

}
