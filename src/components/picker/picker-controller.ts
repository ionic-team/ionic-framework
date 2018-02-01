import { Injectable } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Picker } from './picker';
import { PickerOptions } from './picker-options';

/**
 * @hidden
 * @name PickerController
 * @description
 *
 */
@Injectable()
export class PickerController {

  constructor(private _app: App, public config: Config) { }

  /**
   * Open a picker.
   */
  create(opts: PickerOptions = {}): Picker {
    return new Picker(this._app, opts, this.config);
  }

}
