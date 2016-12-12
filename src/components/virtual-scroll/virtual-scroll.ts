import { AfterContentInit, ChangeDetectorRef, ContentChild, Directive, DoCheck, ElementRef, Input, IterableDiffers, IterableDiffer, NgZone, OnDestroy, Optional, Renderer, TrackByFn } from '@angular/core';

import { adjustRendered, calcDimensions, estimateHeight, initReadNodes, processRecords, populateNodeData, updateDimensions, updateNodeContext, writeToNodes } from './virtual-util';
import { Config } from '../../config/config';
import { Content, ScrollEvent } from '../content/content';
import { DomController } from '../../util/dom-controller';
import { isBlank, isFunction, isPresent } from '../../util/util';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
import { VirtualCell, VirtualData, VirtualNode } from './virtual-util';
import { VirtualFooter, VirtualHeader, VirtualItem } from './virtual-item';


/**
 * @name VirtualScroll
 * @description
 * Virtual Scroll displays a virtual, "infinite" list. An array of records
 * is passed to the virtual scroll containing the data to create templates
 * for. The template created for each record, referred to as a cell, can
 * consist of items, headers, and footers.
 *
 * For performance reasons, not every record in the list is rendered at once;
 * instead a small subset of records (enough to fill the viewport) are rendered
 * and reused as the user scrolls.
 *
 * ### The Basics
 *
 * The array of records should be passed to the `virtualScroll` property.
 * The data given to the `virtualScroll` property must be an array. An item
 * template with the `*virtualItem` property is required in the `virtualScroll`.
 * The `virtualScroll` and `*virtualItem` properties can be added to any element.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <ion-item *virtualItem="let item">
 *     {% raw %}{{ item }}{% endraw %}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Section Headers and Footers
 *
 * Section headers and footers are optional. They can be dynamically created
 * from developer-defined functions. For example, a large list of contacts
 * usually has a divider for each letter in the alphabet. Developers provide
 * their own custom function to be called on each record. The logic in the
 * custom function should determine whether to create the section template
 * and what data to provide to the template. The custom function should
 * return `null` if a template shouldn't be created.
 *
 * ```html
 * <ion-list [virtualScroll]="items" [headerFn]="myHeaderFn">
 *
 *   <ion-item-divider *virtualHeader="let header">
 *     Header: {% raw %}{{ header }}{% endraw %}
 *   </ion-item-divider>
 *
 *   <ion-item *virtualItem="let item">
 *     Item: {% raw %}{{ item }}{% endraw %}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * Below is an example of a custom function called on every record. It
 * gets passed the individual record, the record's index number,
 * and the entire array of records. In this example, after every 20
 * records a header will be inserted. So between the 19th and 20th records,
 * between the 39th and 40th, and so on, a `<ion-item-divider>` will
 * be created and the template's data will come from the function's
 * returned data.
 *
 * ```ts
 * myHeaderFn(record, recordIndex, records) {
 *   if (recordIndex % 20 === 0) {
 *     return 'Header ' + recordIndex;
 *   }
 *   return null;
 * }
 * ```
 *
 *
 * ### Approximate Widths and Heights
 *
 * If the height of items in the virtual scroll are not close to the
 * default size of 40px, it is extremely important to provide an value for
 * approxItemHeight height. An exact pixel-perfect size is not necessary,
 * but without an estimate the virtual scroll will not render correctly.
 *
 * The approximate width and height of each template is used to help
 * determine how many cells should be created, and to help calculate
 * the height of the scrollable area. Note that the actual rendered size
 * of each cell comes from the app's CSS, whereas this approximation
 * is only used to help calculate initial dimensions.
 *
 * It's also important to know that Ionic's default item sizes have
 * slightly different heights between platforms, which is perfectly fine.
 *
 *
 * ### Images Within Virtual Scroll
 *
 * Ionic provides `<ion-img>` to manage HTTP requests and image rendering.
 * Additionally, it includes a customizable placeholder element which shows
 * before the image has finished loading. While scrolling through items
 * quickly, `<ion-img>` knows not to make any image http requests, and only
 * loads the images that are viewable after scrolling.
 *
 * It's also important for app developers to ensure image sizes are locked in,
 * and after images have fully loaded they do not change size and affect any
 * other element sizes. Simply put, to ensure rendering bugs are not introduced,
 * it's vital that elements within a virtual item does not dynamically change.
 *
 * We recommend using our `<ion-img>` element over the native `<img>` element
 * because when an `<img>` element is added to the DOM, it immediately
 * makes a HTTP request for the image file. HTTP requests, image
 * decoding, and image rendering can cause issues while scrolling. For virtual
 * scrolling, the natural effects of the `<img>` are not desirable features.
 *
 * Note: `<ion-img>` should only be used with Virtual Scroll. If you are using
 * an image outside of Virtual Scroll you should use the standard `<img>` tag.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <ion-item *virtualItem="let item">
 *     <ion-avatar item-left>
 *       <ion-img [src]="item.avatarUrl"></ion-img>
 *     </ion-avatar>
 *    {% raw %} {{ item.firstName }} {{ item.lastName }}{% endraw %}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Custom Components
 *
 * If a custom component is going to be used within Virtual Scroll, it's best
 * to wrap it with a good old `<div>` to ensure the component is rendered
 * correctly. Since each custom component's implementation and internals can be
 * quite different, wrapping within a `<div>` is a safe way to make sure
 * dimensions are measured correctly.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <div *virtualItem="let item">
 *     <my-custom-item [item]="item">
 *       {% raw %} {{ item }}{% endraw %}
 *     </my-custom-item>
 *   </div>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Performance Tips
 *
 * - When deploying to iOS with Cordova, it's highly recommended to use the
 *   [WKWebView plugin](http://blog.ionic.io/cordova-ios-performance-improvements-drop-in-speed-with-wkwebview/)
 *   in order to take advantage of iOS's higher performimg webview.
 * - Use `<ion-img>` rather than `<img>` so images are lazy loaded
 *   while scrolling.
 * - Image sizes should be locked in, meaning the size of any element
 *   should not change after the image has loaded.
 * - For the most part, ensure the element size for each virtual item
 *   does not dynamically change, but rather, their size must already be
 *   locked in via CSS at the time they are rendered.
 * - Provide an approximate width and height so the virtual scroll can
 *   best calculate the cell height.
 * - Changing the dataset requires the entire virtual scroll to be
 *   reset, which is an expensive operation and should be avoided
 *   if possible.
 * - Do not perform any DOM manipulation within section header and
 *   footer functions. These functions are called for every record in the
 *   dataset, so please make sure they're performant.
 *
 */
