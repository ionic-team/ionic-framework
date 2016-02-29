import {Directive, Input, Output, EventEmitter, Host, NgZone, ElementRef} from 'angular2/core';

import {Content} from '../content/content';


/**
 * @name InfiniteScroll
 * @description
 * The infinite scroll allows you to call a method whenever the user
 * gets to the bottom of the page or near the bottom of the page.
 *
 * The expression you add to the `infinite` output event is called when
 * the user scrolls greater than distance away from the bottom of the
 * content. Once your `infinite` handler is done loading new data, it
 * should call the `endLoading()` method on the infinite scroll instance.
 *
 * @usage
 * ```html
 * <ion-content>
 *
 *  <ion-list>
 *    <ion-item *ngFor="#i of items">{{i}}</ion-item>
 *  </ion-list>
 *
 *  <ion-infinite (infinite)="doInfinite($event)">
 *    <ion-infinite-content></ion-infinite-content>
 *  </ion-infinite>
 *
 * </ion-content>
 * ```
 *
 * ```ts
 * @Page({...})
 * export class NewsFeedPage {
 *
 *   constructor() {
 *     this.items = [];
 *     for (var i = 0; i < 30; i++) {
 *       this.items.push( this.items.length );
 *     }
 *   }
 *
 *   doInfinite(infiniteScroll) {
 *     console.log('Begin async operation');
 *
 *     setTimeout(() => {
 *       for (var i = 0; i < 30; i++) {
 *         this.items.push( this.items.length );
 *       }
 *
 *       console.log('Async operation has ended');
 *       infiniteScroll.endLoading();
 *     }, 500);
 *   }
 *
 * }
 * ```
 *
 *
 * ## Infinite Scroll Content
 *
 * By default, Ionic provides the infinite scroll spinner that looks
 * best for the platform the user is on. However, you can change the
 * default spinner, along with adding text by adding properties to
 * the child `ion-infinite-content` component.
 *
 *  ```html
 *  <ion-content>
 *
 *    <ion-infinite (infinite)="doInfinite($event)">
 *      <ion-infinite-content
 *        loadingSpinner="bubbles"
 *        loadingText="Loading more data...">
 *      </ion-infinite-content>
 *    </ion-infinite>
 *
 *  </ion-content>
 *  ```
 *
 *
 * ## Further Customizing Infinite Scroll Content
 *
 * The `ion-infinite` component holds the infinite scroll logic, and it
 * requires a child infinite scroll content component for its display.
 * The `ion-infinite-content` component is Ionic's default that shows
 * the actual display of the infinite scroll and changes its look depending
 * on the infinite scroll's state. With this separation, it also allows
 * developers to create their own infinite scroll content components.
 * Ideas include having some cool SVG or CSS animations that are
 * customized to your app and animates to your liking.
 *
 */
@Directive({
  selector: 'ion-infinite'
})
export class InfiniteScroll {
  private _lastCheck: number = 0;
  private _highestY: number = 0;
  private _scLsn: Function;
  private _thr: string = '15%';
  private _thrPx: number = 0;
  private _thrPc: number = 0.15;
  private _init: boolean = false;

  state: string = STATE_ENABLED;

  /**
   * @input {string} The threshold distance from the bottom
   * of the content to call the `infinite` output event when scrolled.
   * The threshold input value can be either a percent, or
   * in pixels. For example, use the value of `10%` for the `infinite`
   * output event to get called when the scroll has 10% of the scroll
   * left until it reaches the bottom. Use the value `100px` when the
   * scroll is within 100 pixels from the bottom of the content.
   * Default is `15%`.
   */
  @Input()
  get threshold(): string {
    return this._thr;
  }
  set threshold(val: string) {
    this._thr = val;
    if (val.indexOf('%') > -1) {
      this._thrPx = 0;
      this._thrPc = (parseFloat(val) / 100);

    } else {
      this._thrPx = parseFloat(val);
      this._thrPc = 0;
    }
  }

  /**
   * @output {event} The expression to call when the scroll reaches
   * the threshold input distance. From within your infinite handler,
   * you must call the infinite scroll's `endLoading()` method when
   * your async operation has completed.
   */
  @Output() infinite: EventEmitter<InfiniteScroll> = new EventEmitter();

  constructor(
    @Host() private _content: Content,
    private _zone: NgZone,
    private _elementRef: ElementRef
  ) {
    _content.addCssClass('has-infinite-scroll');
  }

  private _onScroll(ev) {
    if (this.state === STATE_LOADING || this.state === STATE_DISABLED) {
      return 1;
    }

    let now = Date.now();

    if (this._lastCheck + 32 > now) {
      // no need to check less than every XXms
      return 2;
    }
    this._lastCheck = now;

    let infiniteHeight = this._elementRef.nativeElement.scrollHeight;
    if (!infiniteHeight) {
      // if there is no height of this element then do nothing
      return 3;
    }

    let d = this._content.getContentDimensions();

    if (d.scrollTop <= this._highestY) {
      // don't bother if scrollY is less than the highest Y seen
      return 4;
    }
    this._highestY = d.scrollTop;

    let reloadY = d.contentHeight;
    if (this._thrPc) {
      reloadY += (reloadY * this._thrPc);
    } else {
      reloadY += this._thrPx
    }

    let distanceFromInfinite = ((d.scrollHeight - infiniteHeight) - d.scrollTop) - reloadY;
    if (distanceFromInfinite < 0) {
      this._zone.run(() => {
        console.debug('infinite scroll');
        this.state = STATE_LOADING;
        this.infinite.emit(this);
      });
      return 5;
    }

    return 6;
  }

  /**
   * Call `endLoading()` within the `infinite` output event handler when
   * your async operation has completed. For example, the `loading`
   * state is while the app is performing an asynchronous operation,
   * such as receiving more data from an AJAX request to add more items
   * to a data list. Once the data has been received and UI updated, you
   * then call this method to signify that the loading has completed.
   * This method will change the infinite scroll's state from `loading`
   * to `enabled`.
   */
  endLoading() {
    this.state = STATE_ENABLED;
  }

  /**
   * Call `enable(false)` to disable the infinite scroll from actively
   * trying to receive new data while scrolling. This method is useful
   * when it is known that there is no more data that can be added, and
   * the infinite scroll is no longer needed.
   * @param {boolean} shouldEnable  If the infinite scroll should be enabled or not. Setting to `false` will remove scroll event listeners and hide the display.
   */
  enable(shouldEnable: boolean) {
    this.state = (shouldEnable ? STATE_ENABLED : STATE_DISABLED);
    this._setListeners(shouldEnable);
  }

  private _setListeners(shouldListen: boolean) {
    if (this._init) {
      if (shouldListen) {
        if (!this._scLsn) {
          this._zone.runOutsideAngular(() => {
            this._scLsn = this._content.addScrollListener( this._onScroll.bind(this) );
          });
        }
      } else {
        this._scLsn && this._scLsn();
        this._scLsn = null;
      }
    }
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    this._init = true;
    this._setListeners(this.state !== STATE_DISABLED);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._setListeners(false);
  }

}

const STATE_ENABLED = 'enabled';
const STATE_DISABLED = 'disabled';
const STATE_LOADING = 'loading';
