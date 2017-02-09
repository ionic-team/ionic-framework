import { Injectable } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Picker } from './picker';
import { PickerOptions } from './picker-options';
import { PickerSlideIn, PickerSlideOut } from './picker-transitions';

/**
 * @private
 * @name PickerController
 * @description
 *
 */
@Injectable()
export class PickerController {

  constructor(private _app: App, config: Config) {
    config.setTransition('picker-slide-in', PickerSlideIn);
    config.setTransition('picker-slide-out', PickerSlideOut);
  }

  /**
   * Open a picker.
   */
  create(opts: PickerOptions = {}): Picker {
    return new Picker(this._app, opts);
  }

}
