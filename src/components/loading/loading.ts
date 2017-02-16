import { App } from '../app/app';
import { isPresent } from '../../util/util';
import { PORTAL_LOADING } from '../app/app-root';
import { LoadingCmp } from './loading-component';
import { LoadingOptions } from './loading-options';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';

/**
 * @private
 */
export class Loading extends ViewController {
  private _app: App;

  constructor(app: App, opts: LoadingOptions = {}) {
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
    opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;

    super(LoadingCmp, opts, null);
    this._app = app;
    this.isOverlay = true;
  }

  /**
   * @private
   */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'loadingLeave' : 'loadingEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {string} content  loading message content
   */
  setContent(content: string) {
    this.data.content = content;
  }

  /**
   * Present the loading instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    return this._app.present(this, navOptions, PORTAL_LOADING);
  }

  /**
   * Dismiss all loading components which have been presented.
   */
  dismissAll() {
    this._nav && this._nav.popAll();
  }

}
