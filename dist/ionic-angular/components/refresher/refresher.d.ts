import { EventEmitter, NgZone } from '@angular/core';
import { Content } from '../content/content';
import { GestureController, GestureDelegate } from '../../gestures/gesture-controller';
import { Platform } from '../../platform/platform';
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
export declare class Refresher {
    private _plt;
    private _content;
    private _zone;
    _appliedStyles: boolean;
    _didStart: boolean;
    _lastCheck: number;
    _isEnabled: boolean;
    _gesture: GestureDelegate;
    _events: UIEventManager;
    _pointerEvents: PointerEvents;
    _top: string;
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
    state: string;
    /**
     * The Y coordinate of where the user started to the pull down the content.
     */
    startY: number;
    /**
     * The current touch or mouse event's Y coordinate.
     */
    currentY: number;
    /**
     * The distance between the start of the pull and the current touch or
     * mouse event's Y coordinate.
     */
    deltaY: number;
    /**
     * A number representing how far down the user has pulled.
     * The number `0` represents the user hasn't pulled down at all. The
     * number `1`, and anything greater than `1`, represents that the user
     * has pulled far enough down that when they let go then the refresh will
     * happen. If they let go and the number is less than `1`, then the
     * refresh will not happen, and the content will return to it's original
     * position.
     */
    progress: number;
    /**
     * @input {number} The min distance the user must pull down until the
     * refresher can go into the `refreshing` state. Default is `60`.
     */
    pullMin: number;
    /**
     * @input {number} The maximum distance of the pull until the refresher
     * will automatically go into the `refreshing` state. By default, the pull
     * maximum will be the result of `pullMin + 60`.
     */
    pullMax: number;
    /**
     * @input {number} How many milliseconds it takes to close the refresher. Default is `280`.
     */
    closeDuration: number;
    /**
     * @input {number} How many milliseconds it takes the refresher to to snap back to the `refreshing` state. Default is `280`.
     */
    snapbackDuration: number;
    /**
     * @input {boolean} If the refresher is enabled or not. This should be used in place of an `ngIf`. Default is `true`.
     */
    enabled: boolean;
    /**
     * @output {event} Emitted when the user lets go and has pulled down
     * far enough, which would be farther than the `pullMin`, then your refresh hander if
     * fired and the state is updated to `refreshing`. From within your refresh handler,
     * you must call the `complete()` method when your async operation has completed.
     */
    ionRefresh: EventEmitter<Refresher>;
    /**
     * @output {event} Emitted while the user is pulling down the content and exposing the refresher.
     */
    ionPull: EventEmitter<Refresher>;
    /**
     * @output {event} Emitted when the user begins to start pulling down.
     */
    ionStart: EventEmitter<Refresher>;
    constructor(_plt: Platform, _content: Content, _zone: NgZone, gestureCtrl: GestureController);
    _onStart(ev: TouchEvent): any;
    _onMove(ev: TouchEvent): 1 | 2 | 3 | 0 | 5 | 6 | 8 | 7;
    _onMoveInZone(): 2 | 3 | 4;
    _onEnd(): void;
    _beginRefresh(): void;
    /**
     * Call `complete()` when your async operation has completed.
     * For example, the `refreshing` state is while the app is performing
     * an asynchronous operation, such as receiving more data from an
     * AJAX request. Once the data has been received, you then call this
     * method to signify that the refreshing has completed and to close
     * the refresher. This method also changes the refresher's state from
     * `refreshing` to `completing`.
     */
    complete(): void;
    /**
     * Changes the refresher's state from `refreshing` to `cancelling`.
     */
    cancel(): void;
    _close(state: string, delay: string): void;
    _setCss(y: number, duration: string, overflowVisible: boolean, delay: string): void;
    _setListeners(shouldListen: boolean): void;
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
}
