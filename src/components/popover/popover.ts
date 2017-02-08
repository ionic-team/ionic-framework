import { App } from '../app/app';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { PopoverCmp } from './popover-component';
import { PopoverOptions } from './popover-options';
import { ViewController } from '../../navigation/view-controller';


/**
 * @private
 */
export class Popover extends ViewController {
  private _app: App;

  constructor(app: App, component: any, data: any = {}, opts: PopoverOptions = {}) {
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    data.component = component;
    data.opts = opts;
    super(PopoverCmp, data, null);
    this._app = app;
    this.isOverlay = true;
  }

  /**
   * @private
   */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'popoverLeave' : 'popoverEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * Present the popover instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    return this._app.present(this, navOptions);
  }

}
