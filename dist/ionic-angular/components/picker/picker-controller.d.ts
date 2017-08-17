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
export declare class PickerController {
    private _app;
    config: Config;
    constructor(_app: App, config: Config);
    /**
     * Open a picker.
     */
    create(opts?: PickerOptions): Picker;
}
