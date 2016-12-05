import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, AfterViewInit, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { DomController } from '../../util/dom-controller';
import { eventOptions } from '../../util/ui-event-manager';
import { Img } from '../img/img';
import { Ion } from '../ion';
import { isTrueProperty, assert, removeArrayItem } from '../../util/util';
import { Keyboard } from '../../util/keyboard';
import { ScrollView, ScrollDirection } from '../../util/scroll-view';
import { Tabs } from '../tabs/tabs';
import { transitionEnd } from '../../util/dom';
import { ViewController } from '../../navigation/view-controller';

export { ScrollEvent, ScrollDirection } from '../../util/scroll-view';


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
export class Content extends Ion implements AfterViewInit, OnDestroy {
  /*  @private */
  _sbPadding: boolean;

  /*  @internal */
  _cTop: number;
  /*  @internal */
  _cBottom: number;
  /*  @internal */
  _pTop: number;
  /*  @internal */
  _pRight: number;
  /*  @internal */
  _pBottom: number;
  /*  @internal */
  _pLeft: number;
  /*  @internal */
  _scrollPadding: number = 0;
  /*  @internal */
  _hdrHeight: number;
  /*  @internal */
  _ftrHeight: number;
  /*  @internal */
  _tabbarHeight: number;
  /*  @internal */
  _tabsPlacement: string;
  /*  @internal */
  _inputPolling: boolean = false;
  /*  @internal */
  _scroll: ScrollView;
  /*  @internal */
  _scLsn: Function;
  /*  @internal */
  _fullscreen: boolean;
  /*  @internal */
  _lazyLoadImages: boolean = true;
  /*  @internal */
  _imgs: Img[] = [];
  /*  @internal */
  _footerEle: HTMLElement;
  /*  @internal */
  _dirty: boolean;
  /*  @internal */
  _scrollEle: HTMLElement;
  /*  @internal */
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

  /**
   * The height the content, including content not visible
   * on the screen due to overflow.
   */
  scrollHeight: number = 0;

  /**
   * The width the content, including content not visible
   * on the screen due to overflow.
   */
  scrollWidth: number = 0;


  /**
   * The distance of the content's top to its topmost visible content.
   */
  get scrollTop(): number {
    return this._scroll.getTop();
  }
  set scrollTop(top: number) {
    this._scroll.setTop(top);
  }

  /**
   * The distance of the content's left to its leftmost visible content.
   */
  get scrollLeft(): number {
    return this._scroll.getLeft();
  }
  set scrollLeft(top: number) {
    this._scroll.setLeft(top);
  }

  /**
   * If the scrollable area is actively scrolling or not.
   */
  get isScrolling(): boolean {
    return this._scroll.isScrolling;
  }

  /**
   * The current vertical scroll velocity.
   */
  get velocityY(): number {
    return this._scroll.ev.velocityY || 0;
  }

  /**
   * The current horizontal scroll velocity.
   */
  get velocityX(): number {
    return this._scroll.ev.velocityX || 0;
  }

  /**
   * The current, or last known, vertical scroll direction.
   */
  get directionY(): ScrollDirection {
    return this._scroll.ev.directionY;
  }

  /**
   * The current, or last known, horizontal scroll direction.
   */
  get directionX(): ScrollDirection {
    return this._scroll.ev.directionX;
  }

