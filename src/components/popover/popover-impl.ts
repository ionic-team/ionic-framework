import { App } from '../app/app';
import { Config } from '../../config/config';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { PopoverCmp } from './popover-component';
import { PopoverOptions } from './popover-options';
import { PopoverMdPopIn, PopoverMdPopOut, PopoverPopIn, PopoverPopOut } from './popover-transitions';
import { ViewController } from '../../navigation/view-controller';


/**
 * @hidden
 */
export class PopoverImpl extends ViewController {
  private _app: App;

  constructor(app: App, component: any, data: any = {}, opts: PopoverOptions = {}, config: Config) {
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    data.component = component;
    data.opts = opts;
    super(PopoverCmp, data, null);
    this._app = app;
    this.isOverlay = true;

    config.setTransition('popover-pop-in', PopoverPopIn);
    config.setTransition('popover-pop-out', PopoverPopOut);
    config.setTransition('popover-md-pop-in', PopoverMdPopIn);
    config.setTransition('popover-md-pop-out', PopoverMdPopOut);
  }

  /**
   * @hidden
   */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'popoverLeave' : 'popoverEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * Present the popover instance.
   *
   * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    return this._app.present(this, navOptions);
  }

}