@Directive({
  selector: '[virtualScroll]'
})
export class VirtualScroll implements DoCheck, AfterContentInit, OnDestroy {
  _trackBy: TrackByFn;
  _differ: IterableDiffer;
  _scrollSub: any;
  _scrollEndSub: any;
  _init: boolean;
  _lastEle: boolean;
  _hdrFn: Function;
  _ftrFn: Function;
  _records: any[] = [];
  _cells: VirtualCell[] = [];
  _nodes: VirtualNode[] = [];
  _vHeight: number = 0;
  _lastCheck: number = 0;
  _data: VirtualData = {
    scrollTop: 0,
  };
  _queue: number;

  @ContentChild(VirtualItem) _itmTmp: VirtualItem;
  @ContentChild(VirtualHeader) _hdrTmp: VirtualHeader;
  @ContentChild(VirtualFooter) _ftrTmp: VirtualFooter;


  /**
   * @input {array} The data that builds the templates within the virtual scroll.
   * This is the same data that you'd pass to `*ngFor`. It's important to note
   * that when this data has changed, then the entire virtual scroll is reset,
   * which is an expensive operation and should be avoided if possible.
   */
  @Input()
  set virtualScroll(val: any) {
    this._records = val;
    if (isBlank(this._differ) && isPresent(val)) {
      this._differ = this._iterableDiffers.find(val).create(this._cd, this._trackBy);
    }
  }

  /**
   * @input {number} The buffer ratio is used to decide how many cells
   * should get created when initially rendered. The number is a
   * multiplier against the viewable area's height. For example, if it
   * takes `20` cells to fill up the height of the viewable area, then
   * with a buffer ratio of `3` it will create `60` cells that are
   * available for reuse while scrolling. For better performance, it's
   * better to have more cells than what are required to fill the
   * viewable area. Default is `3`.
   */
  @Input() bufferRatio: number = 3;

