import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';

import { assert, isTrueProperty } from '../../util/util';

/**
 * @name Scroll
 * @description
 * Scroll is a non-flexboxed scroll area that can scroll horizontally or vertically. `ion-Scroll` Can be used in places where you may not need a full page scroller, but a highly customized one, such as image scubber or comment scroller.
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
 * @demo /docs/demos/src/scroll/
 */
@Component({
  selector: 'ion-scroll',
  template:
    '<div class="scroll-content" #scrollContent>' +
      '<div class="scroll-zoom-wrapper">' +
        '<ng-content></ng-content>' +
      '</div>' +
    '</div>',
  host: {
    '[class.scroll-x]': 'scrollX',
    '[class.scroll-y]': 'scrollY'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Scroll {

  _scrollX: boolean = false;
  _scrollY: boolean = false;
  _zoom: boolean = false;
  _maxZoom: number = 1;

  /**
   * @input {boolean} If true, scrolling along the X axis is enabled.
   */
  @Input()
  get scrollX() {
    return this._scrollX;
  }
  set scrollX(val: any) {
    this._scrollX = isTrueProperty(val);
  }

  /**
   * @input {boolean} If true, scrolling along the Y axis is enabled; requires the following CSS declaration: ion-scroll { white-space: nowrap; }
   */
  @Input()
  get scrollY() {
    return this._scrollY;
  }
  set scrollY(val: any) {
    this._scrollY = isTrueProperty(val);
  }

  /**
   * @input {boolean} If true, zooming is enabled.
   */
  @Input()
  get zoom() {
    return this._zoom;
  }
  set zoom(val: any) {
    this._zoom = isTrueProperty(val);
  }

  /**
   * @input {number} Set the max zoom amount.
   */
  @Input()
  get maxZoom() {
    return this._maxZoom;
  }
  set maxZoom(val: any) {
    this._maxZoom = val;
  }

  /**
   * @hidden
   */
  maxScale: number = 3;
  /**
   * @hidden
   */
  zoomDuration: number = 250;

  /** @internal */
  @ViewChild('scrollContent', { read: ElementRef }) _scrollContent: ElementRef;

  constructor() { }

  /**
   * @hidden
   * Add a scroll event handler to the scroll element if it exists.
   * @param {Function} handler  The scroll handler to add to the scroll element.
   * @returns {?Function} a function to remove the specified handler, otherwise
   * undefined if the scroll element doesn't exist.
   */
  addScrollEventListener(handler: any) {
    assert(this._scrollContent, 'scroll element is missing');

    const ele = this._scrollContent.nativeElement;
    ele.addEventListener('scroll', handler);

    return () => {
      ele.removeEventListener('scroll', handler);
    };
  }

}
