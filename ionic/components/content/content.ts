import {Component, ElementRef, Optional, NgZone} from 'angular2/core';

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
export class Content {
  private _padding: number = 0;
  private _scrollEle: HTMLElement;
  private _onScroll: any;
  private _scrollTo: ScrollTo;
  
  /**
   * @param {ElementRef} elementRef  A reference to the component's DOM element.
   * @param {Config} config  The config object to change content's default settings.
   */
  constructor(
    private _elementRef: ElementRef,
    private _config: Config,
    private _app: IonicApp,
    private _zone: NgZone,
    @Optional() viewCtrl: ViewController
  ) {
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
    self._scrollEle = self._elementRef.nativeElement.children[0];

    self._onScroll = function(ev) {
      self._app.setScrolling();
    };

    if (self._config.get('tapPolyfill') === true) {
      self._zone.runOutsideAngular(function() {
        self._scrollEle.addEventListener('scroll', self._onScroll);
      });
    }
  }

  ngOnDestroy() {
    this._scrollEle.removeEventListener('scroll', this._onScroll);
  }

  /**
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
   * @param {Function} handler  The method you want perform when scrolling
   * @returns {Function} A function that removes the scroll handler.
   */
  addScrollEventListener(handler) {
    if (!this._scrollEle) { 
      return; 
    }

    // ensure we're not creating duplicates
    this._scrollEle.removeEventListener('scroll', handler);

    this._scrollEle.addEventListener('scroll', handler);

    return () => {
      this._scrollEle.removeEventListener('scroll', handler);
    }
  }

  onScrollEnd(callback) {
    let lastScrollTop = null;
    let framesUnchanged = 0;
    let _scrollEle = this._scrollEle;

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
   * @param {Function} handler  The method you want to perform when touchmove is firing
   * @returns {Function} A function that removes the touchmove handler.
   */
  addTouchMoveListener(handler) {
    if (!this._scrollEle) { return; }

    // ensure we're not creating duplicates
    this._scrollEle.removeEventListener('touchmove', handler);

    this._scrollEle.addEventListener('touchmove', handler);

    return () => {
      this._scrollEle.removeEventListener('touchmove', handler);
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
   * @param {Number} x  The x-value to scroll to.
   * @param {Number} y  The y-value to scroll to.
   * @param {Number} duration  Duration of the scroll animation in ms.
   * @param {TODO} tolerance  TODO
   * @returns {Promise} Returns a promise when done
   */
  scrollTo(x: number, y: number, duration: number, tolerance?: number): Promise<any> {
    if (this._scrollTo) {
      this._scrollTo.dispose();
    }

    this._scrollTo = new ScrollTo(this._scrollEle);

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
   * @returns {Promise} Returns a promise when done
   */
  scrollToTop() {
    if (this._scrollTo) {
      this._scrollTo.dispose();
    }

    this._scrollTo = new ScrollTo(this._scrollEle);

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
    let _scrollEle = this._scrollEle;
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
  add_padding(newPadding) {
    if (newPadding > this._padding) {
      console.debug('content add padding', newPadding);

      this._padding = newPadding;
      this._scrollEle.style.paddingBottom = newPadding + 'px';
    }
  }

}