  /**
   * @input {string} The approximate width of each item template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This value can use either `px` or `%` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered. Default is
   * `100%`.
   */
  @Input() approxItemWidth: string = '100%';

  /**
   * @input {string} It is important to provide this
   * if virtual item height will be significantly larger than the default
   * The approximate height of each virtual item template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered. Default is
   * `40px`.
   */
  @Input() approxItemHeight: string;

  /**
   * @input {string} The approximate width of each header template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This value can use either `px` or `%` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions. Default is `100%`.
   */
  @Input() approxHeaderWidth: string = '100%';

  /**
   * @input {string} The approximate height of each header template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered. Default is `40px`.
   */
  @Input() approxHeaderHeight: string = '40px';

  /**
   * @input {string} The approximate width of each footer template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This value can use either `px` or `%` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered. Default is `100%`.
   */
  @Input() approxFooterWidth: string = '100%';

  /**
   * @input {string} The approximate height of each footer template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions before the item has been rendered. Default is `40px`.
   */
  @Input() approxFooterHeight: string = '40px';

  /**
   * @input {function} Section headers and the data used within its given
   * template can be dynamically created by passing a function to `headerFn`.
   * For example, a large list of contacts usually has dividers between each
   * letter in the alphabet. App's can provide their own custom `headerFn`
   * which is called with each record within the dataset. The logic within
   * the header function can decide if the header template should be used,
   * and what data to give to the header template. The function must return
   * `null` if a header cell shouldn't be created.
   */
  @Input() set headerFn(val: Function) {
    if (isFunction(val)) {
      this._hdrFn = val.bind((this._ctrl && this._ctrl._cmp) || this);
    }
  }

  /**
   * @input {function} Section footers and the data used within its given
   * template can be dynamically created by passing a function to `footerFn`.
   * The logic within the footer function can decide if the footer template
   * should be used, and what data to give to the footer template. The function
   * must return `null` if a footer cell shouldn't be created.
   */
  @Input() set footerFn(val: Function) {
    if (isFunction(val)) {
      this._ftrFn = val.bind((this._ctrl && this._ctrl._cmp) || this);
    }
  }

  /**
   * @input {function} Same as `ngForTrackBy` which can be used on `ngFor`.
   */
  @Input() set virtualTrackBy(val: TrackByFn) {
    this._trackBy = val;
  }

  constructor(
    private _iterableDiffers: IterableDiffers,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    private _zone: NgZone,
    private _cd: ChangeDetectorRef,
    private _content: Content,
    private _platform: Platform,
    @Optional() private _ctrl: ViewController,
    private _config: Config,
    private _dom: DomController) {

    // hide the virtual scroll element with opacity so we don't
    // see jank as it loads up, but we're still able to read
    // dimensions because it's still rendered and only opacity hidden
    this._renderer.setElementClass(_elementRef.nativeElement, 'virtual-loading', true);

    // wait for the content to be rendered and has readable dimensions
    _content.readReady.subscribe(() => {
      this._init = true;

      if (this._hasChanges()) {
        this.readUpdate();

        // wait for the content to be writable
        var subscription = _content.writeReady.subscribe(() => {
          subscription.unsubscribe();
          this.writeUpdate();
        });
      }

      this._listeners();
    });
  }

  /**
   * @private
   */
  ngDoCheck() {
    if (this._init && this._hasChanges()) {
      // only continue if we've already initialized
      // and if there actually are changes
      this.readUpdate();
      this.writeUpdate();
    }
  }

  readUpdate() {
    console.debug(`virtual-scroll, readUpdate`);

    // reset everything
    this._cells.length = 0;
    this._nodes.length = 0;
    this._itmTmp.viewContainer.clear();

    // ******** DOM READ ****************
    calcDimensions(this._data, this._elementRef.nativeElement,
                   this.approxItemWidth, this.approxItemHeight,
                   this.approxHeaderWidth, this.approxHeaderHeight,
                   this.approxFooterWidth, this.approxFooterHeight,
                   this.bufferRatio);
  }

