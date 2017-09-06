import { App } from '../app/app';
import { Config } from '../../config/config';
import { NavOptions } from '../../navigation/nav-util';
import { PopoverOptions } from './popover-options';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export declare class PopoverImpl extends ViewController {
    private _app;
    constructor(app: App, component: any, data: any, opts: PopoverOptions, config: Config);
    /**
     * @hidden
     */
    getTransitionName(direction: string): any;
    /**
     * Present the popover instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions): Promise<any>;
}
