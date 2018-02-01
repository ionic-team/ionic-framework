import { App } from '../app/app';
import { Config } from '../../config/config';
import { isPresent } from '../../util/util';
import { PORTAL_MODAL } from '../app/app-constants';
import { ModalCmp } from './modal-component';
import { ModalOptions } from './modal-options';
import { ModalMDSlideIn, ModalMDSlideOut, ModalSlideIn, ModalSlideOut } from './modal-transitions';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';

/**
 * @hidden
 */
export class ModalImpl extends ViewController {
  private _app: App;
  private _enterAnimation: string;
  private _leaveAnimation: string;

  constructor(app: App, component: any, data: any, opts: ModalOptions = {}, config: Config) {
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

    config.setTransition('modal-slide-in', ModalSlideIn);
    config.setTransition('modal-slide-out', ModalSlideOut);
    config.setTransition('modal-md-slide-in', ModalMDSlideIn);
    config.setTransition('modal-md-slide-out', ModalMDSlideOut);
  }

  /**
   * @hidden
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
   * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
    return this._app.present(this, navOptions, PORTAL_MODAL);
  }

}
