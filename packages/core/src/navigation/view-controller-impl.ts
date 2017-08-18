import { FrameworkDelegate, Nav, ViewController } from './nav-interfaces';
import { STATE_ATTACHED, STATE_DESTROYED, STATE_INITIALIZED } from './nav-utils';

import { assert } from '../utils/helpers';

export class ViewControllerImpl implements ViewController {

  id: string;
  data: any;
  element: HTMLElement;
  instance: any;
  state: number;
  nav: Nav;
  overlay: boolean;
  zIndex: number;
  dismissProxy: any;
  frameworkDelegate: FrameworkDelegate;

  onDidDismiss: (data: any, role: string) => void;
  onWillDismiss: (data: any, role: string) => void;

  constructor(public component: any, data?: any) {
    this.data = data || {};
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

  willLeave(unload: boolean): void {
    willLeaveImpl(unload, this);
  }

  didLeave(): void {
    didLeaveImpl(this);
  }

  willEnter(): void {
    callLifeCycleFunction(this.instance, 'ionViewWillEnter');
  }

  didEnter(): void {
    didEnterImpl(this);
  }

  willLoad(): void {
    willLoadImpl(this);
  }

  didLoad(): void {
    didLoadImpl(this);
  }

  willUnload(): void {
    willUnloadImpl(this);
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

export function callLifeCycleFunction(instance: any, functionName: string) {
  instance && instance[functionName] && instance[functionName]();
}

export function willLeaveImpl(unload: boolean, viewController: ViewController) {
  callLifeCycleFunction(viewController.instance, 'ionViewWillLeave');
  if (unload && viewController.onWillDismiss) {
    viewController.onWillDismiss(this.dismissProxy.data, this.dismissProxy.proxy);
    viewController.onWillDismiss = null;
  }
}

export function didLeaveImpl(viewController: ViewController) {
  callLifeCycleFunction(viewController.instance, 'ionViewDidLeave');
  // TODO, maybe need to do something framework specific here... figure this out later
  // for example, disconnecting from change detection
}

export function willEnterImpl(viewController: ViewController) {
  assert(viewController.state === STATE_ATTACHED, 'view state must be ATTACHED');
  // TODO, maybe need to do something framework specific here... figure this out later
  // for example, connecting to change detection
  callLifeCycleFunction(viewController.instance, 'ionViewWillEnter');
}

export function didEnterImpl(viewController: ViewController) {
  assert(viewController.state === STATE_ATTACHED, 'view state must be ATTACHED');
  // TODO - navbar didEnter here
  callLifeCycleFunction(viewController.instance, 'ionViewDidEnter');
}

export function willLoadImpl(viewController: ViewController) {
  assert(viewController.state === STATE_INITIALIZED, 'view state must be INITIALIZED');
  callLifeCycleFunction(viewController.instance, 'ionViewWillLoad');
}

export function willUnloadImpl(viewController: ViewController) {
  callLifeCycleFunction(viewController.instance, 'ionViewWillUnLoad');
  viewController.onDidDismiss && viewController.onDidDismiss(viewController.dismissProxy.data, viewController.dismissProxy.role);

  viewController.onDidDismiss = viewController.dismissProxy = null;
}

export function didLoadImpl(viewController: ViewController) {
  assert(viewController.state === STATE_ATTACHED, 'view state must be ATTACHED');
  callLifeCycleFunction(viewController.instance, 'ionViewDidLoad');
}