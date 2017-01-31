import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';

import { isTrueProperty } from '../../util/util';

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
 * @demo /docs/v2/demos/src/scroll/
 */
@Component({
  selector: 'ion-scroll',
  template:
    '<div class="scroll-content">' +
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
   * @input {boolean} whether to enable scrolling along the X axis
   */
  @Input()
  get scrollX() {
    return this._scrollX;
  }
  set scrollX(val: any) {
    this._scrollX = isTrueProperty(val);
  }

  /**
   * @input {boolean} whether to enable scrolling along the Y axis; requires the following CSS declaration: ion-scroll { white-space: nowrap; }
   */
  @Input()
  get scrollY() {
    return this._scrollY;
  }
  set scrollY(val: any) {
    this._scrollY = isTrueProperty(val);
  }

  /**
   * @input {boolean} whether to enable zooming
   */
  @Input()
  get zoom() {
    return this._zoom;
  }
  set zoom(val: any) {
    this._zoom = isTrueProperty(val);
  }

  /**
   * @input {number} set the max zoom amount for ion-scroll
   */
  @Input()
  get maxZoom() {
    return this._maxZoom;
  }
  set maxZoom(val: any) {
    this._maxZoom = val;
  }

  /**
   * @private
   */
  maxScale: number = 3;
  /**
   * @private
   */
  zoomDuration: number = 250;
  /**
   * @private
   */
  scrollElement: HTMLElement;

  constructor(private _elementRef: ElementRef) {}

  /**
   * @private
   */
  ngOnInit() {
    this.scrollElement = this._elementRef.nativeElement.children[0];
  }

  /**
   * @private
   * Add a scroll event handler to the scroll element if it exists.
   * @param {Function} handler  The scroll handler to add to the scroll element.
   * @returns {?Function} a function to remove the specified handler, otherwise
   * undefined if the scroll element doesn't exist.
   */
  addScrollEventListener(handler: any) {
    if (!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    };
  }

}
