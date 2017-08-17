import { ActionSheetButton, ActionSheetOptions } from './action-sheet-options';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export declare class ActionSheet extends ViewController {
    private _app;
    constructor(app: App, opts: ActionSheetOptions, config: Config);
    /**
     * @hidden
     */
    getTransitionName(direction: string): string;
    /**
     * @param {string} title Action sheet title
     */
    setTitle(title: string): ActionSheet;
    /**
     * @param {string} subTitle Action sheet subtitle
     */
    setSubTitle(subTitle: string): ActionSheet;
    /**
     * @param {object} button Action sheet button
     */
    addButton(button: ActionSheetButton | string): ActionSheet;
    /**
     * Present the action sheet instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions): Promise<any>;
}
