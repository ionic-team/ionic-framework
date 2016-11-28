import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, Optional, Renderer, ViewEncapsulation } from '@angular/core';

import { App } from '../app/app';
import { Ion } from '../ion';
import { Config } from '../../config/config';
import { Keyboard } from '../../util/keyboard';
import { nativeRaf, nativeTimeout, transitionEnd } from '../../util/dom';
import { ScrollView } from '../../util/scroll-view';
import { Tabs } from '../tabs/tabs';
import { ViewController } from '../../navigation/view-controller';
import { isTrueProperty, assert } from '../../util/util';


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
 * import { Component, ViewChild } from '@angular/core';
 * import { Content } from 'ionic-angular';
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
 * @advanced
 *
 * Resizing the content
 *
 *
 * ```ts
 * @Component({
 *   template: `
 *     <ion-header>
 *       <ion-navbar>
 *         <ion-title>Main Navbar</ion-title>
 *       </ion-navbar>
 *       <ion-toolbar *ngIf="showToolbar">
 *         <ion-title>Dynamic Toolbar</ion-title>
 *       </ion-toolbar>
 *     </ion-header>
 *     <ion-content>
 *       <button ion-button (click)="toggleToolbar()">Toggle Toolbar</button>
 *     </ion-content>
 * `})
 *
 * class E2EPage {
 *   @ViewChild(Content) content: Content;
 *   showToolbar: boolean = false;
 *
 *   toggleToolbar() {
 *     this.showToolbar = !this.showToolbar;
 *     this.content.resize();
 *   }
 * }
 * ```
 *
 *
 * Scroll to a specific position
 *
 * ```ts
 * import { Component, ViewChild } from '@angular/core';
 * import { Content } from 'ionic-angular';
 *
 * @Component({
 *   template: `<ion-content>
 *                <button ion-button (click)="scrollTo()">Down 500px</button>
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
 *
 */
