import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Optional, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Img } from '../img/img-interface';
import { Ion } from '../ion';
import { isTabs } from '../../navigation/nav-util';
import { assert, isTrueProperty, removeArrayItem } from '../../util/util';
import { Keyboard } from '../../platform/keyboard';
import { NavController } from '../../navigation/nav-controller';
import { Content as IContent, Tabs } from '../../navigation/nav-interfaces';
import { Platform } from '../../platform/platform';
import { ScrollEvent, ScrollView } from '../../util/scroll-view';
import { ViewController } from '../../navigation/view-controller';

export { ScrollEvent } from '../../util/scroll-view';


export class EventEmitterProxy<T> extends EventEmitter<T> {
  onSubscribe: Function;
  subscribe(generatorOrNext?: any, error?: any, complete?: any): any {
    this.onSubscribe();
    return super.subscribe(generatorOrNext, error, complete);
  }
}

/**
 * @name Content
 * @description
 * The Content component provides an easy to use content area with
 * some useful methods to control the scrollable area. There should
 * only be one content in a single view component. If additional scrollable
 * elements are needed, use [ionScroll](../../scroll/Scroll).
 *
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
 * ### Scroll Events
 *
 * Scroll events happen outside of Angular's Zones. This is for performance reasons. So
 * if you're trying to bind a value to any scroll event, it will need to be wrapped in
 * a `zone.run()`
 *
 * ```ts
 * import { Component, NgZone } from '@angular/core';
 * @Component({
 *   template: `
 *     <ion-header>
 *       <ion-navbar>
 *         <ion-title>{{scrollAmount}}</ion-title>
 *       </ion-navbar>
 *     </ion-header>
 *     <ion-content (ionScroll)="scrollHandler($event)">
 *        <p> Some realllllllly long content </p>
 *     </ion-content>
 * `})
 * class E2EPage {
 *  public scrollAmount = 0;
 *  constructor( public zone: NgZone){}
 *  scrollHandler(event) {
 *    console.log(`ScrollEvent: ${event}`)
 *    this.zone.run(()=>{
 *      // since scrollAmount is data-binded,
 *      // the update needs to happen in zone
 *      this.scrollAmount++
 *    })
 *  }
 * }
 * ```
 *
 * This goes for any scroll event, not just `ionScroll`.
 *
 * ### Resizing the content
 *
 * If the height of `ion-header`, `ion-footer` or `ion-tabbar`
 * changes dynamically, `content.resize()` has to be called in order to update the
 * layout of `Content`.
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
    '<div class="fixed-content" #fixedContent>' +
      '<ng-content select="[ion-fixed],ion-fab"></ng-content>' +
    '</div>' +
    '<div class="scroll-content" #scrollContent>' +
      '<ng-content></ng-content>' +
    '</div>' +
    '<ng-content select="ion-refresher"></ng-content>',
  host: {
    '[class.statusbar-padding]': 'statusbarPadding',
    '[class.has-refresher]': '_hasRefresher'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class Content extends Ion implements OnDestroy, AfterViewInit, IContent {
  /** @internal */
  _cTop: number;
  /** @internal */
  _cBottom: number;
  /** @internal */
  _pTop: number;
  /** @internal */
  _pRight: number;
  /** @internal */
  _pBottom: number;
  /** @internal */
  _pLeft: number;
  /** @internal */
  _scrollPadding: number = 0;
  /** @internal */
  _hdrHeight: number;
  /** @internal */
  _ftrHeight: number;
  /** @internal */
  _tabs: Tabs;
  /** @internal */
  _tabbarHeight: number;
  /** @internal */
  _tabsPlacement: string;
  /** @internal */
  _tTop: number;
  /** @internal */
  _fTop: number;
  /** @internal */
  _fBottom: number;
  /** @internal */
  _inputPolling: boolean = false;
  /** @internal */
  _scroll: ScrollView;
  /** @internal */
  _scLsn: Function;
  /** @internal */
  _fullscreen: boolean;
  /** @internal */
  _hasRefresher: boolean = false;
  /** @internal */
  _footerEle: HTMLElement;
  /** @internal */
  _dirty: boolean;
  /** @internal */
  _imgs: Img[] = [];
  /** @internal */
  _viewCtrlReadSub: any;
  /** @internal */
  _viewCtrlWriteSub: any;
  /** @internal */
  _scrollDownOnLoad: boolean = false;

  _viewCtrl: any;

  private _imgReqBfr: number;
  private _imgRndBfr: number;
  private _imgVelMax: number;

  /** @hidden */
  statusbarPadding: boolean;

  /** @internal */
  @ViewChild('fixedContent', { read: ElementRef }) _fixedContent: ElementRef;

  /** @internal */
  @ViewChild('scrollContent', { read: ElementRef }) _scrollContent: ElementRef;

  /**
   * Content height of the viewable area. This does not include content
   * which is outside the overflow area, or content area which is under
   * headers and footers. Read-only.
   *
   * @return {number}
   */
  get contentHeight(): number {
    return this._scroll.ev.contentHeight;
  }

  /**
   * Content width including content which is not visible on the screen
   * due to overflow. Read-only.
   *
   * @return {number}
   */
  get contentWidth(): number {
    return this._scroll.ev.contentWidth;
  }

  /**
   * A number representing how many pixels the top of the content has been
   * adjusted, which could be by either padding or margin. This adjustment
   * is to account for the space needed for the header.
   *
   * @return {number}
   */
  contentTop: number;

  /**
   * A number representing how many pixels the bottom of the content has been
   * adjusted, which could be by either padding or margin. This adjustment
   * is to account for the space needed for the footer.
   *
   * @return {number}
   */
  contentBottom: number;

  /**
   * Content height including content which is not visible on the screen
   * due to overflow. Read-only.
   *
   * @return {number}
   */
  get scrollHeight(): number {
    return this._scroll.ev.scrollHeight;
  }

  /**
   * Content width including content which is not visible due to
   * overflow. Read-only.
   *
   * @return {number}
   */
  get scrollWidth(): number {
    return this._scroll.ev.scrollWidth;
  }

  /**
   * The distance of the content's top to its topmost visible content.
   *
   * @return {number}
   */
  get scrollTop(): number {
    return this._scroll.ev.scrollTop;
  }
  /**
   * @param {number} top
   */
  set scrollTop(top: number) {
    this._scroll.setTop(top);
  }

  /**
   * The distance of the content's left to its leftmost visible content.
   *
   * @return {number}
   */
  get scrollLeft(): number {
    return this._scroll.ev.scrollLeft;
  }

  /**
   * @param {number} top
   */
  set scrollLeft(top: number) {
    this._scroll.setLeft(top);
  }

  /**
   * If the content is actively scrolling or not.
   *
   * @return {boolean}
   */
  get isScrolling(): boolean {
    return this._scroll.isScrolling;
  }

  /**
   * The current, or last known, vertical scroll direction. Possible
   * string values include `down` and `up`.
   *
   * @return {string}
   */
  get directionY(): string {
    return this._scroll.ev.directionY;
  }

  /**
   * The current, or last known, horizontal scroll direction. Possible
   * string values include `right` and `left`.
   *
   * @return {string}
   */
  get directionX(): string {
    return this._scroll.ev.directionX;
  }

  /**
   * @output {ScrollEvent} Emitted when the scrolling first starts.
   */
  @Output() ionScrollStart: EventEmitterProxy<ScrollEvent> = new EventEmitterProxy<ScrollEvent>();

  /**
   * @output {ScrollEvent} Emitted on every scroll event.
   */
  @Output() ionScroll: EventEmitterProxy<ScrollEvent> = new EventEmitterProxy<ScrollEvent>();

  /**
   * @output {ScrollEvent} Emitted when scrolling ends.
   */
  @Output() ionScrollEnd: EventEmitterProxy<ScrollEvent> = new EventEmitterProxy<ScrollEvent>();


  constructor(
    config: Config,
    private _plt: Platform,
    private _dom: DomController,
    elementRef: ElementRef,
    renderer: Renderer,
    public _app: App,
    public _keyboard: Keyboard,
    public _zone: NgZone,
    @Optional() viewCtrl: ViewController,
    @Optional() navCtrl: NavController
  ) {
    super(config, elementRef, renderer, 'content');

    const enableScrollListener = () => this._scroll.enableEvents();
    this.ionScroll.onSubscribe = enableScrollListener;
    this.ionScrollStart.onSubscribe = enableScrollListener;
    this.ionScrollEnd.onSubscribe = enableScrollListener;

    this.statusbarPadding = config.getBoolean('statusbarPadding', false);
    this._imgReqBfr = config.getNumber('imgRequestBuffer', 1400);
    this._imgRndBfr = config.getNumber('imgRenderBuffer', 400);
    this._imgVelMax = config.getNumber('imgVelocityMax', 3);

    this._scroll = new ScrollView(_app, _plt, _dom);

    while (navCtrl) {
      if (isTabs(<any>navCtrl)) {
        this._tabs = <any>navCtrl;
        break;
      }
      navCtrl = navCtrl.parent;
    }

    if (viewCtrl) {
      this._viewCtrl = viewCtrl;

      // content has a view controller
      viewCtrl._setIONContent(this);
      viewCtrl._setIONContentRef(elementRef);

      this._viewCtrlReadSub = viewCtrl.readReady.subscribe(() => {
        this._viewCtrlReadSub.unsubscribe();
        this._readDimensions();
      });

      this._viewCtrlWriteSub = viewCtrl.writeReady.subscribe(() => {
        this._viewCtrlWriteSub.unsubscribe();
        this._writeDimensions();
      });

    } else {
      // content does not have a view controller
      _dom.read(this._readDimensions.bind(this));
      _dom.write(this._writeDimensions.bind(this));
    }
  }

  /**
   * @hidden
   */
  ngAfterViewInit() {
    assert(this.getFixedElement(), 'fixed element was not found');
    assert(this.getScrollElement(), 'scroll element was not found');

    const scroll = this._scroll;
    scroll.ev.fixedElement = this.getFixedElement();
    scroll.ev.scrollElement = this.getScrollElement();

    // subscribe to the scroll start
    scroll.onScrollStart = (ev) => {
      this.ionScrollStart.emit(ev);
    };

    // subscribe to every scroll move
    scroll.onScroll = (ev) => {
      // emit to all of our other friends things be scrolling
      this.ionScroll.emit(ev);

      this.imgsUpdate();
    };

    // subscribe to the scroll end
    scroll.onScrollEnd = (ev) => {
      this.ionScrollEnd.emit(ev);

      this.imgsUpdate();
    };
  }

  /**
   * @hidden
   */
  enableJsScroll() {
    this._scroll.enableJsScroll(this._cTop, this._cBottom);
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._scLsn && this._scLsn();
    this._viewCtrlReadSub && this._viewCtrlReadSub.unsubscribe();
    this._viewCtrlWriteSub && this._viewCtrlWriteSub.unsubscribe();
    this._viewCtrlReadSub = this._viewCtrlWriteSub = null;
    this._scroll && this._scroll.destroy();
    this._footerEle = this._scLsn = this._scroll = null;
  }

  /**
   * @hidden
   */
  getScrollElement(): HTMLElement {
    return this._scrollContent.nativeElement;
  }

  /**
   * @private
   */
  getFixedElement(): HTMLElement {
    return this._fixedContent.nativeElement;
  }

  /**
   * @hidden
   */
  onScrollElementTransitionEnd(callback: {(ev: TransitionEvent): void}) {
    this._plt.transitionEnd(this.getScrollElement(), callback);
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
   *
   * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
   * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
   */
  scrollToBottom(duration: number = 300) {
    console.debug(`content, scrollToBottom, duration: ${duration}`);
    return this._scroll.scrollToBottom(duration);
  }

  /**
   * @input {boolean} If true, the content will scroll behind the headers
   * and footers. This effect can easily be seen by setting the toolbar
   * to transparent.
   */
  @Input()
  get fullscreen(): boolean {
    return this._fullscreen;
  }

  set fullscreen(val: boolean) {
    this._fullscreen = isTrueProperty(val);
  }

  /**
   * @input {boolean} If true, the content will scroll down on load.
   */
  @Input()
  get scrollDownOnLoad(): boolean {
    return this._scrollDownOnLoad;
  }

  set scrollDownOnLoad(val: boolean) {
    this._scrollDownOnLoad = isTrueProperty(val);
  }

  /**
   * @private
   */
  addImg(img: Img) {
    this._imgs.push(img);
  }

  /**
   * @hidden
   */
  removeImg(img: Img) {
    removeArrayItem(this._imgs, img);
  }

  /**
   * @hidden
   * DOM WRITE
   */
  setScrollElementStyle(prop: string, val: any) {
    const scrollEle = this.getScrollElement();
    if (scrollEle) {
      this._dom.write(() => {
        (<any>scrollEle.style)[prop] = val;
      });
    }
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
    const scrollEle = this.getScrollElement();
    const parentElement = scrollEle.parentElement;

    return {
      contentHeight: parentElement.offsetHeight - this._cTop - this._cBottom,
      contentTop: this._cTop,
      contentBottom: this._cBottom,

      contentWidth: parentElement.offsetWidth,
      contentLeft: parentElement.offsetLeft,

      scrollHeight: scrollEle.scrollHeight,
      scrollTop: scrollEle.scrollTop,

      scrollWidth: scrollEle.scrollWidth,
      scrollLeft: scrollEle.scrollLeft,
    };
  }

  /**
   * @hidden
   * DOM WRITE
   * Adds padding to the bottom of the scroll element when the keyboard is open
   * so content below the keyboard can be scrolled into view.
   */
  addScrollPadding(newPadding: number) {
    assert(typeof this._scrollPadding === 'number', '_scrollPadding must be a number');
    if (newPadding === 0) {
      this._inputPolling = false;
      this._scrollPadding = -1;
    }
    if (newPadding > this._scrollPadding) {
      console.debug(`content, addScrollPadding, newPadding: ${newPadding}, this._scrollPadding: ${this._scrollPadding}`);

      this._scrollPadding = newPadding;
      var scrollEle = this.getScrollElement();
      if (scrollEle) {
        this._dom.write(() => {
          scrollEle.style.paddingBottom = (newPadding > 0) ? newPadding + 'px' : '';
        });
      }
    }
  }

  /**
   * @hidden
   * DOM WRITE
   */
  clearScrollPaddingFocusOut() {
    if (!this._inputPolling) {
      console.debug(`content, clearScrollPaddingFocusOut begin`);
      this._inputPolling = true;

      this._keyboard.onClose(() => {
        console.debug(`content, clearScrollPaddingFocusOut _keyboard.onClose`);
        this.addScrollPadding(0);
      }, 200, 3000);
    }
  }



  /**
   * Tell the content to recalculate its dimensions. This should be called
   * after dynamically adding/removing headers, footers, or tabs.
   */
  resize() {
    this._dom.read(this._readDimensions.bind(this));
    this._dom.write(this._writeDimensions.bind(this));
  }

  /**
   * @hidden
   * DOM READ
   */
  private _readDimensions() {
    const cachePaddingTop = this._pTop;
    const cachePaddingRight = this._pRight;
    const cachePaddingBottom = this._pBottom;
    const cachePaddingLeft = this._pLeft;
    const cacheHeaderHeight = this._hdrHeight;
    const cacheFooterHeight = this._ftrHeight;
    const cacheTabsPlacement = this._tabsPlacement;
    let tabsTop = 0;
    let scrollEvent: ScrollEvent;
    this._pTop = 0;
    this._pRight = 0;
    this._pBottom = 0;
    this._pLeft = 0;
    this._hdrHeight = 0;
    this._ftrHeight = 0;
    this._tabsPlacement = null;
    this._tTop = 0;
    this._fTop = 0;
    this._fBottom = 0;

    // In certain cases this._scroll is undefined
    // if that is the case then we should just return
    if (!this._scroll) {
      return;
    }

    scrollEvent = this._scroll.ev;

    let ele: HTMLElement = this.getNativeElement();
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
        scrollEvent.contentElement = ele;

        if (this._fullscreen) {
          // ******** DOM READ ****************
          computedStyle = getComputedStyle(ele);
          this._pTop = parsePxUnit(computedStyle.paddingTop);
          this._pBottom = parsePxUnit(computedStyle.paddingBottom);
          this._pRight = parsePxUnit(computedStyle.paddingRight);
          this._pLeft = parsePxUnit(computedStyle.paddingLeft);
        }

      } else if (tagName === 'ION-HEADER') {
        scrollEvent.headerElement = ele;

        // ******** DOM READ ****************
        this._hdrHeight = ele.clientHeight;

      } else if (tagName === 'ION-FOOTER') {
        scrollEvent.footerElement = ele;

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

    // Tabs top
    if (this._tabs && this._tabsPlacement === 'top') {
      this._tTop = this._hdrHeight;
      tabsTop = this._tabs._top;
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

    // Refresher uses a border which should be hidden unless pulled
    if (this._hasRefresher) {
      this._cTop -= 1;
    }

    // Fixed content shouldn't include content padding
    this._fTop = this._cTop;
    this._fBottom = this._cBottom;

    // Handle fullscreen viewport (padding vs margin)
    if (this._fullscreen) {
      this._cTop += this._pTop;
      this._cBottom += this._pBottom;
    }

    // ******** DOM READ ****************
    const contentDimensions = this.getContentDimensions();
    scrollEvent.scrollHeight = contentDimensions.scrollHeight;
    scrollEvent.scrollWidth = contentDimensions.scrollWidth;
    scrollEvent.contentHeight = contentDimensions.contentHeight;
    scrollEvent.contentWidth = contentDimensions.contentWidth;
    scrollEvent.contentTop = contentDimensions.contentTop;
    scrollEvent.contentBottom = contentDimensions.contentBottom;

    this._dirty = (
      cachePaddingTop !== this._pTop ||
      cachePaddingBottom !== this._pBottom ||
      cachePaddingLeft !== this._pLeft ||
      cachePaddingRight !== this._pRight ||
      cacheHeaderHeight !== this._hdrHeight ||
      cacheFooterHeight !== this._ftrHeight ||
      cacheTabsPlacement !== this._tabsPlacement ||
      tabsTop !== this._tTop ||
      this._cTop !== this.contentTop ||
      this._cBottom !== this.contentBottom
    );

    this._scroll.init(this.getScrollElement(), this._cTop, this._cBottom);

    // initial imgs refresh
    this.imgsUpdate();
  }

  /**
   * @hidden
   * DOM WRITE
   */
  private _writeDimensions() {
    if (!this._dirty) {
      console.debug('Skipping writeDimensions');
      return;
    }

    const scrollEle = this.getScrollElement();
    if (!scrollEle) {
      assert(false, 'this.getScrollElement() should be valid');
      return;
    }

    const fixedEle = this.getFixedElement();
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
    let fixedTop: number = this._fTop;
    let fixedBottom: number = this._fBottom;

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
      (<any>scrollEle.style)[topProperty] = cssFormat(this._cTop);
      // ******** DOM WRITE ****************
      fixedEle.style.marginTop = cssFormat(fixedTop);

      this.contentTop = this._cTop;
    }

    // Only update bottom margin if value changed
    if (this._cBottom !== this.contentBottom) {
      assert(this._cBottom >= 0, 'contentBottom has to be positive');
      assert(fixedBottom >= 0, 'fixedBottom has to be positive');

      // ******** DOM WRITE ****************
      (<any>scrollEle.style)[bottomProperty] = cssFormat(this._cBottom);
      // ******** DOM WRITE ****************
      fixedEle.style.marginBottom = cssFormat(fixedBottom);

      this.contentBottom = this._cBottom;
    }

    if (this._tabsPlacement !== null && this._tabs) {
      // set the position of the tabbar
      if (this._tabsPlacement === 'top') {
        // ******** DOM WRITE ****************
        this._tabs.setTabbarPosition(this._tTop, -1);

      } else {
        assert(this._tabsPlacement === 'bottom', 'tabsPlacement should be bottom');
        // ******** DOM WRITE ****************
        this._tabs.setTabbarPosition(-1, 0);
      }
    }

    // Scroll the page all the way down after setting dimensions
    if (this._scrollDownOnLoad) {
      this.scrollToBottom(0);
      this._scrollDownOnLoad = false;
    }
  }

  /**
   * @hidden
   */
  imgsUpdate() {
    if (this._scroll.initialized && this._imgs.length && this.isImgsUpdatable()) {
      updateImgs(this._imgs, this.scrollTop, this.contentHeight, this.directionY, this._imgReqBfr, this._imgRndBfr);
    }
  }

  /**
   * @hidden
   */
  isImgsUpdatable() {
    // an image is only "updatable" if the content isn't scrolling too fast
    // if scroll speed is above the maximum velocity, then let current
    // requests finish, but do not start new requets or render anything
    // if scroll speed is below the maximum velocity, then it's ok
    // to start new requests and render images
    return Math.abs(this._scroll.ev.velocityY) < this._imgVelMax;
  }

}

