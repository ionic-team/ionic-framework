import { Directive, EventEmitter, Host, Input, NgZone, Output } from '@angular/core';

import { Content } from '../content/content';
import { GESTURE_PRIORITY_REFRESHER, GESTURE_REFRESHER, GestureController, GestureDelegate } from '../../gestures/gesture-controller';
import { isTrueProperty } from '../../util/util';
import { Platform } from '../../platform/platform';
import { pointerCoord } from '../../util/dom';
import { PointerEvents } from '../../gestures/pointer-events';
import { UIEventManager } from '../../gestures/ui-event-manager';


/**
 * @name Refresher
 * @description
 * The Refresher provides pull-to-refresh functionality on a content component.
 * Place the `ion-refresher` as the first child of your `ion-content` element.
 *
 * Pages can then listen to the refresher's various output events. The
 * `refresh` output event is fired when the user has pulled down far
 * enough to kick off the refreshing process. Once the async operation
 * has completed and the refreshing should end, call `complete()`.
 *
 * Note: Do not wrap the `ion-refresher` in a `*ngIf`. It will not render
 * properly this way. Please use the `enabled` property instead to
 * display or hide the refresher.
 *
 * @usage
 * ```html
 * <ion-content>
 *
 *   <ion-refresher (ionRefresh)="doRefresh($event)">
 *     <ion-refresher-content></ion-refresher-content>
 *   </ion-refresher>
 *
 * </ion-content>
 * ```
 *
 * ```ts
 * @Component({...})
 * export class NewsFeedPage {
 *
 *   doRefresh(refresher) {
 *     console.log('Begin async operation', refresher);
 *
 *     setTimeout(() => {
 *       console.log('Async operation has ended');
 *       refresher.complete();
 *     }, 2000);
 *   }
 *
 * }
 * ```
 *
 *
 * ## Refresher Content
 *
 * By default, Ionic provides the pulling icon and refreshing spinner that
 * looks best for the platform the user is on. However, you can change the
 * default icon and spinner, along with adding text for each state by
 * adding properties to the child `ion-refresher-content` component.
 *
 *  ```html
 *  <ion-content>
 *
 *    <ion-refresher (ionRefresh)="doRefresh($event)">
 *      <ion-refresher-content
 *        pullingIcon="arrow-dropdown"
 *        pullingText="Pull to refresh"
 *        refreshingSpinner="circles"
 *        refreshingText="Refreshing...">
 *      </ion-refresher-content>
 *    </ion-refresher>
 *
 *  </ion-content>
 *  ```
 *
 *
 * ## Further Customizing Refresher Content
 *
 * The `ion-refresher` component holds the refresh logic.
 * It requires a child component in order to display the content.
 * Ionic uses `ion-refresher-content` by default. This component
 * displays the refresher and changes the look depending
 * on the refresher's state. Separating these components
 * allows developers to create their own refresher content
 * components. You could replace our default content with
 * custom SVG or CSS animations.
 *
 * @demo /docs/demos/src/refresher/
 *
 */
@Directive({
  selector: 'ion-refresher',
  host: {
    '[class.refresher-active]': 'state !== "inactive"',
    '[style.top]': '_top'
  }
})
export class Refresher {
  _appliedStyles: boolean = false;
  _didStart: boolean;
  _lastCheck: number = 0;
  _isEnabled: boolean = true;
  _gesture: GestureDelegate;
  _events: UIEventManager;
  _pointerEvents: PointerEvents;
  _top: string = '';

