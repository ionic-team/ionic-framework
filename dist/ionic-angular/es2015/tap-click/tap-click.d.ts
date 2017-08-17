import { App } from '../components/app/app';
import { Config } from '../config/config';
import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { Platform } from '../platform/platform';
/**
 * @hidden
 */
export declare class TapClick {
    private plt;
    private app;
    private gestureCtrl;
    private disableClick;
    private usePolyfill;
    private activator;
    private startCoord;
    private events;
    private pointerEvents;
    private lastTouchEnd;
    private dispatchClick;
    constructor(config: Config, plt: Platform, dom: DomController, app: App, gestureCtrl: GestureController);
    pointerStart(ev: any): boolean;
    pointerMove(ev: UIEvent): void;
    pointerEnd(ev: any, pointerEventType: number): void;
    pointerCancel(ev: UIEvent): void;
    shouldCancelEvent(ev: UIEvent): boolean;
    click(ev: any): void;
    private shouldCancelClick(ev);
    private profileClickDelay(ev);
    handleTapPolyfill(ev: any): void;
    isDisabledNativeClick(): boolean;
}
/**
 * @hidden
 */
export declare function isActivatable(ele: HTMLElement): boolean;
/**
 * @hidden
 */
export declare function setupTapClick(config: Config, plt: Platform, dom: DomController, app: App, gestureCtrl: GestureController): () => TapClick;
