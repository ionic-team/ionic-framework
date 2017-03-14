import { App } from '../app/app';
import { AlertCmp } from './alert-component';
import { AlertOptions, AlertInputOptions } from './alert-options';
import { AlertPopIn, AlertPopOut, AlertMdPopIn, AlertMdPopOut, AlertWpPopIn, AlertWpPopOut } from './alert-transitions';
import { Config } from '../../config/config';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { ViewController } from '../../navigation/view-controller';


/**
 * @hidden
 */
export class Alert extends ViewController {
  private _app: App;

  constructor(app: App, opts: AlertOptions = {}, config: Config) {
    opts.inputs = opts.inputs || [];
    opts.buttons = opts.buttons || [];
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(AlertCmp, opts, null);
    this._app = app;
    this.isOverlay = true;

    config.setTransition('alert-pop-in', AlertPopIn);
    config.setTransition('alert-pop-out', AlertPopOut);
    config.setTransition('alert-md-pop-in', AlertMdPopIn);
    config.setTransition('alert-md-pop-out', AlertMdPopOut);
    config.setTransition('alert-wp-pop-in', AlertWpPopIn);
    config.setTransition('alert-wp-pop-out', AlertWpPopOut);
  }

  /**
  * @hidden
  */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'alertLeave' : 'alertEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {string} title Alert title
   */
  setTitle(title: string) {
    this.data.title = title;
  }

  /**
   * @param {string} subTitle Alert subtitle
   */
  setSubTitle(subTitle: string) {
    this.data.subTitle = subTitle;
  }

  /**
   * @param {string} message  Alert message content
   */
  setMessage(message: string) {
    this.data.message = message;
  }

  /**
   * @param {object} input Alert input
   */
  addInput(input: AlertInputOptions) {
    this.data.inputs.push(input);
  }

  /**
   * @param {any} button Alert button
   */
  addButton(button: any) {
    this.data.buttons.push(button);
  }

  /**
   * @param {string} cssClass Set the CSS class names on the alert's outer wrapper.
   */
  setCssClass(cssClass: string) {
    this.data.cssClass = cssClass;
  }

  /**
   * @param {string} mode Set the mode of the alert (ios, md, wp).
   */
  setMode(mode: string) {
    this.data.mode = mode;
  }

  /**
   * Present the alert instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
    return this._app.present(this, navOptions);
  }

}
