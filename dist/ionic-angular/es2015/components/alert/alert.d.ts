import { App } from '../app/app';
import { AlertButton, AlertInputOptions, AlertOptions } from './alert-options';
import { Config } from '../../config/config';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export declare class Alert extends ViewController {
    private _app;
    constructor(app: App, opts: AlertOptions, config: Config);
    /**
    * @hidden
    */
    getTransitionName(direction: string): string;
    /**
     * @param {string} title Alert title
     */
    setTitle(title: string): Alert;
    /**
     * @param {string} subTitle Alert subtitle
     */
    setSubTitle(subTitle: string): Alert;
    /**
     * @param {string} message  Alert message content
     */
    setMessage(message: string): Alert;
    /**
     * @param {object} input Alert input
     */
    addInput(input: AlertInputOptions): Alert;
    /**
     * @param {any} button Alert button
     */
    addButton(button: AlertButton | string): Alert;
    /**
     * @param {string} cssClass Set the CSS class names on the alert's outer wrapper.
     */
    setCssClass(cssClass: string): Alert;
    /**
     * @param {string} mode Set the mode of the alert (ios, md, wp).
     */
    setMode(mode: string): void;
    /**
     * Present the alert instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions): Promise<any>;
}