  /**
   * The current state which the refresher is in. The refresher's states include:
   *
   * - `inactive` - The refresher is not being pulled down or refreshing and is currently hidden.
   * - `pulling` - The user is actively pulling down the refresher, but has not reached the point yet that if the user lets go, it'll refresh.
   * - `cancelling` - The user pulled down the refresher and let go, but did not pull down far enough to kick off the `refreshing` state. After letting go, the refresher is in the `cancelling` state while it is closing, and will go back to the `inactive` state once closed.
   * - `ready` - The user has pulled down the refresher far enough that if they let go, it'll begin the `refreshing` state.
   * - `refreshing` - The refresher is actively waiting on the async operation to end. Once the refresh handler calls `complete()` it will begin the `completing` state.
   * - `completing` - The `refreshing` state has finished and the refresher is in the process of closing itself. Once closed, the refresher will go back to the `inactive` state.
   */
  state: string = STATE_INACTIVE;

  /**
   * The Y coordinate of where the user started to the pull down the content.
   */
  startY: number = null;

  /**
   * The current touch or mouse event's Y coordinate.
   */
  currentY: number = null;

  /**
   * The distance between the start of the pull and the current touch or
   * mouse event's Y coordinate.
   */
  deltaY: number = null;

  /**
   * A number representing how far down the user has pulled.
   * The number `0` represents the user hasn't pulled down at all. The
   * number `1`, and anything greater than `1`, represents that the user
   * has pulled far enough down that when they let go then the refresh will
   * happen. If they let go and the number is less than `1`, then the
   * refresh will not happen, and the content will return to it's original
   * position.
   */
  progress: number = 0;

  /**
   * @input {number} The min distance the user must pull down until the
   * refresher can go into the `refreshing` state. Default is `60`.
   */
  @Input() pullMin: number = 60;

  /**
   * @input {number} The maximum distance of the pull until the refresher
   * will automatically go into the `refreshing` state. By default, the pull
   * maximum will be the result of `pullMin + 60`.
   */
  @Input() pullMax: number = this.pullMin + 60;

  /**
   * @input {number} How many milliseconds it takes to close the refresher. Default is `280`.
   */
  @Input() closeDuration: number = 280;

  /**
   * @input {number} How many milliseconds it takes the refresher to to snap back to the `refreshing` state. Default is `280`.
   */
  @Input() snapbackDuration: number = 280;

  /**
   * @input {boolean} If the refresher is enabled or not. This should be used in place of an `ngIf`. Default is `true`.
   */
  @Input()
  get enabled(): boolean {
    return this._isEnabled;
  }

  set enabled(val: boolean) {
    this._isEnabled = isTrueProperty(val);
    this._setListeners(this._isEnabled);
  }

  /**
   * @output {event} Emitted when the user lets go and has pulled down
   * far enough, which would be farther than the `pullMin`, then your refresh hander if
   * fired and the state is updated to `refreshing`. From within your refresh handler,
   * you must call the `complete()` method when your async operation has completed.
   */
  @Output() ionRefresh: EventEmitter<Refresher> = new EventEmitter<Refresher>();

  /**
   * @output {event} Emitted while the user is pulling down the content and exposing the refresher.
   */
  @Output() ionPull: EventEmitter<Refresher> = new EventEmitter<Refresher>();

  /**
   * @output {event} Emitted when the user begins to start pulling down.
   */
  @Output() ionStart: EventEmitter<Refresher> = new EventEmitter<Refresher>();


  constructor(private _plt: Platform, @Host() private _content: Content, private _zone: NgZone, gestureCtrl: GestureController) {
    this._events = new UIEventManager(_plt);
    _content._hasRefresher = true;
    this._gesture = gestureCtrl.createGesture({
      name: GESTURE_REFRESHER,
      priority: GESTURE_PRIORITY_REFRESHER
    });
  }

  _onStart(ev: TouchEvent): any {
    // if multitouch then get out immediately
    if (ev.touches && ev.touches.length > 1) {
      return false;
    }
    if (this.state !== STATE_INACTIVE) {
      return false;
    }

    let scrollHostScrollTop = this._content.getContentDimensions().scrollTop;
    // if the scrollTop is greater than zero then it's
    // not possible to pull the content down yet
    if (scrollHostScrollTop > 0) {
      return false;
    }

    if (!this._gesture.canStart()) {
      return false;
    }

    let coord = pointerCoord(ev);
    console.debug('Pull-to-refresh, onStart', ev.type, 'y:', coord.y);

    if (this._content.contentTop > 0) {
      let newTop = this._content.contentTop + 'px';
      if (this._top !== newTop) {
        this._top = newTop;
      }
    }

    this.startY = this.currentY = coord.y;
    this.progress = 0;
    this.state = STATE_INACTIVE;
    return true;
  }