@Component({
  selector: 'ion-content',
  template:
    '<div class="fixed-content">' +
      '<ng-content select="[ion-fixed],ion-fab"></ng-content>' +
    '</div>' +
    '<div class="scroll-content">' +
      '<ng-content></ng-content>' +
    '</div>' +
    '<ng-content select="ion-refresher"></ng-content>',
  host: {
    '[class.statusbar-padding]': '_sbPadding'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class Content extends Ion {
  _paddingTop: number;
  _paddingRight: number;
  _paddingBottom: number;
  _paddingLeft: number;
  _scrollPadding: number = 0;
  _headerHeight: number;
  _footerHeight: number;
  _tabbarHeight: number;
  _tabsPlacement: string;
  _inputPolling: boolean = false;
  _scroll: ScrollView;
  _scLsn: Function;
  _sbPadding: boolean;
  _fullscreen: boolean;
  _footerEle: HTMLElement;

  /*
   * @private
   */
  _scrollEle: HTMLElement;

  /*
   * @private
   */
  _fixedEle: HTMLElement;

  /**
   * A number representing how many pixels the top of the content has been
   * adjusted, which could be by either padding or margin.
   */
  contentTop: number;

  /**
   * A number representing how many pixels the bottom of the content has been
   * adjusted, which could be by either padding or margin.
   */
  contentBottom: number;

  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    public _app: App,
    public _keyboard: Keyboard,
    public _zone: NgZone,
    @Optional() viewCtrl: ViewController,
    @Optional() public _tabs: Tabs
  ) {
    super(config, elementRef, renderer, 'content');

    this._sbPadding = config.getBoolean('statusbarPadding', false);

    if (viewCtrl) {
      viewCtrl._setIONContent(this);
      viewCtrl._setIONContentRef(elementRef);
    }
  }

  /**
   * @private
   */
  ngOnInit() {
    let children = this._elementRef.nativeElement.children;
    assert(children && children.length >= 2, 'content needs at least two children');

    this._fixedEle = children[0];
    this._scrollEle = children[1];

    this._zone.runOutsideAngular(() => {
      this._scroll = new ScrollView(this._scrollEle);
      this._scLsn = this.addScrollListener(this._app.setScrolling.bind(this._app));
    });
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._scLsn && this._scLsn();
    this._scroll && this._scroll.destroy();
    this._scrollEle = this._footerEle = this._scLsn = this._scroll = null;
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

  /**
   * @private
   */
  _addListener(type: string, handler: any): Function {
    assert(handler, 'handler must be valid');
    assert(this._scrollEle, '_scrollEle must be valid');

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
   * @param {number} x  The x-value to scroll to.
   * @param {number} y  The y-value to scroll to.
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  scrollTo(x: number, y: number, duration: number = 300, done?: Function): Promise<any> {
    console.debug(`content, scrollTo started, y: ${y}, duration: ${duration}`);
    return this._scroll.scrollTo(x, y, duration, done);
  }

  /**
   * Scroll to the top of the content component.
   *
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  scrollToTop(duration: number = 300) {
    console.debug(`content, scrollToTop, duration: ${duration}`);
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
    console.debug(`content, setScrollTop, top: ${top}`);
    this._scroll.setTop(top);
  }

  /**
   * Scroll to the bottom of the content component.
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  scrollToBottom(duration: number = 300) {
    console.debug(`content, scrollToBottom, duration: ${duration}`);
    return this._scroll.scrollToBottom(duration);
  }

  /**
   * @private
   */
  jsScroll(onScrollCallback: Function): Function {
    return this._scroll.jsScroll(onScrollCallback);
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
  setScrollElementStyle(prop: string, val: any) {
    (<any>this._scrollEle.style)[prop] = val;
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
  getContentDimensions(): ContentDimensions {
    const scrollEle = this._scrollEle;
    const parentElement = scrollEle.parentElement;

    return {
      contentHeight: parentElement.offsetHeight - this.contentTop - this.contentBottom,
      contentTop: this.contentTop,
      contentBottom: this.contentBottom,

      contentWidth: parentElement.offsetWidth,
      contentLeft: parentElement.offsetLeft,

      scrollHeight: scrollEle.scrollHeight,
      scrollTop: scrollEle.scrollTop,

      scrollWidth: scrollEle.scrollWidth,
      scrollLeft: scrollEle.scrollLeft,
    };
  }

  /**
   * @private
   * DOM WRITE
   * Adds padding to the bottom of the scroll element when the keyboard is open
   * so content below the keyboard can be scrolled into view.
   */
  addScrollPadding(newPadding: number) {
    assert(typeof this._scrollPadding === 'number', '_scrollPadding must be a number');
    if (newPadding > this._scrollPadding) {
      console.debug(`content, addScrollPadding, newPadding: ${newPadding}, this._scrollPadding: ${this._scrollPadding}`);

      this._scrollPadding = newPadding;
      this._scrollEle.style.paddingBottom = (newPadding > 0) ? newPadding + 'px' : '';
    }
  }

  /**
   * @private
   * DOM WRITE
   */
  clearScrollPaddingFocusOut() {
    if (!this._inputPolling) {
      console.debug(`content, clearScrollPaddingFocusOut begin`);
      this._inputPolling = true;

      this._keyboard.onClose(() => {
        console.debug(`content, clearScrollPaddingFocusOut _keyboard.onClose`);
        this._inputPolling = false;
        this._scrollPadding = -1;
        this.addScrollPadding(0);
      }, 200, 3000);
    }
  }

  /**
   * Tell the content to recalculate its dimensions. This should be called
   * after dynamically adding headers, footers, or tabs.
   *
   */
  resize() {
    nativeRaf(() => {
      this.readDimensions();
      this.writeDimensions();
    });
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
    this._tabsPlacement = null;

    let ele: HTMLElement = this._elementRef.nativeElement;
    if (!ele) {
      assert(false, 'ele should be valid');
      return;
    }

    let computedStyle: any;
    let tagName: string;
    let parentEle: HTMLElement = ele.parentElement;
    let children = parentEle.children;
    for (var i = children.length - 1; i >= 0; i--) {
      ele = <HTMLElement>children[i];
      tagName = ele.tagName;
      if (tagName === 'ION-CONTENT') {
        if (this._fullscreen) {
          computedStyle = getComputedStyle(ele);
          this._paddingTop = parsePxUnit(computedStyle.paddingTop);
          this._paddingBottom = parsePxUnit(computedStyle.paddingBottom);
          this._paddingRight = parsePxUnit(computedStyle.paddingRight);
          this._paddingLeft = parsePxUnit(computedStyle.paddingLeft);
        }

      } else if (tagName === 'ION-HEADER') {
        this._headerHeight = ele.clientHeight;

      } else if (tagName === 'ION-FOOTER') {
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

        if (this._tabsPlacement === null) {
          // this is the first tabbar found, remember it's position
          this._tabsPlacement = ele.getAttribute('tabsplacement');
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

    let scrollEle = this._scrollEle as any;
    if (!scrollEle) {
      assert(false, 'this._scrollEle should be valid');
      return;
    }

    let fixedEle = this._fixedEle;
    if (!fixedEle) {
      assert(false, 'this._fixedEle should be valid');
      return;
    }

    // Toolbar height
    let contentTop = this._headerHeight;
    let contentBottom = this._footerHeight;

    // Tabs height
    if (this._tabsPlacement === 'top') {
      assert(this._tabbarHeight >= 0, '_tabbarHeight has to be positive');
      contentTop += this._tabbarHeight;

    } else if (this._tabsPlacement === 'bottom') {
      assert(this._tabbarHeight >= 0, '_tabbarHeight has to be positive');
      contentBottom += this._tabbarHeight;

      // Update footer position
      if (contentBottom > 0 && this._footerEle) {
        let footerPos = contentBottom - this._footerHeight;
        assert(footerPos >= 0, 'footerPos has to be positive');

        this._footerEle.style.bottom = cssFormat(footerPos);
      }
    }

    // Handle fullscreen viewport (padding vs margin)
    let topProperty = 'marginTop';
    let bottomProperty = 'marginBottom';
    let fixedTop: number = contentTop;
    let fixedBottom: number = contentBottom;
    if (this._fullscreen) {
      assert(this._paddingTop >= 0, '_paddingTop has to be positive');
      assert(this._paddingBottom >= 0, '_paddingBottom has to be positive');

      // adjust the content with padding, allowing content to scroll under headers/footers
      // however, on iOS you cannot control the margins of the scrollbar (last tested iOS9.2)
      // only add inline padding styles if the computed padding value, which would
      // have come from the app's css, is different than the new padding value
      contentTop += this._paddingTop;
      contentBottom += this._paddingBottom;
      topProperty = 'paddingTop';
      bottomProperty = 'paddingBottom';
    }

    // Only update top margin if value changed
    if (contentTop !== this.contentTop) {
      assert(contentTop >= 0, 'contentTop has to be positive');
      assert(fixedTop >= 0, 'fixedTop has to be positive');

      scrollEle.style[topProperty] = cssFormat(contentTop);
      fixedEle.style.marginTop = cssFormat(fixedTop);
      this.contentTop = contentTop;
    }

    // Only update bottom margin if value changed
    if (contentBottom !== this.contentBottom) {
      assert(contentBottom >= 0, 'contentBottom has to be positive');
      assert(fixedBottom >= 0, 'fixedBottom has to be positive');

      scrollEle.style[bottomProperty] = cssFormat(contentBottom);
      fixedEle.style.marginBottom = cssFormat(fixedBottom);
      this.contentBottom = contentBottom;
    }

    if (this._tabsPlacement !== null && this._tabs) {
      // set the position of the tabbar
      if (this._tabsPlacement === 'top') {
        this._tabs.setTabbarPosition(this._headerHeight, -1);

      } else {
        assert(this._tabsPlacement === 'bottom', 'tabsPlacement should be bottom');
        this._tabs.setTabbarPosition(-1, 0);
      }
    }
  }

}

function parsePxUnit(val: string): number {
  return (val.indexOf('px') > 0) ? parseInt(val, 10) : 0;
}

function cssFormat(val: number): string {
  return (val > 0 ? val + 'px' : '');
}

export interface ContentDimensions {
  contentHeight: number;
  contentTop: number;
  contentBottom: number;

  contentWidth: number;
  contentLeft: number;

  scrollHeight: number;
  scrollTop: number;

  scrollWidth: number;
  scrollLeft: number;
}
