import { App } from '../app/app';
import { Config } from '../../config/config';
import { NavOptions } from '../../navigation/nav-util';
import { ToastOptions } from './toast-options';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export declare class Toast extends ViewController {
    private _app;
    constructor(app: App, opts: ToastOptions, config: Config);
    /**
    * @hidden
    */
    getTransitionName(direction: string): string;
    /**
    * @hidden
    */
    isValidPosition(position: string): boolean;
    /**
     * @param {string} message  Toast message content
     */
    setMessage(message: string): Toast;
    /**
     * @param {number} dur  Toast message duration
     */
    setDuration(dur: number): Toast;
    /**
     * @param {'top'|'middle'|'bottom'} pos  Toast message position
     */
    setPosition(pos: 'top' | 'middle' | 'bottom'): Toast;
    /**
     * @param {string} cssClass  Toast message CSS class
     */
    setCssClass(cssClass: string): Toast;
    /**
     * @param {boolean} closeButton  Toast message close button
     */
    setShowCloseButton(closeButton: boolean): Toast;
    /**
     * Present the toast instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions): Promise<any>;
    /**
     * Dismiss all toast components which have been presented.
     */
    dismissAll(): void;
}
