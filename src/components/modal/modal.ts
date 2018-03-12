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

  private _onDidDismissEvent: EventEmitter<{'data': any, 'role': string}> = new EventEmitter(true);
  private _onWillDismissEvent: EventEmitter<null> = new EventEmitter(true);

  public isOverlay: boolean = true;

  private _internalOnDidDismiss: (data: any, role: string) => void = null;
  private _internalOnWillDismiss: () => void = null;

  constructor(app: App, component: any, private data: any, private opts: ModalOptions = {}, config: Config, deepLinker: DeepLinker) {
    super(app, component, config, deepLinker);

    super.onDidDismiss((data: any, role: string) => {
      this._onDidDismissEvent.emit({'data': data, 'role': role});
      if (this._internalOnDidDismiss !== null) {
        this._internalOnDidDismiss(data, role);
      }
    });

    super.onWillDismiss(() => {
      this._onWillDismissEvent.emit(null);
      if (this._internalOnWillDismiss !== null) {
        this._internalOnWillDismiss();
      }
    });
  }

  getImplementation(): Overlay {
    return new ModalImpl(this._app, this._component, this.data, this.opts, this._config);
  }

  onDidDismiss(callback: (data: any, role: string) => void = null) : EventEmitter<{'data': any, 'role': string}> {
    this._internalOnDidDismiss = callback;
    return this._onDidDismissEvent;
  }

  onWillDismiss(callback: () => void = null) : EventEmitter<null> {
    if (callback !== null) {
      this._internalOnWillDismiss = callback;
    }
    return this._onWillDismissEvent;
  }
}
