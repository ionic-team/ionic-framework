import {ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, Optional, ViewEncapsulation} from '@angular/core';

import {App} from '../app/app';
import {Ion} from '../ion';
import {Config} from '../../config/config';
import {Keyboard} from '../../util/keyboard';
import {nativeRaf, nativeTimeout, transitionEnd}  from '../../util/dom';
import {ScrollView} from '../../util/scroll-view';
import {Tabs} from '../tabs/tabs';
import {ViewController} from '../nav/view-controller';
import {isTrueProperty} from '../../util/util';


/**
 * @name Content
 * @description
 * The Content component provides an easy to use content area with
 * some useful methods to control the scrollable area.
 *
 * The content area can also implement pull-to-refresh with the
 * [Refresher](../../refresher/Refresher) component.
 *
 * @usage
 * ```html
 * <ion-content>
 *   Add your content here!
 * </ion-content>
 * ```
 *
 * To get a reference to the content component from a Page's logic,
 * you can use Angular's `@ViewChild` annotation:
 *
 * ```ts
 * import {Component, ViewChild} from '@angular/core';
 * import {Content} from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage{
 *   @ViewChild(Content) content: Content;
 *
 *   scrollToTop() {
 *     this.content.scrollToTop();
 *   }
 * }
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
    '<ng-content select="ion-refresher"></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.statusbar-padding]': '_sbPadding'
  }
})
export class Content extends Ion {
  private _paddingTop: number;
  private _paddingRight: number;
  private _paddingBottom: number;
  private _paddingLeft: number;
  private _scrollPadding: number;
  private _headerHeight: number;
  private _footerHeight: number;
  private _tabbarHeight: number;
  private _tabbarPlacement: string;
  private _inputPolling: boolean = false;
  private _scroll: ScrollView;
  private _scLsn: Function;
  private _sbPadding: boolean;
  private _fullscreen: boolean;
  private _scrollEle: HTMLElement;
  private _footerEle: HTMLElement;

  /**
   * @private
   */
  adjustedTop: number;

  /**
   * @private
   */
  adjustedBottom: number;

  constructor(
    private _elementRef: ElementRef,
    private _config: Config,
    private _app: App,
    private _keyboard: Keyboard,
    private _zone: NgZone,
    @Optional() viewCtrl: ViewController,
    @Optional() private _tabs: Tabs
  ) {
    super(_elementRef);
    this._sbPadding = _config.getBoolean('statusbarPadding', false);

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

    self._zone.runOutsideAngular(function() {
      self._scroll = new ScrollView(self._scrollEle);

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
    this._scrollEle = this._footerEle = this._scLsn = null;
  }

  /**
   * @private
   */
  addScrollListener(handler: any) {
    return this._addListener('scroll', handler);
  }

  /**
   * @private
   */
  addTouchStartListener(handler: any) {
    return this._addListener('touchstart', handler);
  }

  /**
   * @private
   */
  addTouchMoveListener(handler: any) {
    return this._addListener('touchmove', handler);
  }

  /**
   * @private
   */
  addTouchEndListener(handler: any) {
    return this._addListener('touchend', handler);
  }

  /**
   * @private
   */
  addMouseDownListener(handler: any) {
    return this._addListener('mousedown', handler);
  }

  /**
   * @private
   */
  addMouseUpListener(handler: any) {
    return this._addListener('mouseup', handler);
  }

  /**
   * @private
   */
  addMouseMoveListener(handler: any) {
    return this._addListener('mousemove', handler);
  }

  private _addListener(type: string, handler: any): Function {
    if (!this._scrollEle) { return; }

    // ensure we're not creating duplicates
    this._scrollEle.removeEventListener(type, handler);
    this._scrollEle.addEventListener(type, handler);

    return () => {
      if (this._scrollEle) {
        this._scrollEle.removeEventListener(type, handler);
      }
    };
  }

  /**
   * @private
   */
  getScrollElement(): HTMLElement {
    return this._scrollEle;
  }

  /**
   * @private
   * Call a method when scrolling has stopped
   * @param {Function} callback The method you want perform when scrolling has ended
   */
  onScrollEnd(callback: Function) {
    let lastScrollTop: number = null;
    let framesUnchanged: number = 0;
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

      nativeRaf(() => {
        nativeRaf(next);
      });
    }

    nativeTimeout(next, 100);
  }

  /**
   * @private
   */
  onScrollElementTransitionEnd(callback: Function) {
    transitionEnd(this._scrollEle, callback);
  }

  /**
   * Scroll to the specified position.
   *
   * ```ts
   * import {Component, ViewChild} from '@angular/core';
   * import {Content} from 'ionic-angular';
   *
   * @Component({
   *   template: `<ion-content>
   *                <button (click)="scrollTo()">Down 500px</button>
   *              </ion-content>`
   * )}
   * export class MyPage{
   *   @ViewChild(Content) content: Content;
   *
   *   scrollTo() {
   *     // set the scrollLeft to 0px, and scrollTop to 500px
   *     // the scroll duration should take 200ms
   *     this.content.scrollTo(0, 500, 200);
   *   }
   * }
   * ```
   * @param {number} x  The x-value to scroll to.
   * @param {number} y  The y-value to scroll to.
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  scrollTo(x: number, y: number, duration: number = 300): Promise<any> {
    return this._scroll.scrollTo(x, y, duration);
  }

  /**
   * Scroll to the top of the content component.
   *
   * ```ts
   * import {Component, ViewChild} from '@angular/core';
   * import {Content} from 'ionic-angular';
   *
   * @Component({
   *   template: `<ion-content>
   *                <button (click)="scrollToTop()">Scroll to top</button>
   *              </ion-content>`
   * )}
   * export class MyPage{
   *   @ViewChild(Content) content: Content;
   *
   *   scrollToTop() {
   *     this.content.scrollToTop();
   *   }
   * }
   * ```
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  scrollToTop(duration: number = 300) {
    return this._scroll.scrollToTop(duration);
  }

  /**
   * Get the `scrollTop` property of the content's scrollable element.
   * @returns {number}
   */
  getScrollTop(): number {
    return this._scroll.getTop();
  }

  /**
   * Set the `scrollTop` property of the content's scrollable element.
   * @param {number} top
   */
  setScrollTop(top: number) {
    this._scroll.setTop(top);
  }

  /**
   * Scroll to the bottom of the content component.
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  scrollToBottom(duration: number = 300) {
    return this._scroll.scrollToBottom(duration);
  }

  /**
   * @private
   */
  jsScroll(onScrollCallback: Function): Function {
    return this._scroll.jsScroll(onScrollCallback);
  }

  /**
   * @private
   * DOM WRITE
   */
  addCssClass(className: string) {
    this.getNativeElement().classList.add(className);
  }

  /**
   * @input {boolean} By default, content is positioned between the headers
   * and footers. However, using `fullscreen="true"`, the content will be
   * able to scroll "under" the headers and footers. At first glance the
   * fullscreen option may not look any different than the default, however,
   * by adding a transparency effect to a header then the content can be
   * seen under the header as the user scrolls.
   */
  @Input()
  get fullscreen(): boolean {
    return !!this._fullscreen;
  }
  set fullscreen(val: boolean) {
    this._fullscreen = isTrueProperty(val);
  }

  /**
   * @private
   * DOM WRITE
   */
  removeCssClass(className: string) {
    this.getNativeElement().classList.remove(className);
  }

  /**
   * @private
   * DOM WRITE
   */
  setScrollElementStyle(prop: string, val: any) {
    this._scrollEle.style[prop] = val;
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
    };
  }

  /**
   * @private
   * DOM WRITE
   * Adds padding to the bottom of the scroll element when the keyboard is open
   * so content below the keyboard can be scrolled into view.
   */
  addScrollPadding(newPadding: number) {
    if (newPadding > this._scrollPadding) {
      console.debug('content addScrollPadding', newPadding);

      this._scrollPadding = newPadding;
      this._scrollEle.style.paddingBottom = newPadding + 'px';
    }
  }

  /**
   * @private
   * DOM WRITE
   */
  clearScrollPaddingFocusOut() {
    if (!this._inputPolling) {
      this._inputPolling = true;

      this._keyboard.onClose(() => {
        this._scrollPadding = 0;
        this._scrollEle.style.paddingBottom = (this._paddingBottom > 0 ? this._paddingBottom + 'px' : '');
        this._inputPolling = false;
        this.addScrollPadding(0);
      }, 200, Infinity);
    }
  }

  /**
   * @private
   * DOM READ
   */
  readDimensions() {
    this._paddingTop = 0;
    this._paddingRight = 0;
    this._paddingBottom = 0;
    this._paddingLeft = 0;
    this._headerHeight = 0;
    this._footerHeight = 0;
    this._tabbarPlacement = null;

    let ele: HTMLElement = this._elementRef.nativeElement;
    let parentEle: HTMLElement = ele.parentElement;
    let computedStyle: any;

    for (var i = 0; i < parentEle.children.length; i++) {
      ele = <HTMLElement>parentEle.children[i];

      if (ele.tagName === 'ION-CONTENT') {
        if (this._fullscreen) {
          computedStyle = getComputedStyle(ele);
          this._paddingTop = parsePxUnit(computedStyle.paddingTop);
          this._paddingBottom = parsePxUnit(computedStyle.paddingBottom);
          this._paddingRight = parsePxUnit(computedStyle.paddingRight);
          this._paddingLeft = parsePxUnit(computedStyle.paddingLeft);
        }

      } else if (ele.tagName === 'ION-HEADER') {
        this._headerHeight = ele.clientHeight;

      } else if (ele.tagName === 'ION-FOOTER') {
        this._footerHeight = ele.clientHeight;
        this._footerEle = ele;
      }
    }

    ele = parentEle;
    let tabbarEle: HTMLElement;

    while (ele && ele.tagName !== 'ION-MODAL' && !ele.classList.contains('tab-subpage')) {

      if (ele.tagName === 'ION-TABS') {
        tabbarEle = <HTMLElement>ele.firstElementChild;
        this._tabbarHeight = tabbarEle.clientHeight;

        if (this._tabbarPlacement === null) {
          // this is the first tabbar found, remember it's position
          this._tabbarPlacement = ele.getAttribute('tabbarplacement');
        }
      }

      ele = ele.parentElement;
    }
  }

  /**
   * @private
   * DOM WRITE
   */
  writeDimensions() {
    let newVal: number;
    let scrollEle = this._scrollEle;

    // only write when it has changed
    if (this._fullscreen) {
      // adjust the content with padding, allowing content to scroll under headers/footers
      // however, on iOS you cannot control the margins of the scrollbar (last tested iOS9.2)
      // only add inline padding styles if the computed padding value, which would
      // have come from the app's css, is different than the new padding value

      newVal = this._headerHeight + this._paddingTop;
      if (this._tabbarPlacement === 'top') {
        newVal += this._tabbarHeight;
      }
      if (newVal !== this.adjustedTop) {
        scrollEle.style.paddingTop = (newVal > 0 ? newVal + 'px' : '');
        this.adjustedTop = newVal;
      }

      newVal = this._footerHeight + this._paddingBottom;
      if (this._tabbarPlacement === 'bottom') {
        newVal += this._tabbarHeight;
      }
      if (newVal !== this.adjustedBottom) {
        scrollEle.style.paddingBottom = (newVal > 0 ? newVal + 'px' : '');
        this.adjustedBottom = newVal;

        if (newVal > 0 && this._footerEle) {
          this._footerEle.style.bottom = (newVal - this._footerHeight) + 'px';
        }
      }

    } else {
      // adjust the content with margins
      newVal = this._headerHeight;
      if (this._tabbarPlacement === 'top') {
        newVal += this._tabbarHeight;
      }
      if (newVal !== this.adjustedTop) {
        scrollEle.style.marginTop = (newVal > 0 ? newVal + 'px' : '');
        this.adjustedTop = newVal;
      }

      newVal = this._footerHeight;
      if (this._tabbarPlacement === 'bottom') {
        newVal += this._tabbarHeight;
      }
      if (newVal !== this.adjustedBottom) {
        scrollEle.style.marginBottom = (newVal > 0 ? newVal + 'px' : '');
        this.adjustedBottom = newVal;

        if (newVal > 0 && this._footerEle) {
          this._footerEle.style.bottom = (newVal - this._footerHeight) + 'px';
        }
      }
    }


    if (this._tabbarPlacement !== null && this._tabs) {
      // set the position of the tabbar
      if (this._tabbarPlacement === 'top') {
        this._tabs.setTabbarPosition(this._headerHeight, -1);

      } else {
        this._tabs.setTabbarPosition(-1, 0);
      }
    }
  }

}

function parsePxUnit(val: string): number {
  return (val.indexOf('px') > 0) ? parseInt(val, 10) : 0;
}
