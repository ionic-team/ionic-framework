import { App } from '../components/app/app';
import { Config } from '../config/config';
import { DeepLinker } from './deep-linker';
import { NavOptions } from './nav-util';
import { Overlay } from './overlay';
export declare class OverlayProxy {
    _app: App;
    _component: any;
    _config: Config;
    _deepLinker: DeepLinker;
    overlay: Overlay;
    _onWillDismiss: Function;
    _onDidDismiss: Function;
    constructor(_app: App, _component: any, _config: Config, _deepLinker: DeepLinker);
    getImplementation(): Overlay;
    /**
     * Present the modal instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions): Promise<any>;
    dismiss(data?: any, role?: string, navOptions?: NavOptions): Promise<any>;
    /**
     * Called when the current viewController has be successfully dismissed
     */
    onDidDismiss(callback: (data: any, role: string) => void): void;
    createAndPresentOverlay(navOptions: NavOptions): Promise<any>;
    /**
     * Called when the current viewController will be dismissed
     */
    onWillDismiss(callback: Function): void;
}
