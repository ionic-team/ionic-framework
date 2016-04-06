import {Directive, ContentChild, ContentChildren, QueryList, IterableDiffers, IterableDiffer, TrackByFn, Input, Optional, Renderer, ElementRef, ChangeDetectorRef, NgZone, TemplateRef, ViewContainerRef, DoCheck, AfterContentInit, OnDestroy} from 'angular2/core';

import {Config} from '../../config/config';
import {Content} from '../content/content';
import {Platform} from '../../platform/platform';
import {ViewController} from '../nav/view-controller';
import {VirtualItem, VirtualHeader, VirtualFooter} from './virtual-item';
import {VirtualCell, VirtualNode, VirtualData} from './virtual-util';
import {processRecords, populateNodeData, initReadNodes, writeToNodes, updateDimensions, adjustRendered, calcDimensions, estimateHeight} from './virtual-util';
import {isBlank, isPresent, isFunction} from '../../util/util';
import {rafFrames, raf, cancelRaf, pointerCoord, nativeTimeout, clearNativeTimeout} from '../../util/dom';
import {Img} from '../img/img';


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
 *   <ion-item *virtualItem="#item">
 *     {{ item }}
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
 *   <ion-item-divider *virtualHeader="#header">
 *     Header: {{ header }}
 *   </ion-item>
 *
 *   <ion-item *virtualItem="#item">
 *     Item: {{ item }}
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
 * The approximate width and height of each template is used to help
 * determine how many cells should be created, and to help calculate
 * the height of the scrollable area. Note that the actual rendered size
 * of each cell comes from the app's CSS, whereas this approximation
 * is only used to help calculate initial dimensions.
 *
 * It's also important to know that Ionic's default item sizes have
 * slightly different heights between platforms, which is perfectly fine.
 * An exact pixel-perfect size is not necessary, but a good estimation
 * is important. Basically if each item is roughly 500px tall, rather than
 * the default of 40px tall, it's extremely important to know for virtual
 * scroll to calculate a good height.
 *
 *
 * ### Images Within Virtual Scroll
 *
 * Ionic provides `<ion-img>` to manage HTTP requests and image rendering.
 * Additionally, it includes a customizable placeholder element which shows
 * before the image has finished loading. While scrolling through items
 * quickly, `<ion-img>` knows not to make any image requests, and only loads
 * the images that are viewable after scrolling. It's also important for app
 * developers to ensure image sizes are locked in, and after images have fully
 * loaded they do not change size and affect any other element sizes.
 *
 * We recommend using our `<ion-img>` element over the native `<img>` element
 * because when an `<img>` element is added to the DOM, it immediately
 * makes a HTTP request for the image file. HTTP requests, image
 * decoding, and image rendering can cause issues while scrolling. For virtual
 * scrolling, the natural effects of the `<img>` are not desirable features.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <ion-item *virtualItem="#item">
 *     <ion-avatar item-left>
 *       <ion-img [src]="item.avatarUrl"></ion-img>
 *     </ion-avatar>
 *     {{ item.firstName }} {{ item.lastName }}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Performance Tips
 *
 * - Use `<ion-img>` rather than `<img>` so images are lazy loaded
 *   while scrolling.
 * - Image sizes should be locked in, meaning the size of any element
 *   should not change after the image has loaded.
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
  private _trackBy: TrackByFn;
  private _differ: IterableDiffer;
  private _unreg: Function;
  private _init: boolean;
  private _rafId: number;
  private _tmId: number;
  private _hdrFn: Function;
  private _ftrFn: Function;
  private _records: any[] = [];
  private _cells: VirtualCell[] = [];
  private _nodes: VirtualNode[] = [];
  private _vHeight: number = 0;
  private _lastCheck: number = 0;
  private _data: VirtualData = {
    scrollTop: 0,
  };
  private _eventAssist: boolean;
  private _queue: number = null;

  @ContentChild(VirtualItem) private _itmTmp: VirtualItem;
  @ContentChild(VirtualHeader) private _hdrTmp: VirtualHeader;
  @ContentChild(VirtualFooter) private _ftrTmp: VirtualFooter;
  @ContentChildren(Img) private _imgs: QueryList<Img>;

  /**
   * @input {array} The data that builds the templates within the virtual scroll.
   * This is the same data that you'd pass to `ngFor`. It's important to note
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
   * with a buffer ratio of `2` it will create `40` cells that are
   * available for reuse while scrolling. For better performance, it's
   * better to have more cells than what are required to fill the
   * viewable area. Default is `2`.
   */
  @Input() bufferRatio: number = 2;

  /**
   * @input {string} The approximate width of each item template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This value can use either `px` or `%` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions. Default is `100%`.
   */
  @Input() approxItemWidth: string = '100%';

  /**
   * @input {string} The approximate height of each item template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions. Default is `40px`.
   */
  @Input() approxItemHeight: string = '40px';

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
   * initial dimensions. Default is `40px`.
   */
  @Input() approxHeaderHeight: string = '40px';

  /**
   * @input {string} The approximate width of each footer template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This value can use either `px` or `%` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions. Default is `100%`.
   */
  @Input() approxFooterWidth: string = '100%';

  /**
   * @input {string} The approximate height of each footer template's cell.
   * This dimension is used to help determine how many cells should
   * be created when initialized, and to help calculate the height of
   * the scrollable area. This height value can only use `px` units.
   * Note that the actual rendered size of each cell comes from the
   * app's CSS, whereas this approximation is used to help calculate
   * initial dimensions. Default is `40px`.
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
      this._hdrFn = val.bind((this._ctrl && this._ctrl.instance) || this);
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
      this._ftrFn = val.bind((this._ctrl && this._ctrl.instance) || this);
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
    config: Config) {
      this._eventAssist = config.getBoolean('virtualScrollEventAssist');
    }

  /**
   * @private
   */
  ngDoCheck() {
    if (this._init) {
      this.update(true);
    }
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    if (!this._init) {

      if (!this._itmTmp) {
        throw 'virtualItem required within virtualScroll';
      }

      this.update(true);

      this._platform.onResize(() => {
        console.debug('VirtualScroll, onResize');
        this.update(false);
      });
    }
  }

  /**
   * @private
   * DOM READ THEN DOM WRITE
   */
  update(checkChanges: boolean) {
    var self = this;

    if (!self._records || !self._records.length) return;

    if (checkChanges) {
      if (isPresent(self._differ)) {
        let changes = self._differ.diff(self._records);
        if (!isPresent(changes)) return;
      }
    }

    console.debug('VirtualScroll, update, records:', self._records.length);

    // reset everything
    self._cells.length = 0;
    self._nodes.length = 0;
    self._itmTmp.viewContainer.clear();
    self._elementRef.nativeElement.parentElement.scrollTop = 0;

    let attempts = 0;
    function readDimensions(done: Function/* cuz promises add unnecessary overhead here */) {
      if (self._data.valid) {
        // good to go, we already have good dimension data
        done();

      } else {
        // ******** DOM READ ****************
        calcDimensions(self._data, self._elementRef.nativeElement.parentElement,
                      self.approxItemWidth, self.approxItemHeight,
                      self.approxHeaderWidth, self.approxHeaderHeight,
                      self.approxFooterWidth, self.approxFooterHeight,
                      self.bufferRatio);

        if (self._data.valid) {
          // sweet, we got some good dimension data!
          done();

        } else if (attempts < 30) {
          // oh no! the DOM doesn't have good data yet!
          // let's try again in XXms, and give up eventually if we never get data
          attempts++;
          raf(function() {
            readDimensions(done);
          });
        }
      }
    }

    // ******** DOM READ ****************
    readDimensions(function() {
      // we were able to read good DOM dimension data, let's do this!
      self._init = true;

      processRecords(self._data.renderHeight,
                    self._records,
                    self._cells,
                    self._hdrFn,
                    self._ftrFn,
                    self._data);

      // ******** DOM WRITE ****************
      self.renderVirtual();

      // ******** DOM WRITE ****************
      self._renderer.setElementClass(self._elementRef.nativeElement, 'virtual-scroll', true);

      // list for scroll events
      self.addScrollListener();
    });
  }

  /**
   * @private
   * DOM WRITE
   */
  renderVirtual() {
    // initialize nodes with the correct cell data
    this._data.topCell = 0;
    this._data.bottomCell = (this._cells.length - 1);

    populateNodeData(0, this._data.bottomCell,
                      this._data.viewWidth, true,
                      this._cells, this._records, this._nodes,
                      this._itmTmp.viewContainer,
                      this._itmTmp.templateRef,
                      this._hdrTmp && this._hdrTmp.templateRef,
                      this._ftrTmp && this._ftrTmp.templateRef, true);

    // ******** DOM WRITE ****************
    this._cd.detectChanges();

    // wait a frame before trying to read and calculate the dimensions
    raf(this.postRenderVirtual.bind(this));
  }

  /**
   * @private
   * DOM READ THEN DOM WRITE
   */
  postRenderVirtual() {
    // ******** DOM READ ****************
    calcDimensions(this._data, this._elementRef.nativeElement.parentElement,
                   this.approxItemWidth, this.approxItemHeight,
                   this.approxHeaderWidth, this.approxHeaderHeight,
                   this.approxFooterWidth, this.approxFooterHeight,
                   this.bufferRatio);

    // ******** DOM READ THEN DOM WRITE ****************
    initReadNodes(this._nodes, this._cells, this._data);


    // ******** DOM READS ABOVE / DOM WRITES BELOW ****************


    // ******** DOM WRITE ****************
    writeToNodes(this._nodes, this._cells, this._records.length);

    // ******** DOM WRITE ****************
    this.setVirtualHeight(
      estimateHeight(this._records.length, this._cells[this._cells.length - 1], this._vHeight, 0.25)
    );
  }

  /**
   * @private
   */
  scrollUpdate() {
    clearNativeTimeout(this._tmId);
    this._tmId = nativeTimeout(this.onScrollEnd.bind(this), SCROLL_END_TIMEOUT_MS);

    let data = this._data;

    if (this._queue === QUEUE_CHANGE_DETECTION) {
      // ******** DOM WRITE ****************
      let node: VirtualNode;
      for (var i = 0; i < this._nodes.length; i++) {
        node = this._nodes[i];
        if (node.hasChanges) {
          node.view['changeDetectorRef'].detectChanges();
          node.hasChanges = false;
        }
      }

      if (this._eventAssist) {
        // queue updating node positions in the next frame
        this._queue = QUEUE_WRITE_TO_NODES;

      } else {
        // update node positions right now
        // ******** DOM WRITE ****************
        writeToNodes(this._nodes, this._cells, this._records.length);
        this._queue = null;
      }

      // ******** DOM WRITE ****************
      this.setVirtualHeight(
        estimateHeight(this._records.length, this._cells[this._cells.length - 1], this._vHeight, 0.25)
      );

    } else if (this._queue === QUEUE_WRITE_TO_NODES) {
      // ******** DOM WRITE ****************
      writeToNodes(this._nodes, this._cells, this._records.length);
      this._queue = null;

    } else {

      data.scrollDiff = (data.scrollTop - this._lastCheck);

      if (Math.abs(data.scrollDiff) > 10) {
        // don't bother updating if the scrollTop hasn't changed much
        this._lastCheck = data.scrollTop;

        if (data.scrollDiff > 0) {
          // load data we may not have processed yet
          let stopAtHeight = (data.scrollTop + data.renderHeight);

          processRecords(stopAtHeight, this._records, this._cells,
                        this._hdrFn, this._ftrFn, data);
        }

        // ******** DOM READ ****************
        updateDimensions(this._nodes, this._cells, data, false);

        adjustRendered(this._cells, data);

        let madeChanges = populateNodeData(data.topCell, data.bottomCell,
                              data.viewWidth, data.scrollDiff > 0,
                              this._cells, this._records, this._nodes,
                              this._itmTmp.viewContainer,
                              this._itmTmp.templateRef,
                              this._hdrTmp && this._hdrTmp.templateRef,
                              this._ftrTmp && this._ftrTmp.templateRef, false);

        if (madeChanges) {
          // do not update images while scrolling
          this._imgs.toArray().forEach(img => {
            img.enable(false);
          });

          // queue making updates in the next frame
          this._queue = QUEUE_CHANGE_DETECTION;

        } else {
          this._queue = null;
        }
      }

    }
  }

  /**
   * @private
   * DOM WRITE
   */
  onScrollEnd() {
    // scrolling is done, allow images to be updated now
    this._imgs.toArray().forEach(img => {
      img.enable(true);
    });

    // ******** DOM READ ****************
    updateDimensions(this._nodes, this._cells, this._data, false);

    adjustRendered(this._cells, this._data);

    // ******** DOM WRITE ****************
    this._cd.detectChanges();

    // ******** DOM WRITE ****************
    this.setVirtualHeight(
      estimateHeight(this._records.length, this._cells[this._cells.length - 1], this._vHeight, 0.05)
    );
  }
  /**
   * @private
   * DOM WRITE
   */
  setVirtualHeight(newVirtualHeight: number) {
    if (newVirtualHeight !== this._vHeight) {
      // ******** DOM WRITE ****************
      this._renderer.setElementStyle(this._elementRef.nativeElement, 'height', newVirtualHeight > 0 ? newVirtualHeight + 'px' : '');
      this._vHeight = newVirtualHeight;
      console.debug('VirtualScroll, height', newVirtualHeight);
    }
  }

  /**
   * @private
   * NO DOM
   */
  addScrollListener() {
    let self = this;

    if (!self._unreg) {
      self._zone.runOutsideAngular(() => {

        function onScroll() {
          // ******** DOM READ ****************
          self._data.scrollTop = self._content.getScrollTop();

          // ******** DOM READ THEN DOM WRITE ****************
          self.scrollUpdate();
        }

        if (self._eventAssist) {
          // use JS scrolling for iOS UIWebView
          // goal is to completely remove this when iOS
          // fully supports scroll events
          // listen to JS scroll events
          self._unreg = self._content.jsScroll(onScroll);

        } else {
          // listen to native scroll events
          self._unreg = self._content.addScrollListener(onScroll);
        }

      });
    }
  }

  /**
   * @private
   * NO DOM
   */
  ngOnDestroy() {
    this._unreg && this._unreg();
    this._unreg = null;
  }

}

const SCROLL_END_TIMEOUT_MS = 140;

const QUEUE_CHANGE_DETECTION = 0;
const QUEUE_WRITE_TO_NODES = 1;