  /**
   * @private
   */
  @Output() ionScrollStart: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @private
   */
  @Output() ionScroll: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @private
   */
  @Output() ionScrollEnd: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @private
   */
  @Output() readReady: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @private
   */
  @Output() writeReady: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    public _app: App,
    public _keyboard: Keyboard,
    public _zone: NgZone,
    @Optional() viewCtrl: ViewController,
    @Optional() public _tabs: Tabs,
    private _dom: DomController
  ) {
    super(config, elementRef, renderer, 'content');

    this._sbPadding = config.getBoolean('statusbarPadding', false);

    if (viewCtrl) {
      viewCtrl._setIONContent(this);
      viewCtrl._setIONContentRef(elementRef);
    }

    this._scroll = new ScrollView(_dom);
  }

  /**
   * @private
   */
  ngAfterViewInit() {
    if (this._scrollEle) return;

    const children = this._elementRef.nativeElement.children;
    assert(children && children.length >= 2, 'content needs at least two children');

    this._fixedEle = children[0];
    this._scrollEle = children[1];

    // subscribe to the scroll start
    this._scroll.scrollStart.subscribe(ev => {
      this.ionScrollStart.emit(ev);
    });

    // subscribe to every scroll move
    this._scroll.scroll.subscribe(ev => {
      // remind the app that it's currently scrolling
      this._app.setScrolling(ev.timeStamp);

      // emit to all of our other friends things be scrolling
      this.ionScroll.emit(ev);

      this.imgsRefresh();
    });

    // subscribe to the scroll end
    this._scroll.scrollEnd.subscribe(ev => {
      this.ionScrollEnd.emit(ev);

      this.imgsRefresh();
    });
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._scLsn && this._scLsn();
    this._scroll && this._scroll.destroy();
    this._scrollEle = this._fixedEle = this._footerEle = this._scLsn = this._scroll = null;
  }

  /**
   * @private
   */
  addTouchStartListener(handler: any) {
    return this._addListener('touchstart', handler, false);
  }

  /**
   * @private
   */
  addTouchMoveListener(handler: any) {
    return this._addListener('touchmove', handler, true);
  }

  /**
   * @private
   */
  addTouchEndListener(handler: any) {
    return this._addListener('touchend', handler, false);
  }

  /**
   * @private
   */
  addMouseDownListener(handler: any) {
    return this._addListener('mousedown', handler, false);
  }

  /**
   * @private
   */
  addMouseUpListener(handler: any) {
    return this._addListener('mouseup', handler, false);
  }

  /**
   * @private
   */
  addMouseMoveListener(handler: any) {
    return this._addListener('mousemove', handler, true);
  }

  /**
   * @private
   */
  _addListener(type: string, handler: any, usePassive: boolean): Function {
    assert(handler, 'handler must be valid');
    assert(this._scrollEle, '_scrollEle must be valid');

    const opts = eventOptions(false, usePassive);

    // ensure we're not creating duplicates
    this._scrollEle.removeEventListener(type, handler, opts);
    this._scrollEle.addEventListener(type, handler, opts);

    return () => {
      if (this._scrollEle) {
        this._scrollEle.removeEventListener(type, handler, opts);
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
  enableJsScroll() {
    this._scroll.enableJsScroll(this.contentTop, this.contentBottom);
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
   */
  @Input()
  get lazyLoadImages(): boolean {
    return !!this._lazyLoadImages;
  }
  set lazyLoadImages(val: boolean) {
    this._lazyLoadImages = isTrueProperty(val);
  }

  /**
   * @private
   */
  addImg(img: Img) {
    this._imgs.push(img);
  }

  /**
   * @private
   */
  removeImg(img: Img) {
    removeArrayItem(this._imgs, img);
  }

  /**
   * @private
   */

  /**
   * @private
   * DOM WRITE
   */
  setScrollElementStyle(prop: string, val: any) {
    this._dom.write(() => {
      (<any>this._scrollEle.style)[prop] = val;
    });
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
      this._dom.write(() => {
        this._scrollEle.style.paddingBottom = (newPadding > 0) ? newPadding + 'px' : '';
      });
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
   */
  resize() {
    this._dom.read(this.readDimensions, this);
    this._dom.write(this.writeDimensions, this);
  }

  /**
   * @private
   * DOM READ
   */
  readDimensions() {
    let cachePaddingTop = this._pTop;
    let cachePaddingRight = this._pRight;
    let cachePaddingBottom = this._pBottom;
    let cachePaddingLeft = this._pLeft;
    let cacheHeaderHeight = this._hdrHeight;
    let cacheFooterHeight = this._ftrHeight;
    let cacheTabsPlacement = this._tabsPlacement;

    this.scrollWidth = 0;
    this.scrollHeight = 0;
    this._pTop = 0;
    this._pRight = 0;
    this._pBottom = 0;
    this._pLeft = 0;
    this._hdrHeight = 0;
    this._ftrHeight = 0;
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
        // ******** DOM READ ****************
        this.scrollWidth = ele.scrollWidth;
        // ******** DOM READ ****************
        this.scrollHeight = ele.scrollHeight;

        if (this._fullscreen) {
          // ******** DOM READ ****************
          computedStyle = getComputedStyle(ele);
          this._pTop = parsePxUnit(computedStyle.paddingTop);
          this._pBottom = parsePxUnit(computedStyle.paddingBottom);
          this._pRight = parsePxUnit(computedStyle.paddingRight);
          this._pLeft = parsePxUnit(computedStyle.paddingLeft);
        }

      } else if (tagName === 'ION-HEADER') {
        // ******** DOM READ ****************
        this._hdrHeight = ele.clientHeight;

      } else if (tagName === 'ION-FOOTER') {
        // ******** DOM READ ****************
        this._ftrHeight = ele.clientHeight;
        this._footerEle = ele;
      }
    }

    ele = parentEle;
    let tabbarEle: HTMLElement;

    while (ele && ele.tagName !== 'ION-MODAL' && !ele.classList.contains('tab-subpage')) {

      if (ele.tagName === 'ION-TABS') {
        tabbarEle = <HTMLElement>ele.firstElementChild;
        // ******** DOM READ ****************
        this._tabbarHeight = tabbarEle.clientHeight;

        if (this._tabsPlacement === null) {
          // this is the first tabbar found, remember it's position
          this._tabsPlacement = ele.getAttribute('tabsplacement');
        }
      }

      ele = ele.parentElement;
    }

    // Toolbar height
    this._cTop = this._hdrHeight;
    this._cBottom = this._ftrHeight;

    // Tabs height
    if (this._tabsPlacement === 'top') {
      this._cTop += this._tabbarHeight;

    } else if (this._tabsPlacement === 'bottom') {
      this._cBottom += this._tabbarHeight;
    }

    // Handle fullscreen viewport (padding vs margin)
    if (this._fullscreen) {
      this._cTop += this._pTop;
      this._cBottom += this._pBottom;
    }

    this._dirty = (
      cachePaddingTop !== this._pTop ||
      cachePaddingBottom !== this._pBottom ||
      cachePaddingLeft !== this._pLeft ||
      cachePaddingRight !== this._pRight ||
      cacheHeaderHeight !== this._hdrHeight ||
      cacheFooterHeight !== this._ftrHeight ||
      cacheTabsPlacement !== this._tabsPlacement ||
      this._cTop !== this.contentTop ||
      this._cBottom !== this.contentBottom
    );

    this._scroll.init(this._scrollEle, this._cTop, this._cBottom);

    // initial imgs refresh
    this.imgsRefresh();

    this.readReady.emit();
  }

  /**
   * @private
   * DOM WRITE
   */
  writeDimensions() {
    if (!this._dirty) {
      console.debug('Skipping writeDimenstions');
      return;
    }

    const scrollEle = this._scrollEle as any;
    if (!scrollEle) {
      assert(false, 'this._scrollEle should be valid');
      return;
    }

    const fixedEle = this._fixedEle;
    if (!fixedEle) {
      assert(false, 'this._fixedEle should be valid');
      return;
    }

    // Tabs height
    if (this._tabsPlacement === 'bottom' && this._cBottom > 0 && this._footerEle) {
      var footerPos = this._cBottom - this._ftrHeight;
      assert(footerPos >= 0, 'footerPos has to be positive');
      // ******** DOM WRITE ****************
      this._footerEle.style.bottom = cssFormat(footerPos);
    }

    // Handle fullscreen viewport (padding vs margin)
    let topProperty = 'marginTop';
    let bottomProperty = 'marginBottom';
    let fixedTop: number = this._cTop;
    let fixedBottom: number = this._cBottom;

    if (this._fullscreen) {
      assert(this._pTop >= 0, '_paddingTop has to be positive');
      assert(this._pBottom >= 0, '_paddingBottom has to be positive');

      // adjust the content with padding, allowing content to scroll under headers/footers
      // however, on iOS you cannot control the margins of the scrollbar (last tested iOS9.2)
      // only add inline padding styles if the computed padding value, which would
      // have come from the app's css, is different than the new padding value
      topProperty = 'paddingTop';
      bottomProperty = 'paddingBottom';
    }

    // Only update top margin if value changed
    if (this._cTop !== this.contentTop) {
      assert(this._cTop >= 0, 'contentTop has to be positive');
      assert(fixedTop >= 0, 'fixedTop has to be positive');

      // ******** DOM WRITE ****************
      scrollEle.style[topProperty] = cssFormat(this._cTop);
      // ******** DOM WRITE ****************
      fixedEle.style.marginTop = cssFormat(fixedTop);

      this.contentTop = this._cTop;
    }

    // Only update bottom margin if value changed
    if (this._cBottom !== this.contentBottom) {
      assert(this._cBottom >= 0, 'contentBottom has to be positive');
      assert(fixedBottom >= 0, 'fixedBottom has to be positive');

      // ******** DOM WRITE ****************
      scrollEle.style[bottomProperty] = cssFormat(this._cBottom);
      // ******** DOM WRITE ****************
      fixedEle.style.marginBottom = cssFormat(fixedBottom);

      this.contentBottom = this._cBottom;
    }

    if (this._tabsPlacement !== null && this._tabs) {
      // set the position of the tabbar
      if (this._tabsPlacement === 'top') {
        // ******** DOM WRITE ****************
        this._tabs.setTabbarPosition(this._hdrHeight, -1);

      } else {
        assert(this._tabsPlacement === 'bottom', 'tabsPlacement should be bottom');
        // ******** DOM WRITE ****************
        this._tabs.setTabbarPosition(-1, 0);
      }
    }

    this.writeReady.emit();
  }

  /**
   * @private
   */
  imgsRefresh() {
    if (this._imgs.length && this.isImgsRefreshable()) {
      loadImgs(this._imgs, this.scrollTop, this.scrollHeight, this.directionY, IMG_REQUESTABLE_BUFFER, IMG_RENDERABLE_BUFFER);
    }
  }

  isImgsRefreshable() {
    return Math.abs(this.velocityY) < 3;
  }

}

export function loadImgs(imgs: Img[], scrollTop: number, scrollHeight: number, scrollDirectionY: ScrollDirection, requestableBuffer: number, renderableBuffer: number) {
  const scrollBottom = (scrollTop + scrollHeight);
  const priority1: Img[] = [];
  const priority2: Img[] = [];
  let img: Img;

  // all images should be paused
  for (var i = 0, ilen = imgs.length; i < ilen; i++) {
    img = imgs[i];

    if (scrollDirectionY === ScrollDirection.Up) {
      // scrolling up
      if (img.top < scrollBottom && img.bottom > scrollTop - renderableBuffer) {
        // scrolling up, img is within viewable area
        // or about to be viewable area
        img.canRequest = img.canRender = true;
        priority1.push(img);
        continue;
      }

      if (img.bottom <= scrollTop && img.bottom > scrollTop - requestableBuffer) {
        // scrolling up, img is within requestable area
        img.canRequest = true;
        img.canRender = false;
        priority2.push(img);
        continue;
      }

      if (img.top >= scrollBottom && img.top < scrollBottom + renderableBuffer) {
        // scrolling up, img below viewable area
        // but it's still within renderable area
        // don't allow a reset
        img.canRequest = img.canRender = false;
        continue;
      }

    } else {
      // scrolling down

      if (img.bottom > scrollTop && img.top < scrollBottom + renderableBuffer) {
        // scrolling down, img is within viewable area
        // or about to be viewable area
        img.canRequest = img.canRender = true;
        priority1.push(img);
        continue;
      }

      if (img.top >= scrollBottom && img.top < scrollBottom + requestableBuffer) {
        // scrolling down, img is within requestable area
        img.canRequest = true;
        img.canRender = false;
        priority2.push(img);
        continue;
      }

      if (img.bottom <= scrollTop && img.bottom > scrollTop - renderableBuffer) {
        // scrolling down, img above viewable area
        // but it's still within renderable area
        // don't allow a reset
        img.canRequest = img.canRender = false;
        continue;
      }
    }

    img.canRequest = img.canRender = false;
    img.reset();
  }

  // update all imgs which are viewable
  priority1.sort(sortTopToBottom).forEach(i => i.update());

  if (scrollDirectionY === ScrollDirection.Up) {
    // scrolling up
    priority2.sort(sortTopToBottom).reverse().forEach(i => i.update());

  } else {
    // scrolling down
    priority2.sort(sortTopToBottom).forEach(i => i.update());
  }
}

const IMG_REQUESTABLE_BUFFER = 1200;
const IMG_RENDERABLE_BUFFER = 200;


function sortTopToBottom(a: Img, b: Img) {
  if (a.top < b.top) {
    return -1;
  }
  if (a.top > b.top) {
    return 1;
  }
  return 0;
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
