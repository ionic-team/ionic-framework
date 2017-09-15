import { App } from '../app/app';
import { Config } from '../../config/config';

import { ModalOptions } from './modal-options';
import { DeepLinker } from '../../navigation/deep-linker';

import { Overlay } from '../../navigation/overlay';
import { OverlayProxy } from '../../navigation/overlay-proxy';
import { ModalImpl } from './modal-impl';

/**
 * @hidden
 */
export class Modal extends OverlayProxy {

  public isOverlay: boolean = true;
  private _onDidDismissQueue: Array<(data: any, role: string) => void> = [];
  private _onWillDismissQueue: Array<() => void> = [];

  constructor(app: App, component: any, private data: any, private opts: ModalOptions = {}, config: Config, deepLinker: DeepLinker) {
    super(app, component, config, deepLinker);

    super.onDidDismiss((data: any, role: string) => {
      for (let it = 0; it < this._onDidDismissQueue.length; it++) {
        let didDismissCallback = this._onDidDismissQueue[it];
        didDismissCallback(data, role);
      }
    });

    super.onWillDismiss(() => {
      for (let it = 0; it < this._onWillDismissQueue.length; it++) {
        let willDismissCallback = this._onWillDismissQueue[it];
        willDismissCallback();
      }
    });
  }

  getImplementation(): Overlay {
    return new ModalImpl(this._app, this._component, this.data, this.opts, this._config);
  }

  onDidDismiss (callback: (data: any, role: string) => void ) {
    this._onDidDismissQueue.push(callback);
  }

  onWillDismiss (callback: () => void ) {
    this._onWillDismissQueue.push(callback);
  }
}