  _onMove(ev: TouchEvent) {
    // this method can get called like a bazillion times per second,
    // so it's built to be as efficient as possible, and does its
    // best to do any DOM read/writes only when absolutely necessary

    // if multitouch then get out immediately
    if (ev.touches && ev.touches.length > 1) {
      return 1;
    }

    if (!this._gesture.canStart()) {
      return 0;
    }

    // do nothing if it's actively refreshing
    // or it's in the process of closing
    // or this was never a startY
    if (this.startY === null || this.state === STATE_REFRESHING || this.state === STATE_CANCELLING || this.state === STATE_COMPLETING) {
      return 2;
    }

    // if we just updated stuff less than 16ms ago
    // then don't check again, just chillout plz
    let now = Date.now();
    if (this._lastCheck + 16 > now) {
      return 3;
    }

    // remember the last time we checked all this
    this._lastCheck = now;

    // get the current pointer coordinates
    let coord = pointerCoord(ev);

    this.currentY = coord.y;

    // it's now possible they could be pulling down the content
    // how far have they pulled so far?
    this.deltaY = (coord.y - this.startY);

    // don't bother if they're scrolling up
    // and have not already started dragging
    if (this.deltaY <= 0) {
      // the current Y is higher than the starting Y
      // so they scrolled up enough to be ignored
      this.progress = 0;

      if (this.state !== STATE_INACTIVE) {
        this._zone.run(() => {
          this.state = STATE_INACTIVE;
        });
      }

      if (this._appliedStyles) {
        // reset the styles only if they were applied
        this._setCss(0, '', false, '');
        return 5;
      }

      return 6;
    }

    if (this.state === STATE_INACTIVE) {
      // this refresh is not already actively pulling down

      // get the content's scrollTop
      let scrollHostScrollTop = this._content.getContentDimensions().scrollTop;

      // if the scrollTop is greater than zero then it's
      // not possible to pull the content down yet
      if (scrollHostScrollTop > 0) {
        this.progress = 0;
        this.startY = null;
        return 7;
      }

      // content scrolled all the way to the top, and dragging down
      this.state = STATE_PULLING;
    }

    // prevent native scroll events
    ev.preventDefault();

    // the refresher is actively pulling at this point
    // move the scroll element within the content element
    this._setCss(this.deltaY, '0ms', true, '');

    if (!this.deltaY) {
      // don't continue if there's no delta yet
      this.progress = 0;
      return 8;
    }

    // so far so good, let's run this all back within zone now
    this._zone.run(() => {
      this._onMoveInZone();
    });
  }

  _onMoveInZone() {
    // set pull progress
    this.progress = (this.deltaY / this.pullMin);

    // emit "start" if it hasn't started yet
    if (!this._didStart) {
      this._didStart = true;
      this.ionStart.emit(this);
    }

    // emit "pulling" on every move
    this.ionPull.emit(this);

    // do nothing if the delta is less than the pull threshold
    if (this.deltaY < this.pullMin) {
      // ensure it stays in the pulling state, cuz its not ready yet
      this.state = STATE_PULLING;
      return 2;
    }

    if (this.deltaY > this.pullMax) {
      // they pulled farther than the max, so kick off the refresh
      this._beginRefresh();
      return 3;
    }

    // pulled farther than the pull min!!
    // it is now in the `ready` state!!
    // if they let go then it'll refresh, kerpow!!
    this.state = STATE_READY;

    return 4;
  }

