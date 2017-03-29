import { Directive, ElementRef, EventEmitter, Input, NgZone, Output } from '@angular/core';

import { Content, ScrollEvent } from '../content/content';
import { DomController } from '../../platform/dom-controller';
import { assert } from '../../util/util';

/**
 * @name InfiniteScroll
 * @description
 * The Infinite Scroll allows you to perform an action when the user
 * scrolls a specified distance from the bottom or top of the page.
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
 *     for (let i = 0; i < 30; i++) {
 *       this.items.push( this.items.length );
 *     }
 *   }
 *
 *   doInfinite(infiniteScroll) {
 *     console.log('Begin async operation');
 *
 *     setTimeout(() => {
 *       for (let i = 0; i < 30; i++) {
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
 * ## `waitFor` method of InfiniteScroll
 *
 * In case if your async operation returns promise you can utilize
 * `waitFor` method inside your template.
 *
 * ```html
 * <ion-content>
 *
 *  <ion-list>
 *    <ion-item *ngFor="let item of items">{{item}}</ion-item>
 *  </ion-list>
 *
 *  <ion-infinite-scroll (ionInfinite)="$event.waitFor(doInfinite())">
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
 *   doInfinite(): Promise<any> {
 *     console.log('Begin async operation');
 *
 *     return new Promise((resolve) => {
 *       setTimeout(() => {
 *         for (var i = 0; i < 30; i++) {
 *           this.items.push( this.items.length );
 *         }
 *
 *         console.log('Async operation has ended');
 *         resolve();
 *       }, 500);
 *     })
 *   }
 * }
 * ```
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
 * @demo /docs/demos/src/infinite-scroll/
 *
 */
@Directive({
  selector: 'ion-infinite-scroll'
})
export class InfiniteScroll {
  _lastCheck: number = 0;
  _highestY: number = 0;
  _scLsn: any;
  _thr: string = '15%';
  _thrPx: number = 0;
  _thrPc: number = 0.15;
  _position: string = POSITION_BOTTOM;
  _init: boolean = false;


  /**
   * @internal
   */
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
   * @input {boolean} If true, Whether or not the infinite scroll should be
   * enabled or not. Setting to `false` will remove scroll event listeners
   * and hide the display.
   */
  @Input()
  set enabled(shouldEnable: boolean) {
    this.enable(shouldEnable);
  }

  /**
   * @input {string} The position of the infinite scroll element.
   * The value can be either `top` or `bottom`.
   * Default is `bottom`.
   */
  @Input()
  get position(): string {
    return this._position;
  }
  set position(val: string) {
    if (val === POSITION_TOP || val === POSITION_BOTTOM) {
      this._position = val;
    } else {
      console.error(`Invalid value for ion-infinite-scroll's position input. Its value should be '${POSITION_BOTTOM}' or '${POSITION_TOP}'.`);
    }
  }

  /**
   * @output {event} Emitted when the scroll reaches
   * the threshold distance. From within your infinite handler,
   * you must call the infinite scroll's `complete()` method when
   * your async operation has completed.
   */
  @Output() ionInfinite: EventEmitter<InfiniteScroll> = new EventEmitter<InfiniteScroll>();

  constructor(
    private _content: Content,
    private _zone: NgZone,
    private _elementRef: ElementRef,
    private _dom: DomController
  ) {
    _content.setElementClass('has-infinite-scroll', true);
  }

  _onScroll(ev: ScrollEvent) {
    if (this.state === STATE_LOADING || this.state === STATE_DISABLED) {
      return 1;
    }

    if (this._lastCheck + 32 > ev.timeStamp) {
      // no need to check less than every XXms
      return 2;
    }
    this._lastCheck = ev.timeStamp;

    // ******** DOM READ ****************
    const infiniteHeight = this._elementRef.nativeElement.scrollHeight;
    if (!infiniteHeight) {
      // if there is no height of this element then do nothing
      return 3;
    }

    // ******** DOM READ ****************
    const d = this._content.getContentDimensions();
    const height = d.contentHeight;

    const threshold = this._thrPc ? (height * this._thrPc) : this._thrPx;

    // ******** DOM READS ABOVE / DOM WRITES BELOW ****************

    let distanceFromInfinite: number;

    if (this._position === POSITION_BOTTOM) {
      distanceFromInfinite = d.scrollHeight - infiniteHeight - d.scrollTop - height - threshold;
    } else {
      assert(this._position === POSITION_TOP, '_position should be top');
      distanceFromInfinite = d.scrollTop - infiniteHeight - threshold;
    }

    if (distanceFromInfinite < 0) {
      // ******** DOM WRITE ****************
      this._dom.write(() => {
        this._zone.run(() => {
          if (this.state !== STATE_LOADING && this.state !== STATE_DISABLED) {
            this.state = STATE_LOADING;
            this.ionInfinite.emit(this);
          }
        });
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
    if (this.state !== STATE_LOADING) {
      return;
    }

    if (this._position === POSITION_BOTTOM) {
      this.state = STATE_ENABLED;
      return;
    }

    assert(this._position === POSITION_TOP, 'position should be top');
    /* New content is being added at the top, but the scrollTop position stays the same,
      which causes a scroll jump visually. This algorithm makes sure to prevent this.

      (Frame 1)
        complete() is called, but the UI hasn't had time to update yet.
        Save the current content dimensions.
        Wait for the next frame using _dom.read, so the UI will be updated.

      (Frame 2)
        Read the new content dimensions.
        Calculate the height difference and the new scroll position.
        Delay the scroll position change until other possible dom reads are done using _dom.write to be performant.

      (Still frame 2, if I'm correct)
        Change the scroll position (= visually maintain the scroll position).
        Change the state to re-enable the InfiniteScroll. This should be after changing the scroll position, or it could cause the InfiniteScroll to be triggered again immediately.

      (Frame 3)
        Done.
    */

    // ******** DOM READ ****************
    // Save the current content dimensions before the UI updates
    const prevDim = this._content.getContentDimensions();

    // ******** DOM READ ****************
    this._dom.read(() => {
      // UI has updated, save the new content dimensions
      const newDim = this._content.getContentDimensions();

      // New content was added on top, so the scroll position should be changed immediately to prevent it from jumping around
      const newScrollTop = newDim.scrollHeight - (prevDim.scrollHeight - prevDim.scrollTop);

      // ******** DOM WRITE ****************
      this._dom.write(() => {
        this._content.scrollTop = newScrollTop;
        this.state = STATE_ENABLED;
      });
    });
  }

  /**
  * Pass a promise inside `waitFor()` within the `infinite` output event handler in order to
  * change state of infiniteScroll to "complete"
  */
  waitFor(action: Promise<any>) {
    const enable = this.complete.bind(this);
    action.then(enable, enable);
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

  /**
   * @hidden
   */
  _setListeners(shouldListen: boolean) {
    if (this._init) {
      if (shouldListen) {
        if (!this._scLsn) {
          this._scLsn = this._content.ionScroll.subscribe(this._onScroll.bind(this));
        }
      } else {
        this._scLsn && this._scLsn.unsubscribe();
        this._scLsn = null;
      }
    }
  }

  /**
   * @hidden
   */
  ngAfterContentInit() {
    this._init = true;
    this._setListeners(this.state !== STATE_DISABLED);

    if (this._position === POSITION_TOP) {
      this._content.scrollDownOnLoad = true;
    }
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._setListeners(false);
  }

}

const STATE_ENABLED = 'enabled';
const STATE_DISABLED = 'disabled';
const STATE_LOADING = 'loading';

const POSITION_TOP = 'top';
const POSITION_BOTTOM = 'bottom';
