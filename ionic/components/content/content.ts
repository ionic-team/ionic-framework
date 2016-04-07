import {Component, ElementRef, Optional, NgZone} from 'angular2/core';

import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {raf, transitionEnd, pointerCoord}  from '../../util/dom';
import {ViewController} from '../nav/view-controller';
import {Animation} from '../../animations/animation';
import {ScrollView} from '../../util/scroll-view';

/**
 * @name Content
 * @description
 * The Content component provides an easy to use content area with some useful
 * methods to control the scrollable area.
 *
 * The content area can also implement pull-to-refresh with the
 * [Refresher](../../scroll/Refresher) component.
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
    '</scroll-content>' +
    '<ng-content select="ion-fixed"></ng-content>' +
    '<ng-content select="ion-refresher"></ng-content>'
})
export class Content extends Ion {
  private _padding: number = 0;
  private _scroll: ScrollView;
  private _scLsn: Function;

  /**
   * @private
   */
  scrollElement: HTMLElement;

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

    self._zone.runOutsideAngular(function() {
      self._scroll = new ScrollView(self.scrollElement);

      if (self._config.getBoolean('tapPolyfill')) {
        self._scLsn = self.addScrollListener(function() {
          self._app.setScrolling();
        });
      }
    });
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._scLsn && this._scLsn();
    this._scroll && this._scroll.destroy();
    this.scrollElement = this._scLsn = null;
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
   *     this.content.addScrollListener(this.myScroll);
   *   }
   *     myScroll() {
   *      console.info('They see me scrolling...');
   *    }
   * }
   * ```
   * @param {Function} handler  The method you want perform when scrolling
   * @returns {Function} A function that removes the scroll handler.
   */
  addScrollListener(handler) {
    return this._addListener('scroll', handler);
  }

  /**
   * @private
   */
  addTouchStartListener(handler) {
    return this._addListener('touchstart', handler);
  }

  /**
   * @private
   */
  addTouchMoveListener(handler) {
    return this._addListener('touchmove', handler);
  }

  /**
   * @private
   */
  addTouchEndListener(handler) {
    return this._addListener('touchend', handler);
  }

  /**
   * @private
   */
  addMouseDownListener(handler) {
    return this._addListener('mousedown', handler);
  }

  /**
   * @private
   */
  addMouseUpListener(handler) {
    return this._addListener('mouseup', handler);
  }

  /**
   * @private
   */
  addMouseMoveListener(handler) {
    return this._addListener('mousemove', handler);
  }

  private _addListener(type: string, handler: any): Function {
    if (!this.scrollElement) { return; }

    // ensure we're not creating duplicates
    this.scrollElement.removeEventListener(type, handler);
    this.scrollElement.addEventListener(type, handler);

    return () => {
      if (!this.scrollElement) { return; }
      this.scrollElement.removeEventListener(type, handler);
    };
  }

  /**
   * @private
   * Call a method when scrolling has stopped
   * @param {Function} callback The method you want perform when scrolling has ended
   */
  onScrollEnd(callback: Function) {
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

  onScrollElementTransitionEnd(callback: Function) {
    transitionEnd(this.scrollElement, callback);
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
   * @returns {Promise} Returns a promise when done
   */
  scrollTo(x: number, y: number, duration: number): Promise<any> {
    return this._scroll.scrollTo(x, y, duration);
  }

  /**
   * Scroll to the top of the content component.
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
   *      this.content.scrollToTop();
   *    }
   * }
   * ```
   * @returns {Promise} Returns a promise when done
   */
  scrollToTop(duration: number = 300) {
    return this.scrollTo(0, 0, duration);
  }

  /**
   * @private
   */
  jsScroll(onScrollCallback: Function): Function {
    return this._scroll.jsScroll(onScrollCallback);
  }

  /**
   * @private
   */
  getScrollTop(): number {
    return this._scroll.getTop();
  }

  /**
   * @private
   */
  setScrollTop(top: number) {
    this._scroll.setTop(top);
  }

  /**
   * @private
   */
  addCssClass(className: string) {
    this.getNativeElement().classList.add(className);
  }

  /**
   * @private
   */
  removeCssClass(className: string) {
    this.getNativeElement().classList.remove(className);
  }

  /**
   * @private
   */
  setScrollElementStyle(prop: string, val: any) {
    this.scrollElement.style[prop] = val;
  }

  /**
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
    };
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
