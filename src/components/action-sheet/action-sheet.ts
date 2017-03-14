import { ActionSheetCmp } from './action-sheet-component';
import { ActionSheetOptions } from './action-sheet-options';
import { ActionSheetSlideIn, ActionSheetMdSlideIn, ActionSheetSlideOut, ActionSheetMdSlideOut, ActionSheetWpSlideIn, ActionSheetWpSlideOut } from './action-sheet-transitions';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';


/**
 * @hidden
 */
export class ActionSheet extends ViewController {
  private _app: App;

  constructor(app: App, opts: ActionSheetOptions, config: Config) {
    opts.buttons = opts.buttons || [];
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(ActionSheetCmp, opts, null);
    this._app = app;
    this.isOverlay = true;

    config.setTransition('action-sheet-slide-in', ActionSheetSlideIn);
    config.setTransition('action-sheet-slide-out', ActionSheetSlideOut);
    config.setTransition('action-sheet-md-slide-in', ActionSheetMdSlideIn);
    config.setTransition('action-sheet-md-slide-out', ActionSheetMdSlideOut);
    config.setTransition('action-sheet-wp-slide-in', ActionSheetWpSlideIn);
    config.setTransition('action-sheet-wp-slide-out', ActionSheetWpSlideOut);
  }

  /**
   * @hidden
   */
  getTransitionName(direction: string) {
    let key = 'actionSheet' + (direction === 'back' ? 'Leave' : 'Enter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {string} title Action sheet title
   */
  setTitle(title: string) {
    this.data.title = title;
  }

  /**
   * @param {string} subTitle Action sheet subtitle
   */
  setSubTitle(subTitle: string) {
    this.data.subTitle = subTitle;
  }

  /**
   * @param {object} button Action sheet button
   */
  addButton(button: any) {
    this.data.buttons.push(button);
  }

  /**
   * Present the action sheet instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
    return this._app.present(this, navOptions);
  }

}