  writeUpdate() {
    console.debug(`virtual-scroll, writeUpdate`);

    processRecords(this._data.renderHeight,
                   this._records,
                   this._cells,
                   this._hdrFn,
                   this._ftrFn,
                   this._data);

    // ******** DOM WRITE ****************
    this.renderVirtual();
  }

  private _hasChanges() {
    return (isPresent(this._records) && isPresent(this._differ) && isPresent(this._differ.diff(this._records)));
  }

  /**
   * @private
   * DOM WRITE
   */
  renderVirtual() {
    const nodes = this._nodes;
    const cells = this._cells;
    const data = this._data;
    const records = this._records;

    // initialize nodes with the correct cell data
    data.topCell = 0;
    data.bottomCell = (cells.length - 1);

    populateNodeData(0, data.bottomCell,
                      data.viewWidth, true,
                      cells, records, nodes,
                      this._itmTmp.viewContainer,
                      this._itmTmp.templateRef,
                      this._hdrTmp && this._hdrTmp.templateRef,
                      this._ftrTmp && this._ftrTmp.templateRef, true);

    // ******** DOM WRITE ****************
    this._cd.detectChanges();


    // at this point, this fn was called from within another
    // requestAnimationFrame, so the next dom reads/writes within the next frame
    // wait a frame before trying to read and calculate the dimensions
    this._dom.read(() => {
      // ******** DOM READ ****************
      initReadNodes(nodes, cells, data);
    });

    this._dom.write(() => {
      const ele = this._elementRef.nativeElement;
      const recordsLength = records.length;
      const renderer = this._renderer;

      // update the bound context for each node
      updateNodeContext(nodes, cells, data);

      // ******** DOM WRITE ****************
      for (var i = 0; i < nodes.length; i++) {
        (<any>nodes[i].view).detectChanges();
      }

      if (!this._lastEle) {
        // add an element at the end so :last-child css doesn't get messed up
        // ******** DOM WRITE ****************
        var lastEle: HTMLElement = renderer.createElement(ele, 'div');
        lastEle.className = 'virtual-last';
        this._lastEle = true;
      }

      // ******** DOM WRITE ****************
      renderer.setElementClass(ele, 'virtual-scroll', true);

      // ******** DOM WRITE ****************
      renderer.setElementClass(ele, 'virtual-loading', false);

      // ******** DOM WRITE ****************
      writeToNodes(nodes, cells, recordsLength);

      // ******** DOM WRITE ****************
      this._setHeight(
        estimateHeight(recordsLength, cells[cells.length - 1], this._vHeight, 0.25)
      );

      this._content.imgsUpdate();
    });

  }

