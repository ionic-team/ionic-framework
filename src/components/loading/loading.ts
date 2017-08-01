import { App } from '../app/app';
import { Config } from '../../config/config';
import { isPresent } from '../../util/util';
import { PORTAL_LOADING } from '../app/app-constants';
import { LoadingCmp } from './loading-component';
import { LoadingOptions } from './loading-options';
import { LoadingMdPopIn, LoadingMdPopOut, LoadingPopIn, LoadingPopOut, LoadingWpPopIn, LoadingWpPopOut } from './loading-transitions';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';

/**
 * @hidden
 */
export class Loading extends ViewController {
  private _app: App;

  constructor(app: App, opts: LoadingOptions = {}, config: Config) {
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : false;
    opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;

    super(LoadingCmp, opts, null);
    this._app = app;
    this.isOverlay = true;

    config.setTransition('loading-pop-in', LoadingPopIn);
    config.setTransition('loading-pop-out', LoadingPopOut);
    config.setTransition('loading-md-pop-in', LoadingMdPopIn);
    config.setTransition('loading-md-pop-out', LoadingMdPopOut);
    config.setTransition('loading-wp-pop-in', LoadingWpPopIn);
    config.setTransition('loading-wp-pop-out', LoadingWpPopOut);
  }

  /**
   * @hidden
   */
  getTransitionName(direction: string): string {
    let key = (direction === 'back' ? 'loadingLeave' : 'loadingEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {string} content sets the html content for the loading indicator.
   */
  setContent(content: string): Loading {
    this.data.content = content;
    return this;
  }

  /**
   * @param {string} spinner sets the name of the SVG spinner for the loading indicator.
   */
  setSpinner(spinner: string): Loading {
    this.data.spinner = spinner;
    return this;
  }

  /**
   * @param {string} cssClass sets additional classes for custom styles, separated by spaces.
   */
  setCssClass(cssClass: string): Loading {
    this.data.cssClass = cssClass;
    return this;
  }

  /**
   * @param {boolean} showBackdrop sets whether to show the backdrop.
   */
  setShowBackdrop(showBackdrop: boolean): Loading {
    this.data.showBackdrop = showBackdrop;
    return this;
  }

  /**
   * @param {number} dur how many milliseconds to wait before hiding the indicator.
   */
  setDuration(dur: number): Loading {
    this.data.duration = dur;
    return this;
  }

  /**
   * Present the loading instance.
   *
   * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}): Promise<any> {
    return this._app.present(this, navOptions, PORTAL_LOADING);
  }

  /**
   * Dismiss all loading components which have been presented.
   */
  dismissAll() {
    this._nav && this._nav.popAll();
  }

}
