import { App } from '../app/app';
import { AppPortal } from '../app/app-root';
import { isPresent } from '../../util/util';
import { ModalCmp } from './modal-component';
import { ModalOptions } from './modal-options';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';


/**
 * @private
 */
export class Modal extends ViewController {
  private _app: App;
  private _enterAnimation: string;
  private _leaveAnimation: string;

  constructor(app: App, component: any, data: any, opts: ModalOptions = {}) {
    data = data || {};
    data.component = component;
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
    data.opts = opts;

    super(ModalCmp, data, null);
    this._app = app;
    this._enterAnimation = opts.enterAnimation;
    this._leaveAnimation = opts.leaveAnimation;

    this.isOverlay = true;
  }

  /**
   * @private
   */
  getTransitionName(direction: string): string {
    let key: string;
    if (direction === 'back') {
      if (this._leaveAnimation) {
        return this._leaveAnimation;
      }
      key = 'modalLeave';
    } else {
      if (this._enterAnimation) {
        return this._enterAnimation;
      }
      key = 'modalEnter';
    }
    return this._nav && this._nav.config.get(key);
  }

  /**
   * Present the action sheet instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
    return this._app.present(this, navOptions, AppPortal.MODAL);
  }

}
