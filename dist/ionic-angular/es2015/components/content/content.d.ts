import { AfterViewInit, ElementRef, EventEmitter, NgZone, OnDestroy, Renderer } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Img } from '../img/img-interface';
import { Ion } from '../ion';
import { Keyboard } from '../../platform/keyboard';
import { NavController } from '../../navigation/nav-controller';
import { Content as IContent, Tabs } from '../../navigation/nav-interfaces';
import { Platform } from '../../platform/platform';
import { ScrollEvent, ScrollView } from '../../util/scroll-view';
import { ViewController } from '../../navigation/view-controller';
export { ScrollEvent } from '../../util/scroll-view';
export declare class EventEmitterProxy<T> extends EventEmitter<T> {
    onSubscribe: Function;
    subscribe(generatorOrNext?: any, error?: any, complete?: any): any;
}
/**
 * @name Content
 * @description
 * The Content component provides an easy to use content area with
 * some useful methods to control the scrollable area. There should
 * only be one content in a single view component. If additional scrollable
 * elements are need, use [ionScroll](../../scroll/Scroll).
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
export declare class Content extends Ion implements OnDestroy, AfterViewInit, IContent {
    private _plt;
    private _dom;
    _app: App;
    _keyboard: Keyboard;
    _zone: NgZone;
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
    _scrollPadding: number;
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
    _inputPolling: boolean;
    /** @internal */
    _scroll: ScrollView;
    /** @internal */
    _scLsn: Function;
    /** @internal */
    _fullscreen: boolean;
    /** @internal */
    _hasRefresher: boolean;
    /** @internal */
    _footerEle: HTMLElement;
    /** @internal */
    _dirty: boolean;
    /** @internal */
    _imgs: Img[];
    /** @internal */
    _viewCtrlReadSub: any;
    /** @internal */
    _viewCtrlWriteSub: any;
    /** @internal */
    _scrollDownOnLoad: boolean;
    private _imgReqBfr;
    private _imgRndBfr;
    private _imgVelMax;
    /** @hidden */
    statusbarPadding: boolean;
    /** @internal */
    _fixedContent: ElementRef;
    /** @internal */
    _scrollContent: ElementRef;
    /**
     * Content height of the viewable area. This does not include content
     * which is outside the overflow area, or content area which is under
     * headers and footers. Read-only.
     *
     * @return {number}
     */
    readonly contentHeight: number;
    /**
     * Content width including content which is not visible on the screen
     * due to overflow. Read-only.
     *
     * @return {number}
     */
    readonly contentWidth: number;
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
    readonly scrollHeight: number;
    /**
     * Content width including content which is not visible due to
     * overflow. Read-only.
     *
     * @return {number}
     */
    readonly scrollWidth: number;
    /**
     * The distance of the content's top to its topmost visible content.
     *
     * @return {number}
     */
    /**
     * @param {number} top
     */
    scrollTop: number;
    /**
     * The distance of the content's left to its leftmost visible content.
     *
     * @return {number}
     */
    /**
     * @param {number} top
     */
    scrollLeft: number;
    /**
     * If the content is actively scrolling or not.
     *
     * @return {boolean}
     */
    readonly isScrolling: boolean;
    /**
     * The current, or last known, vertical scroll direction. Possible
     * string values include `down` and `up`.
     *
     * @return {string}
     */
    readonly directionY: string;
    /**
     * The current, or last known, horizontal scroll direction. Possible
     * string values include `right` and `left`.
     *
     * @return {string}
     */
    readonly directionX: string;
    /**
     * @output {ScrollEvent} Emitted when the scrolling first starts.
     */
    ionScrollStart: EventEmitterProxy<ScrollEvent>;
    /**
     * @output {ScrollEvent} Emitted on every scroll event.
     */
    ionScroll: EventEmitterProxy<ScrollEvent>;
    /**
     * @output {ScrollEvent} Emitted when scrolling ends.
     */
    ionScrollEnd: EventEmitterProxy<ScrollEvent>;
    constructor(config: Config, _plt: Platform, _dom: DomController, elementRef: ElementRef, renderer: Renderer, _app: App, _keyboard: Keyboard, _zone: NgZone, viewCtrl: ViewController, navCtrl: NavController);
    /**
     * @hidden
     */
    ngAfterViewInit(): void;
    /**
     * @hidden
     */
    enableJsScroll(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    getScrollElement(): HTMLElement;
    /**
     * @private
     */
    getFixedElement(): HTMLElement;
    /**
     * @hidden
     */
    onScrollElementTransitionEnd(callback: {
        (ev: TransitionEvent): void;
    }): void;
    /**
     * Scroll to the specified position.
     *
     * @param {number} x  The x-value to scroll to.
     * @param {number} y  The y-value to scroll to.
     * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
     */
    scrollTo(x: number, y: number, duration?: number, done?: Function): Promise<any>;
    /**
     * Scroll to the top of the content component.
     *
     * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
     */
    scrollToTop(duration?: number): Promise<any>;
    /**
     * Scroll to the bottom of the content component.
     *
     * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
     */
    scrollToBottom(duration?: number): Promise<any>;
    /**
     * @input {boolean} If true, the content will scroll behind the headers
     * and footers. This effect can easily be seen by setting the toolbar
     * to transparent.
     */
    fullscreen: boolean;
    /**
     * @input {boolean} If true, the content will scroll down on load.
     */
    scrollDownOnLoad: boolean;
    /**
     * @private
     */
    addImg(img: Img): void;
    /**
     * @hidden
     */
    removeImg(img: Img): void;
    /**
     * @hidden
     * DOM WRITE
     */
    setScrollElementStyle(prop: string, val: any): void;
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
    getContentDimensions(): ContentDimensions;
    /**
     * @hidden
     * DOM WRITE
     * Adds padding to the bottom of the scroll element when the keyboard is open
     * so content below the keyboard can be scrolled into view.
     */
    addScrollPadding(newPadding: number): void;
    /**
     * @hidden
     * DOM WRITE
     */
    clearScrollPaddingFocusOut(): void;
    /**
     * Tell the content to recalculate its dimensions. This should be called
     * after dynamically adding/removing headers, footers, or tabs.
     */
    resize(): void;
    /**
     * @hidden
     * DOM READ
     */
    private _readDimensions();
    /**
     * @hidden
     * DOM WRITE
     */
    private _writeDimensions();
    /**
     * @hidden
     */
    imgsUpdate(): void;
    /**
     * @hidden
     */
    isImgsUpdatable(): boolean;
}
export declare function updateImgs(imgs: Img[], viewableTop: number, contentHeight: number, scrollDirectionY: string, requestableBuffer: number, renderableBuffer: number): void;
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