  /**
   * @private
   */
  scrollUpdate(ev: ScrollEvent) {
    // there is a queue system so that we can
    // spread out the work over multiple frames
    const data = this._data;
    const cells = this._cells;
    const nodes = this._nodes;

    // set the scroll top from the scroll event
    data.scrollTop = ev.scrollTop;

    if (this._queue === SCROLL_QUEUE_DOM_WRITE) {
      // there are DOM writes we need to take care of in this frame

      this._dom.write(() => {
        const recordsLength = this._records.length;

        // ******** DOM WRITE ****************
        writeToNodes(nodes, cells, recordsLength);

        // ******** DOM WRITE ****************
        this._setHeight(
          estimateHeight(recordsLength, cells[cells.length - 1], this._vHeight, 0.25)
        );

        // we're done here, good work
        this._queue = SCROLL_QUEUE_NO_CHANGES;
      });

    } else if (this._queue === SCROLL_QUEUE_CHANGE_DETECTION) {
      // we need to do some change detection in this frame

      this._dom.write(() => {
        // we've got work painting do, let's throw it in the
        // domWrite callback so everyone plays nice
        // ******** DOM WRITE ****************
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].hasChanges) {
            (<any>nodes[i].view).detectChanges();
          }
        }

        // on the next frame we need write to the dom nodes manually
        this._queue = SCROLL_QUEUE_DOM_WRITE;
      });

    } else {
      // no dom writes or change detection to take care of
      // let's see if we've scroll far enough to require another check
      data.scrollDiff = (data.scrollTop - this._lastCheck);

      if (Math.abs(data.scrollDiff) > SCROLL_DIFFERENCE_MINIMUM) {
        // don't bother updating if the scrollTop hasn't changed much
        this._lastCheck = data.scrollTop;

        if (data.scrollDiff > 0) {
          // load data we may not have processed yet
          var stopAtHeight = (data.scrollTop + data.renderHeight);

          processRecords(stopAtHeight, this._records, cells,
                         this._hdrFn, this._ftrFn, data);
        }

        // ******** DOM READ ****************
        updateDimensions(nodes, cells, data, false);

        adjustRendered(cells, data);

        var hasChanges = populateNodeData(data.topCell, data.bottomCell,
                           data.viewWidth, data.scrollDiff > 0,
                           cells, this._records, nodes,
                           this._itmTmp.viewContainer,
                           this._itmTmp.templateRef,
                           this._hdrTmp && this._hdrTmp.templateRef,
                           this._ftrTmp && this._ftrTmp.templateRef, false);

        if (hasChanges) {
          // queue making updates in the next frame
          this._queue = SCROLL_QUEUE_CHANGE_DETECTION;

          // update the bound context for each node
          updateNodeContext(nodes, cells, data);
        }
      }

    }
  }

  /**
   * @private
   * DOM WRITE
   */
  scrollEnd(ev: ScrollEvent) {
    const nodes = this._nodes;
    const cells = this._cells;
    const data = this._data;

    // ******** DOM READ ****************
    updateDimensions(nodes, cells, data, false);

    adjustRendered(cells, data);

    // ******** DOM READS ABOVE / DOM WRITES BELOW ****************

    this._dom.write(() => {
      const recordsLength = this._records.length;

      // update the bound context for each node
      updateNodeContext(nodes, cells, data);

      // ******** DOM WRITE ****************
      for (var i = 0; i < nodes.length; i++) {
        (<any>nodes[i].view).detectChanges();
      }

      // ******** DOM WRITE ****************
      writeToNodes(nodes, cells, recordsLength);

      // ******** DOM WRITE ****************
      this._setHeight(
        estimateHeight(recordsLength, cells[cells.length - 1], this._vHeight, 0.05)
      );

      this._queue = SCROLL_QUEUE_NO_CHANGES;
    });
  }

  /**
   * NO DOM
   */
  private _listeners() {
    if (!this._scrollSub) {
      if (this._config.getBoolean('virtualScrollEventAssist')) {
        // use JS scrolling for iOS UIWebView
        // goal is to completely remove this when iOS
        // fully supports scroll events
        // listen to JS scroll events
        this._content.enableJsScroll();
      }

      this._scrollSub = this._content.ionScroll.subscribe((ev: ScrollEvent) => {
        this.scrollUpdate(ev);
      });

      this._scrollEndSub = this._content.ionScrollEnd.subscribe((ev: ScrollEvent) => {
        this.scrollEnd(ev);
      });
    }
  }

  /**
   * DOM WRITE
   */
  private _setHeight(newVirtualHeight: number) {
    if (newVirtualHeight !== this._vHeight) {
      // ******** DOM WRITE ****************
      this._renderer.setElementStyle(this._elementRef.nativeElement, 'height', newVirtualHeight > 0 ? newVirtualHeight + 'px' : '');

      this._vHeight = newVirtualHeight;
      console.debug('VirtualScroll, height', newVirtualHeight);
    }
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    if (!this._itmTmp) {
      throw 'virtualItem required within virtualScroll';
    }

    if (!this.approxItemHeight) {
      this.approxItemHeight = '40px';
      console.warn('Virtual Scroll: Please provide an "approxItemHeight" input to ensure proper virtual scroll rendering');
    }
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._scrollSub && this._scrollSub.unsubscribe();
    this._scrollEndSub && this._scrollEndSub.unsubscribe();
  }

}

const SCROLL_DIFFERENCE_MINIMUM = 40;
const SCROLL_QUEUE_NO_CHANGES = 1;
const SCROLL_QUEUE_CHANGE_DETECTION = 2;
const SCROLL_QUEUE_DOM_WRITE = 3;
