import {Component, ElementRef, Optional, NgZone} from 'angular2/core';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {raf}  from '../../util/dom';
import {ViewController} from '../nav/view-controller';
import {Animation} from '../../animations/animation';
import {ScrollTo} from '../../animations/scroll-to';

/**
 * @name Content
 * @description
 * The Content component provides an easy to use content area that can be configured to use Ionic's custom Scroll View, or the built in overflow scrolling of the browser.
 *
 * While we recommend using the custom Scroll features in Ionic in most cases, sometimes (for performance reasons) only the browser's native overflow scrolling will suffice, and so we've made it easy to toggle between the Ionic scroll implementation and overflow scrolling.
 *
 * You can implement pull-to-refresh with the [Refresher](../../scroll/Refresher) component.
 *
 * @usage
 * ```html
 * <ion-content id="myContent">
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
  private _padding: number = 0;
  private _onScroll: any;
  private _scrollTo: ScrollTo;

  /**
   * @private
   */
  scrollElement: HTMLElement;

  /**
   * @param {elementRef} elementRef  A reference to the component's DOM element.
   * @param {config} config  The config object to change content's default settings.
   */
  constructor(
    private _elementRef: ElementRef,
    private _config: Config,
    private _app: IonicApp,
    private _zone: NgZone,
    @Optional() viewCtrl: ViewController
  ) {
    super(_elementRef);

    if (viewCtrl) {
      viewCtrl.setContent(this);
      viewCtrl.setContentRef(_elementRef);
    }
  }

  /**
   * @private
   */
  ngOnInit() {
    let self = this;
    self.scrollElement = self._elementRef.nativeElement.children[0];

    self._onScroll = function(ev) {
      self._app.setScrolling();
    };

    if (self._config.get('tapPolyfill') === true) {
      self._zone.runOutsideAngular(function() {
        self.scrollElement.addEventListener('scroll', self._onScroll);
      });
    }
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this.scrollElement.removeEventListener('scroll', this._onScroll);
  }

  /**
   * @private
   * Adds the specified scroll handler to the content' scroll element.
   *
   * ```ts
   * @Page({
   *   template: `<ion-content id="my-content"></ion-content>`
   * )}
   * export class MyPage{
   *    constructor(app: IonicApp){
   *        this.app = app;
   *    }
   *   // Need to wait until the component has been initialized
   *   ngAfterViewInit() {
   *     // Here 'my-content' is the ID of my ion-content
   *     this.content = this.app.getComponent('my-content');
   *     this.content.addScrollEventListener(this.myScroll);
   *   }
   *     myScroll() {
   *      console.info('They see me scrolling...');
   *    }
   * }
   * ```
   * @param {function} handler  The method you want perform when scrolling
   * @returns {function} A function that removes the scroll handler.
   */
  addScrollEventListener(handler) {
    if (!this.scrollElement) {
      return;
    }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener('scroll', handler);

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }


  /**
   * Call a method when scrolling has stopped
   *
   * @param {function} callback The method you want perform when scrolling has ended
   */
  onScrollEnd(callback) {
    let lastScrollTop = null;
    let framesUnchanged = 0;
    let _scrollEle = this.scrollElement;

    function next() {
      let currentScrollTop = _scrollEle.scrollTop;
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
   * @private
   * Adds the specified touchmove handler to the content's scroll element.
   *
   * ```ts
   * @Page({
   *   template: `<ion-content id="my-content"></ion-content>`
   * )}
   * export class MyPage{
   *    constructor(app: IonicApp){
   *        this.app = app;
   *    }
   *   // Need to wait until the component has been initialized
   *   ngAfterViewInit() {
   *     // Here 'my-content' is the ID of my ion-content
   *     this.content = this.app.getComponent('my-content');
   *     this.content.addTouchMoveListener(this.touchHandler);
   *   }
   *    touchHandler() {
   *      console.log("I'm touching all the magazines!!");
   *    }
   * }
   * ```
   * @param {function} handler  The method you want to perform when touchmove is firing
   * @returns {function} A function that removes the touchmove handler.
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
   *
   * ```ts
   * @Page({
   *   template: `<ion-content id="my-content">
   *      <button (click)="scrollTo()"> Down 500px</button>
   *   </ion-content>`
   * )}
   * export class MyPage{
   *    constructor(app: IonicApp){
   *        this.app = app;
   *    }
   *   // Need to wait until the component has been initialized
   *   ngAfterViewInit() {
   *     // Here 'my-content' is the ID of my ion-content
   *     this.content = this.app.getComponent('my-content');
   *   }
   *    scrollTo() {
   *      this.content.scrollTo(0, 500, 200);
   *    }
   * }
   * ```
   * @param {number} x  The x-value to scroll to.
   * @param {number} y  The y-value to scroll to.
   * @param {number} duration  Duration of the scroll animation in ms.
   * @param {TODO} tolerance  TODO
   * @returns {promise} Returns a promise when done
   */
  scrollTo(x: number, y: number, duration: number, tolerance?: number): Promise<any> {
    if (this._scrollTo) {
      this._scrollTo.dispose();
    }

    this._scrollTo = new ScrollTo(this.scrollElement);

    return this._scrollTo.start(x, y, duration, tolerance);
  }

  /**
   * Scroll to the specified position.
   *
   * ```ts
   * @Page({
   *   template: `<ion-content id="my-content">
   *      <button (click)="scrollTop()"> Down 500px</button>
   *   </ion-content>`
   * )}
   * export class MyPage{
   *    constructor(app: IonicApp){
   *        this.app = app;
   *    }
   *   // Need to wait until the component has been initialized
   *   ngAfterViewInit() {
   *     // Here 'my-content' is the ID of my ion-content
   *     this.content = this.app.getComponent('my-content');
   *   }
   *    scrollTop() {
   *      this.content.scrollTop();
   *    }
   * }
   * ```
   * @returns {promise} Returns a promise when done
   */
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
   * @returns {object} dimensions  The content and scroll elements' dimensions
   * {number} dimensions.contentHeight  content offsetHeight
   * {number} dimensions.contentTop  content offsetTop
   * {number} dimensions.contentBottom  content offsetTop+offsetHeight
   * {number} dimensions.contentWidth  content offsetWidth
   * {number} dimensions.contentLeft  content offsetLeft
   * {number} dimensions.contentRight  content offsetLeft + offsetWidth
   * {number} dimensions.scrollHeight  scroll scrollHeight
   * {number} dimensions.scrollTop  scroll scrollTop
   * {number} dimensions.scrollBottom  scroll scrollTop + scrollHeight
   * {number} dimensions.scrollWidth  scroll scrollWidth
   * {number} dimensions.scrollLeft  scroll scrollLeft
   * {number} dimensions.scrollRight  scroll scrollLeft + scrollWidth
   */
  getContentDimensions() {
    let _scrollEle = this.scrollElement;
    let parentElement = _scrollEle.parentElement;

    return {
      contentHeight: parentElement.offsetHeight,
      contentTop: parentElement.offsetTop,
      contentBottom: parentElement.offsetTop + parentElement.offsetHeight,

      contentWidth: parentElement.offsetWidth,
      contentLeft: parentElement.offsetLeft,
      contentRight: parentElement.offsetLeft + parentElement.offsetWidth,

      scrollHeight: _scrollEle.scrollHeight,
      scrollTop: _scrollEle.scrollTop,
      scrollBottom: _scrollEle.scrollTop + _scrollEle.scrollHeight,

      scrollWidth: _scrollEle.scrollWidth,
      scrollLeft: _scrollEle.scrollLeft,
      scrollRight: _scrollEle.scrollLeft + _scrollEle.scrollWidth,
    }
  }

  /**
   * @private
   * Adds padding to the bottom of the scroll element when the keyboard is open
   * so content below the keyboard can be scrolled into view.
   */
  addScrollPadding(newPadding) {
    if (newPadding > this._padding) {
      console.debug('content addScrollPadding', newPadding);

      this._padding = newPadding;
      this.scrollElement.style.paddingBottom = newPadding + 'px';
    }
  }

}
