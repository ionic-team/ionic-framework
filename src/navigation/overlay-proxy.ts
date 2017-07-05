import { App } from '../components/app/app';
import { Config } from '../config/config';
import { isString } from '../util/util';


import { DeepLinker } from './deep-linker';
import { NavOptions } from './nav-util';
import { Overlay } from './overlay';


export class OverlayProxy {

  overlay: Overlay;
  _onWillDismiss: Function;
  _onDidDismiss: Function;


  constructor(public _app: App, public _component: any, public _config: Config, public _deepLinker: DeepLinker) {
  }

  getImplementation(): Overlay {
    throw new Error('Child class must implement "getImplementation" method');
  }

  /**
   * Present the modal instance.
   *
   * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    // check if it's a lazy loaded component, or not
    const isLazyLoaded = isString(this._component);
    if (isLazyLoaded) {

      return this._deepLinker.getComponentFromName(this._component).then((loadedComponent: any) => {
        this._component = loadedComponent;
        return this.createAndPresentOverlay(navOptions);
      });
    } else {
      return this.createAndPresentOverlay(navOptions);
    }
  }

  dismiss(data?: any, role?: string, navOptions?: NavOptions): Promise<any> {
    if (this.overlay) {
      return this.overlay.dismiss(data, role, navOptions);
    }
  }

  /**
   * Called when the current viewController has be successfully dismissed
   */
  onDidDismiss(callback: (data: any, role: string) => void) {
    this._onDidDismiss = callback;
    if (this.overlay) {
      this.overlay.onDidDismiss(this._onDidDismiss);
    }
  }

  createAndPresentOverlay(navOptions: NavOptions) {
    this.overlay = this.getImplementation();
    this.overlay.onWillDismiss(this._onWillDismiss);
    this.overlay.onDidDismiss(this._onDidDismiss);
    return this.overlay.present(navOptions);
  }

  /**
   * Called when the current viewController will be dismissed
   */
  onWillDismiss(callback: Function) {
    this._onWillDismiss = callback;
    if (this.overlay) {
      this.overlay.onWillDismiss(this._onWillDismiss);
    }
  }
}
