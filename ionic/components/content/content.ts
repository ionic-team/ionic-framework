import {Component, ElementRef, Optional, NgZone} from 'angular2/angular2';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {raf}  from '../../util/dom';
import {Keyboard} from '../../util/keyboard';
import {ViewController} from '../nav/view-controller';
import {Animation} from '../../animations/animation';
import {ScrollTo} from '../../animations/scroll-to';

/**
 * The Content component provides an easy to use content area that can be configured to use Ionic's custom Scroll View, or the built in overflow scrolling of the browser.
 *
 * While we recommend using the custom Scroll features in Ionic in most cases, sometimes (for performance reasons) only the browser's native overflow scrolling will suffice, and so we've made it easy to toggle between the Ionic scroll implementation and overflow scrolling.
 *
 * You can implement pull-to-refresh with the [Refresher](../../scroll/Refresher) component.
 *
 * @usage
 * ```html
 * <ion-content>
 *   Add your content here!
 * </ion-content>
 * ```
 *
 */
@Component({
  selector: 'ion-content',
  template:
    '<scroll-content>' +
      '<ng-content></ng-content>' +
    '</scroll-content>'
})
export class Content extends Ion {
  /**
   * @param {ElementRef} elementRef  A reference to the component's DOM element.
   * @param {Config} config  The config object to change content's default settings.
   */
  constructor(elementRef: ElementRef, config: Config, keyboard: Keyboard, @Optional() viewCtrl: ViewController, private _zone: NgZone) {
    super(elementRef, config);
    this.scrollPadding = 0;
    this.keyboard = keyboard;

    if (viewCtrl) {
      viewCtrl.setContent(this);
      viewCtrl.setContentRef(elementRef);
    }
  }

  /**
   * @private
   */
  onInit() {
    super.onInit();
    this.scrollElement = this.getNativeElement().children[0];
  }

  /**
   * Adds the specified scroll handler to the content' scroll element.
   * @param {Function} handler  The scroll event handler.
   * @returns {Function} A function that removes the scroll handler.
   */
  addScrollEventListener(handler) {
    if (!this.scrollElement) { return; }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener('scroll', handler);

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }

  onScrollEnd(callback) {
    let lastScrollTop = null;
    let framesUnchanged = 0;
    let scrollElement = this.scrollElement;

    function next() {
      let currentScrollTop = scrollElement.scrollTop;
      if (lastScrollTop !== null) {

        if (Math.round(lastScrollTop) === Math.round(currentScrollTop)) {
          framesUnchanged++;
        } else {
          framesUnchanged = 0;
        }

        if (framesUnchanged > 9) {
          return callback();
        }
      }

      lastScrollTop = currentScrollTop;

      raf(() => {
        raf(next);
      });
    }

    setTimeout(next, 100);
  }

  /**
   * Adds the specified touchmove handler to the content's scroll element.
   * @param {Function} handler  The touchmove handler.
   * @returns {Function} A function that removes the touchmove handler.
   */
  addTouchMoveListener(handler) {
    if (!this.scrollElement) { return; }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener('touchmove', handler);

    this.scrollElement.addEventListener('touchmove', handler);

    return () => {
      this.scrollElement.removeEventListener('touchmove', handler);
    }
  }

  /**
   * Scroll to the specified position.
   * @param {TODO} x  The x-value to scroll to.
   * @param {TODO} y  The y-value to scroll to.
   * @param {Number} duration  Duration of the scroll animation.
   * @param {TODO} tolerance  TODO
   * @returns {TODO} TODO
   */
  scrollTo(x, y, duration, tolerance) {
    if (this._scrollTo) {
      this._scrollTo.dispose();
    }

    this._scrollTo = new ScrollTo(this.scrollElement);

    return this._scrollTo.start(x, y, duration, tolerance);
  }

  scrollToTop() {
    if (this._scrollTo) {
      this._scrollTo.dispose();
    }

    this._scrollTo = new ScrollTo(this.scrollElement);

    return this._scrollTo.start(0, 0, 300, 0);
  }

  /**
   * @private
   * Returns the content and scroll elements' dimensions.
   * @returns {Object} dimensions  The content and scroll elements' dimensions
   * {Number} dimensions.contentHeight  content offsetHeight
   * {Number} dimensions.contentTop  content offsetTop
   * {Number} dimensions.contentBottom  content offsetTop+offsetHeight
   * {Number} dimensions.contentWidth  content offsetWidth
   * {Number} dimensions.contentLeft  content offsetLeft
   * {Number} dimensions.contentRight  content offsetLeft + offsetWidth
   * {Number} dimensions.scrollHeight  scroll scrollHeight
   * {Number} dimensions.scrollTop  scroll scrollTop
   * {Number} dimensions.scrollBottom  scroll scrollTop + scrollHeight
   * {Number} dimensions.scrollWidth  scroll scrollWidth
   * {Number} dimensions.scrollLeft  scroll scrollLeft
   * {Number} dimensions.scrollRight  scroll scrollLeft + scrollWidth
   */
  getDimensions() {
    let scrollElement = this.scrollElement;
    let parentElement = scrollElement.parentElement;

    return {
      contentHeight: parentElement.offsetHeight,
      contentTop: parentElement.offsetTop,
      contentBottom: parentElement.offsetTop + parentElement.offsetHeight,

      contentWidth: parentElement.offsetWidth,
      contentLeft: parentElement.offsetLeft,
      contentRight: parentElement.offsetLeft + parentElement.offsetWidth,

      scrollHeight: scrollElement.scrollHeight,
      scrollTop: scrollElement.scrollTop,
      scrollBottom: scrollElement.scrollTop + scrollElement.scrollHeight,

      scrollWidth: scrollElement.scrollWidth,
      scrollLeft: scrollElement.scrollLeft,
      scrollRight: scrollElement.scrollLeft + scrollElement.scrollWidth,
    }
  }

  /**
   * @private
   * Adds padding to the bottom of the scroll element when the keyboard is open
   * so content below the keyboard can be scrolled into view.
   */
  addScrollPadding(newScrollPadding) {
    if (newScrollPadding > this.scrollPadding) {
      console.debug('addScrollPadding', newScrollPadding);

      this.scrollPadding = newScrollPadding;
      this.scrollElement.style.paddingBottom = newScrollPadding + 'px';

      if (!this.keyboardPromise) {
        console.debug('add scroll keyboard close callback', newScrollPadding);

        this.keyboardPromise = this.keyboard.onClose(() => {
          console.debug('scroll keyboard closed', newScrollPadding);

          if (this) {
            if (this.scrollPadding && this.scrollElement) {
              let close = new Animation(this.scrollElement);
              close
                .duration(150)
                .fromTo('paddingBottom', this.scrollPadding + 'px', '0px')
                .play();
            }

            this.scrollPadding = 0;
            this.keyboardPromise = null;
          }
        });

      }
    }
  }

}