  _onEnd() {
    // only run in a zone when absolutely necessary

    if (this.state === STATE_READY) {
      this._zone.run(() => {
        // they pulled down far enough, so it's ready to refresh
        this._beginRefresh();
      });

    } else if (this.state === STATE_PULLING) {
      this._zone.run(() => {
        // they were pulling down, but didn't pull down far enough
        // set the content back to it's original location
        // and close the refresher
        // set that the refresh is actively cancelling
        this.cancel();
      });
    }

    // reset on any touchend/mouseup
    this.startY = null;
  }

  _beginRefresh() {
    // assumes we're already back in a zone
    // they pulled down far enough, so it's ready to refresh
    this.state = STATE_REFRESHING;

    // place the content in a hangout position while it thinks
    this._setCss(this.pullMin, (this.snapbackDuration + 'ms'), true, '');

    // emit "refresh" because it was pulled down far enough
    // and they let go to begin refreshing
    this.ionRefresh.emit(this);
  }

  /**
   * Call `complete()` when your async operation has completed.
   * For example, the `refreshing` state is while the app is performing
   * an asynchronous operation, such as receiving more data from an
   * AJAX request. Once the data has been received, you then call this
   * method to signify that the refreshing has completed and to close
   * the refresher. This method also changes the refresher's state from
   * `refreshing` to `completing`.
   */
  complete() {
    this._close(STATE_COMPLETING, '120ms');
  }

  /**
   * Changes the refresher's state from `refreshing` to `cancelling`.
   */
  cancel() {
    this._close(STATE_CANCELLING, '');
  }

  _close(state: string, delay: string) {
    var timer: number;

    function close(ev: TransitionEvent) {
      // closing is done, return to inactive state
      if (ev) {
        clearTimeout(timer);
      }

      this.state = STATE_INACTIVE;
      this.progress = 0;
      this._didStart = this.startY = this.currentY = this.deltaY = null;
      this._setCss(0, '0ms', false, '');
    }

    // create fallback timer incase something goes wrong with transitionEnd event
    timer = setTimeout(close.bind(this), 600);

    // create transition end event on the content's scroll element
    this._content.onScrollElementTransitionEnd(close.bind(this));

    // reset set the styles on the scroll element
    // set that the refresh is actively cancelling/completing
    this.state = state;
    this._setCss(0, '', true, delay);

    if (this._pointerEvents) {
      this._pointerEvents.stop();
    }
  }

  _setCss(y: number, duration: string, overflowVisible: boolean, delay: string) {
    this._appliedStyles = (y > 0);

    const content = this._content;
    const Css = this._plt.Css;
    content.setScrollElementStyle(Css.transform, ((y > 0) ? 'translateY(' + y + 'px) translateZ(0px)' : 'translateZ(0px)'));
    content.setScrollElementStyle(Css.transitionDuration, duration);
    content.setScrollElementStyle(Css.transitionDelay, delay);
    content.setScrollElementStyle('overflow', (overflowVisible ? 'hidden' : ''));
  }

  _setListeners(shouldListen: boolean) {
    this._events.unlistenAll();
    this._pointerEvents = null;
    if (shouldListen) {
      this._pointerEvents = this._events.pointerEvents({
        element: this._content.getScrollElement(),
        pointerDown: this._onStart.bind(this),
        pointerMove: this._onMove.bind(this),
        pointerUp: this._onEnd.bind(this),
        zone: false
      });
    }
  }

  /**
   * @hidden
   */
  ngOnInit() {
    // bind event listeners
    // save the unregister listener functions to use onDestroy
    this._setListeners(this._isEnabled);
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._setListeners(false);
    this._events.destroy();
    this._gesture.destroy();
  }

}

const STATE_INACTIVE = 'inactive';
const STATE_PULLING = 'pulling';
const STATE_READY = 'ready';
const STATE_REFRESHING = 'refreshing';
const STATE_CANCELLING = 'cancelling';
const STATE_COMPLETING = 'completing';
