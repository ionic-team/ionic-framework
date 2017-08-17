import { App } from '../app/app';
import { Config } from '../../config/config';
import { ModalOptions } from './modal-options';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export declare class ModalImpl extends ViewController {
    private _app;
    private _enterAnimation;
    private _leaveAnimation;
    constructor(app: App, component: any, data: any, opts: ModalOptions, config: Config);
    /**
     * @hidden
     */
    getTransitionName(direction: string): string;
    /**
     * Present the action sheet instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions): Promise<any>;
}
