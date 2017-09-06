import { Platform } from '../platform/platform';
/**
 * @name Haptic
 * @description
 * The `Haptic` class interacts with a haptic engine on the device, if
 * available. Generally, Ionic components use this under the hood, but you're
 * welcome to get a bit crazy with it if you fancy.
 *
 * Currently, this uses the Taptic engine on iOS.
 *
 * @usage
 * ```ts
 * export class MyClass{
 *  constructor(haptic: Haptic){
 *    haptic.selection();
 *  }
 * }
 *
 * ```
 */
export declare class Haptic {
    private _p;
    constructor(plt: Platform);
    /**
     * Check to see if the Haptic Plugin is available
     * @return {boolean} Returns true or false if the plugin is available
     *
     */
    available(): boolean;
    /**
     * Trigger a selection changed haptic event. Good for one-time events
     * (not for gestures)
     */
    selection(): void;
    /**
     * Tell the haptic engine that a gesture for a selection change is starting.
     */
    gestureSelectionStart(): void;
    /**
     * Tell the haptic engine that a selection changed during a gesture.
     */
    gestureSelectionChanged(): void;
    /**
     * Tell the haptic engine we are done with a gesture. This needs to be
     * called lest resources are not properly recycled.
     */
    gestureSelectionEnd(): void;
    /**
     * Use this to indicate success/failure/warning to the user.
     * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
     */
    notification(options: {
        type: string;
    }): void;
    /**
     * Use this to indicate success/failure/warning to the user.
     * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
     */
    impact(options: {
        style: string;
    }): void;
}
