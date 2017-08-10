import { STATE_DESTROYED } from './nav-utils';

import { NavController } from './nav-controller';
import { ViewController } from './view-controller';

import { assert } from '../utils/helpers';

import { FrameworkDelegate } from './framework-delegate';

export class ViewControllerImpl implements ViewController {

  id: string;
  data: any;
  element: HTMLElement;
  instance: any;
  state: number;
  nav: NavController;
  overlay: boolean;
  dismissProxy: any;
  frameworkDelegate: FrameworkDelegate;

  private onDidDismissCallback: (data: any, role: string) => void;
  private onWillDismissCallback: (data: any, role: string) => void;

  constructor(public component: any, data?: any) {
    if (!data) {
      this.data = {};
    }
  }

  /**
   * Called when the current viewController has be successfully dismissed
   */
  onDidDismiss(callback: (data: any, role: string) => void) {
    this.onDidDismissCallback = callback;
  }

  /**
   * Called when the current viewController will be dismissed
   */
  onWillDismiss(callback: (data: any, role: string) => void) {
    this.onWillDismissCallback = callback;
  }

  /**
   * Dismiss the current viewController
   * @param {any} [data] Data that you want to return when the viewController is dismissed.
   * @param {any} [role ]
   * @param {NavOptions} navOptions Options for the dismiss navigation.
   * @returns {any} data Returns the data passed in, if any.
   */
  dismiss(data?: any, role?: string, navOptions: any = {}): Promise<any> {
    this.dismissProxy = {};
    return dismiss(this.nav, this.dismissProxy, data, role, navOptions);
  }

  willLeave(_unload: boolean): Promise<any> {
    return Promise.resolve();
    // throw new Error("Method not implemented.");
  }

  willEnter(): Promise<any> {
    // throw new Error("Method not implemented.");
    return Promise.resolve();
  }

  didLeave(): Promise<any> {
    // throw new Error("Method not implemented.");
    return Promise.resolve();
  }

  didEnter(): Promise<any> {
    // throw new Error("Method not implemented.");
    return Promise.resolve();
  }

  willUnload(): Promise<any> {
    // throw new Error("Method not implemented.");
    return Promise.resolve();
  }

  destroy(): Promise<any> {
    return destroy(this);
  }

  getTransitionName(_direction: string): string {
    // TODO
    return '';
  }
}

export function callLifecycle(instance: any, methodName: string) {
  instance && instance[methodName] && instance[methodName]();
}

export function dismiss(navCtrl: any, dismissProxy: any, data?: any, role?: string, navOptions: any = {}): Promise<any> {
  if (!navCtrl) {
    assert(this._state === STATE_DESTROYED, 'ViewController does not have a valid _nav');
    return Promise.resolve(false);
  }

  if (this.overlay && !navOptions.minClickBlockDuration) {
    // This is a Modal being dismissed so we need
    // to add the minClickBlockDuration option
    // for UIWebView
    navOptions.minClickBlockDuration = 400;
  }

  dismissProxy.data = data;
  dismissProxy.role = role;

  const options = Object.assign({}, this._leavingOpts, navOptions);
  return navCtrl.removeView(this, options).then(() => data);
}

export function destroy(viewController: ViewController): Promise<any> {
  return Promise.resolve().then(() => {
    assert(viewController.state !== STATE_DESTROYED, 'view state must be attached');

    if (viewController.component) {
      // TODO - consider removing classes and styles as thats what we do in ionic-angular
    }

    if (viewController.frameworkDelegate) {
      return viewController.frameworkDelegate.destroy(viewController);
    }

    return null;
  }).then(() => {
    viewController.id = viewController.data = viewController.element = viewController.instance = viewController.nav = viewController.dismissProxy = viewController.frameworkDelegate = null;
    viewController.state = STATE_DESTROYED;
  });
}