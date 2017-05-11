import { App } from '../app/app';
import { Config } from '../../config/config';

import { PopoverOptions } from './popover-options';
import { DeepLinker } from '../../navigation/deep-linker';

import { Overlay } from '../../navigation/overlay';
import { OverlayProxy } from '../../navigation/overlay-proxy';
import { PopoverImpl } from './popover-impl';

/**
 * @hidden
 */
export class Popover extends OverlayProxy {

  public isOverlay: boolean = true;

  constructor(app: App, component: any, private data: any, private opts: PopoverOptions = {}, config: Config, deepLinker: DeepLinker) {
    super(app, component, config, deepLinker);
  }

  getImplementation(): Overlay {
    return new PopoverImpl(this._app, this._component, this.data, this.opts, this._config);
  }
}
