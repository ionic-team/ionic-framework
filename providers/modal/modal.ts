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

  constructor(app: App, component: any, private data: any, private opts: ModalOptions = {}, config: Config, deepLinker: DeepLinker) {
    super(app, component, config, deepLinker);
  }

  getImplementation(): Overlay {
    return new ModalImpl(this._app, this._component, this.data, this.opts, this._config);
  }
}
