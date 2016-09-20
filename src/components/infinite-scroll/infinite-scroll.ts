import { Directive, ElementRef, EventEmitter, Host, Input, NgZone, Output } from '@angular/core';

import { Content } from '../content/content';


/**
 * @name InfiniteScroll
 * @description
 * The Infinite Scroll allows you to perform an action when the user
 * scrolls a specified distance from the bottom of the page.
 *
 * The expression assigned to the `infinite` event is called when
 * the user scrolls to the specified distance. When this expression
 * has finished its tasks, it should call the `complete()` method
 * on the infinite scroll instance.
 *
 * @usage
 * ```html
 * <ion-content>
 *
 *  <ion-list>
 *    <ion-item *ngFor="let i of items">{% raw %}{{i}}{% endraw %}</ion-item>
 *  </ion-list>
 *
 *  <ion-infinite-scroll (ionInfinite)="doInfinite($event)">
 *    <ion-infinite-scroll-content></ion-infinite-scroll-content>
 *  </ion-infinite-scroll>
 *
 * </ion-content>
 * ```
 *
 * ```ts
 * @Component({...})
 * export class NewsFeedPage {
 *   items = [];
 *
 *   constructor() {
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
 *       infiniteScroll.complete();
 *     }, 500);
 *   }
 *
 * }
 * ```
 *
 *
 * ## Infinite Scroll Content
 *
 * By default, Ionic uses the infinite scroll spinner that looks
 * best for the platform the user is on. However, you can change the
 * default spinner or add text by adding properties to the
 * `ion-infinite-scroll-content` component.
 *
 *  ```html
 *  <ion-content>
 *
 *    <ion-infinite-scroll (ionInfinite)="doInfinite($event)">
 *      <ion-infinite-scroll-content
 *        loadingSpinner="bubbles"
 *        loadingText="Loading more data...">
 *      </ion-infinite-scroll-content>
 *    </ion-infinite-scroll>
 *
 *  </ion-content>
 *  ```
 *
 *
 * ## Further Customizing Infinite Scroll Content
 *
 * The `ion-infinite-scroll` component holds the infinite scroll logic.
 * It requires a child component in order to display the content.
 * Ionic uses `ion-infinite-scroll-content` by default. This component
 * displays the infinite scroll and changes the look depending
 * on the infinite scroll's state. Separating these components allows
 * developers to create their own infinite scroll content components.
 * You could replace our default content with custom SVG or CSS animations.
 *
 * @demo /docs/v2/demos/src/infinite-scroll/
 *
 */
@Directive({
  selector: 'ion-infinite-scroll'
})
export class InfiniteScroll {
  _lastCheck: number = 0;
  _highestY: number = 0;
  _scLsn: Function;
  _thr: string = '15%';
  _thrPx: number = 0;
  _thrPc: number = 0.15;
  _init: boolean = false;

  state: string = STATE_ENABLED;

  /**
   * @input {string} The threshold distance from the bottom
   * of the content to call the `infinite` output event when scrolled.
   * The threshold value can be either a percent, or
   * in pixels. For example, use the value of `10%` for the `infinite`
   * output event to get called when the user has scrolled 10%
   * from the bottom of the page. Use the value `100px` when the
   * scroll is within 100 pixels from the bottom of the page.
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
   * the threshold distance. From within your infinite handler,
   * you must call the infinite scroll's `complete()` method when
   * your async operation has completed.
   */
  @Output() ionInfinite: EventEmitter<InfiniteScroll> = new EventEmitter<InfiniteScroll>();

  constructor(
    @Host() private _content: Content,
    private _zone: NgZone,
    private _elementRef: ElementRef
  ) {
    _content.setElementClass('has-infinite-scroll', true);
  }

  _onScroll() {
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

    let reloadY = d.contentHeight;
    if (this._thrPc) {
      reloadY += (reloadY * this._thrPc);
    } else {
      reloadY += this._thrPx;
    }

    let distanceFromInfinite = ((d.scrollHeight - infiniteHeight) - d.scrollTop) - reloadY;
    if (distanceFromInfinite < 0) {
      this._zone.run(() => {
        if (this.state !== STATE_LOADING && this.state !== STATE_DISABLED) {
          this.state = STATE_LOADING;
          this.ionInfinite.emit(this);
        }
      });
      return 5;
    }

    return 6;
  }

  /**
   * Call `complete()` within the `infinite` output event handler when
   * your async operation has completed. For example, the `loading`
   * state is while the app is performing an asynchronous operation,
   * such as receiving more data from an AJAX request to add more items
   * to a data list. Once the data has been received and UI updated, you
   * then call this method to signify that the loading has completed.
   * This method will change the infinite scroll's state from `loading`
   * to `enabled`.
   */
  complete() {
    this.state = STATE_ENABLED;
  }

  /**
   * Call `enable(false)` to disable the infinite scroll from actively
   * trying to receive new data while scrolling. This method is useful
   * when it is known that there is no more data that can be added, and
   * the infinite scroll is no longer needed.
   * @param {boolean} shouldEnable  If the infinite scroll should be
   * enabled or not. Setting to `false` will remove scroll event listeners
   * and hide the display.
   */
  enable(shouldEnable: boolean) {
    this.state = (shouldEnable ? STATE_ENABLED : STATE_DISABLED);
    this._setListeners(shouldEnable);
  }

  _setListeners(shouldListen: boolean) {
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
