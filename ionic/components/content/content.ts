import {Component, View, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';
import {ScrollTo} from '../../animations/scroll-to';
import {hasFocusedTextInput} from '../../util/dom';

/**
 * TODO
 */
@Component({
  selector: 'ion-content',
  properties: [
    'parallax'
  ]
})
@View({
  template: '<scroll-content><ng-content></ng-content></scroll-content>'
})
export class Content extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);
    this.scrollPadding = 0;
  }

  /**
   * TODO
   */
  onIonInit() {
    this.scrollElement = this.getNativeElement().children[0];
  }

  /**
   * Adds the specified scroll handler to the content' scroll element.
   * @param {Function} handler  The scroll event handler.
   * @returns {Function} A function that removes the scroll handler.
   */
  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener('scroll', handler);

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }

  /**
   * Adds the specified touchmove handler to the content's scroll element.
   * @param {Function} handler  The touchmove handler.
   * @returns {Function} A function that removes the touchmove handler.
   */
  addTouchMoveListener(handler) {
    if(!this.scrollElement) { return; }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener('touchmove', handler);

    this.scrollElement.addEventListener('touchmove', handler);

    return () => {
      this.scrollElement.removeEventListener('touchmove', handler);
    }
  }

  /**
   * Scroll to the specified position.
   * @param {TODO} x  TODO
   * @param {TODO} y  TODO
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

  /**
   * Returns the content and scroll elements' dimensions.
   * @returns {Object} dimensions  The content and scroll elements' dimensions
   * @returns {Number} dimensions.contentHeight  content offsetHeight
   * @returns {Number} dimensions.contentTop  content offsetTop
   * @returns {Number} dimensions.contentBottom  content offsetTop+offsetHeight
   * @returns {Number} dimensions.contentWidth  content offsetWidth
   * @returns {Number} dimensions.contentLeft  content offsetLeft
   * @returns {Number} dimensions.contentRight  content offsetLeft + offsetWidth
   * @returns {Number} dimensions.scrollHeight  scroll scrollHeight
   * @returns {Number} dimensions.scrollTop  scroll scrollTop
   * @returns {Number} dimensions.scrollBottom  scroll scrollTop + scrollHeight
   * @returns {Number} dimensions.scrollWidth  scroll scrollWidth
   * @returns {Number} dimensions.scrollLeft  scroll scrollLeft
   * @returns {Number} dimensions.scrollRight  scroll scrollLeft + scrollWidth
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
  addKeyboardPadding(addPadding) {
    if (addPadding > this.scrollPadding) {
      this.scrollPadding = addPadding;
      this.scrollElement.style.paddingBottom = addPadding + 'px';
    }
  }

  /**
   * TODO
   */
  pollFocus() {
    if (hasFocusedTextInput()) {
      this.isPollingFocus = true;

      setTimeout(() => {
        this.pollFocus();
      }, 500);

    } else {
      this.isPollingFocus = false;

      if (this.scrollPadding) {
        this.scrollPadding = 0;
        this.scrollElement.style.paddingBottom = '';
      }
    }
  }

}
