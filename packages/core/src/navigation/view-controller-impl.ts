import { EventEmitter } from '@stencil/core';

import { ViewControllerDelegate } from './view-controller-delegate';
import { STATE_DESTROYED } from './nav-utils';


export class ViewControllerImpl {

  private cssClass: string;
  private ts: number;
  private instance: any;
  private id: string;
  private isOverlay: boolean = false;
  private detached: boolean = true;
  private onDidDismissCallback: (data: any, role: string) => void;
  private onWillDismissCallback: (data: any, role: string) => void;

  /*
   * @hidden
   */
  navCtrl: any;

  constructor(private delegate: ViewControllerDelegate, public component: any, public data?: any, rootCssClass: string = DEFAULT_CSS_CLASS) {
    if (!data) {
      this.data = {};
    }
  }

  init() {
    this.ts = Date.now();
    this.detached = false;
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
    return dismiss(this, data, role, navOptions);
  }
}

export function setNav(vc: ViewControllerImpl, nav: any) {
  vc.navCtrl = nav;
}

export function dismiss(navCtrl: any, data?: any, role?: string, navOptions: any = {}): Promise<any> {
  if (!navCtrl) {
    assert(this._state === STATE_DESTROYED, 'ViewController does not have a valid _nav');
    return Promise.resolve(false);
  }

  const options = Object.assign({}, this._leavingOpts, navOptions);
  return navCtrl.removeView(this, options).then(() => data);
}

const DEFAULT_CSS_CLASS = 'ion-page';
