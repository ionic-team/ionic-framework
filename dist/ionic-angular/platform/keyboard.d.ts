import { EventEmitter, NgZone } from '@angular/core';
import { Config } from '../config/config';
import { DomController } from './dom-controller';
import { Platform } from './platform';
/**
 * @name Keyboard
 * @description
 * The `Keyboard` class allows you to work with the keyboard events provided
 * by the Ionic keyboard plugin.
 *
 * @usage
 * ```ts
 * export class MyClass {
 *   constructor(public keyboard: Keyboard) {
 *
 *   }
 * }
 * ```
 */
export declare class Keyboard {
    private _plt;
    private _zone;
    private _dom;
    _tmr: number;
    willShow: EventEmitter<void>;
    willHide: EventEmitter<void>;
    didShow: EventEmitter<void>;
    didHide: EventEmitter<void>;
    eventsAvailable: boolean;
    constructor(config: Config, _plt: Platform, _zone: NgZone, _dom: DomController);
    private listenV2(win);
    private listenV1(win);
    private blurActiveInput(shouldBlur);
    /**
     * Check to see if the keyboard is open or not.
     *
     * ```ts
     * export class MyClass {
     *   constructor(public keyboard: Keyboard) {
     *
     *   }
     *
     *   keyboardCheck() {
     *     console.log('The keyboard is open:', this.keyboard.isOpen());
     *   }
     * }
     * ```
     *
     * @return {boolean} returns a true or false value if the keyboard is open or not.
     */
    isOpen(): boolean;
    /**
     * When the keyboard is closed, call any methods you want.
     *
     * ```ts
     * export class MyClass {
     *   constructor(public keyboard: Keyboard) {
     *     this.keyboard.onClose(this.closeCallback);
     *   }
     *   closeCallback() {
     *     // call what ever functionality you want on keyboard close
     *     console.log('Closing time');
     *   }
     * }
     * ```
     *
     * @param {function} callback method you want to call when the keyboard has been closed.
     * @return {function} returns a callback that gets fired when the keyboard is closed.
     */
    onClose(callback: Function, pollingInternval?: number, pollingChecksMax?: number): Promise<any>;
    /**
     * Programmatically close the keyboard.
     */
    close(): void;
    /**
     * @hidden
     */
    focusOutline(setting: any): void;
    hasFocusedTextInput(): boolean;
}