export function updateImgs(imgs: Img[], viewableTop: number, contentHeight: number, scrollDirectionY: string, requestableBuffer: number, renderableBuffer: number) {
  // ok, so it's time to see which images, if any, should be requested and rendered
  // ultimately, if we're scrolling fast then don't bother requesting or rendering
  // when scrolling is done, then it needs to do a check to see which images are
  // important to request and render, and which image requests should be aborted.
  // Additionally, images which are not near the viewable area should not be
  // rendered at all in order to save browser resources.
  const viewableBottom = (viewableTop + contentHeight);
  const priority1: Img[] = [];
  const priority2: Img[] = [];
  let img: Img;

  // all images should be paused
  for (var i = 0, ilen = imgs.length; i < ilen; i++) {
    img = imgs[i];

    if (scrollDirectionY === 'up') {
      // scrolling up
      if (img.top < viewableBottom && img.bottom > viewableTop - renderableBuffer) {
        // scrolling up, img is within viewable area
        // or about to be viewable area
        img.canRequest = img.canRender = true;
        priority1.push(img);
        continue;
      }

      if (img.bottom <= viewableTop && img.bottom > viewableTop - requestableBuffer) {
        // scrolling up, img is within requestable area
        img.canRequest = true;
        img.canRender = false;
        priority2.push(img);
        continue;
      }

      if (img.top >= viewableBottom && img.top < viewableBottom + renderableBuffer) {
        // scrolling up, img below viewable area
        // but it's still within renderable area
        // don't allow a reset
        img.canRequest = img.canRender = false;
        continue;
      }

    } else {
      // scrolling down

      if (img.bottom > viewableTop && img.top < viewableBottom + renderableBuffer) {
        // scrolling down, img is within viewable area
        // or about to be viewable area
        img.canRequest = img.canRender = true;
        priority1.push(img);
        continue;
      }

      if (img.top >= viewableBottom && img.top < viewableBottom + requestableBuffer) {
        // scrolling down, img is within requestable area
        img.canRequest = true;
        img.canRender = false;
        priority2.push(img);
        continue;
      }

      if (img.bottom <= viewableTop && img.bottom > viewableTop - renderableBuffer) {
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

  if (scrollDirectionY === 'up') {
    // scrolling up
    priority2.sort(sortTopToBottom).reverse().forEach(i => i.update());

  } else {
    // scrolling down
    priority2.sort(sortTopToBottom).forEach(i => i.update());
  }
}


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
