import { App } from '../components/app/app';
/** @hidden */
export declare const GESTURE_GO_BACK_SWIPE = "goback-swipe";
/** @hidden */
export declare const GESTURE_MENU_SWIPE = "menu-swipe";
/** @hidden */
export declare const GESTURE_ITEM_SWIPE = "item-swipe";
/** @hidden */
export declare const GESTURE_REFRESHER = "refresher";
/** @hidden */
export declare const GESTURE_TOGGLE = "toggle";
/** @hidden */
export declare const GESTURE_PRIORITY_SLIDING_ITEM = -10;
/** @hidden */
export declare const GESTURE_PRIORITY_REFRESHER = 0;
/** @hidden */
export declare const GESTURE_PRIORITY_MENU_SWIPE = 10;
/** @hidden */
export declare const GESTURE_PRIORITY_GO_BACK_SWIPE = 20;
/** @hidden */
export declare const GESTURE_PRIORITY_TOGGLE = 30;
/**
* @hidden
*/
export interface GestureOptions {
    name: string;
    disableScroll?: boolean;
    priority?: number;
}
/**
* @hidden
*/
export interface BlockerOptions {
    disableScroll?: boolean;
    disable?: string[];
}
/**
* @hidden
*/
export declare const BLOCK_ALL: BlockerOptions;
/**
* @hidden
*/
export declare class GestureController {
    private _app;
    private id;
    private requestedStart;
    private disabledGestures;
    private disabledScroll;
    private capturedID;
    constructor(_app: App);
    createGesture(opts: GestureOptions): GestureDelegate;
    createBlocker(opts?: BlockerOptions): BlockerDelegate;
    newID(): number;
    start(gestureName: string, id: number, priority: number): boolean;
    capture(gestureName: string, id: number, priority: number): boolean;
    release(id: number): void;
    disableGesture(gestureName: string, id: number): void;
    enableGesture(gestureName: string, id: number): void;
    disableScroll(id: number): void;
    enableScroll(id: number): void;
    canStart(gestureName: string): boolean;
    isCaptured(): boolean;
    isScrollDisabled(): boolean;
    isDisabled(gestureName: string): boolean;
}
/**
* @hidden
*/
export declare class GestureDelegate {
    private name;
    private id;
    private controller;
    private priority;
    private disableScroll;
    constructor(name: string, id: number, controller: GestureController, priority: number, disableScroll: boolean);
    canStart(): boolean;
    start(): boolean;
    capture(): boolean;
    release(): void;
    destroy(): void;
}
/**
* @hidden
*/
export declare class BlockerDelegate {
    private id;
    private controller;
    private disable;
    private disableScroll;
    blocked: boolean;
    constructor(id: number, controller: GestureController, disable: string[], disableScroll: boolean);
    block(): void;
    unblock(): void;
    destroy(): void;
}
