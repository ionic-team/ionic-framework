import { EventEmitter } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { NavOptions } from '../../navigation/nav-util';
import { PickerColumn, PickerOptions } from './picker-options';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export declare class Picker extends ViewController {
    private _app;
    ionChange: EventEmitter<any>;
    constructor(app: App, opts: PickerOptions, config: Config);
    /**
    * @hidden
    */
    getTransitionName(direction: string): any;
    /**
     * @param {any} button Picker toolbar button
     */
    addButton(button: any): void;
    /**
     * @param {PickerColumn} column Picker toolbar button
     */
    addColumn(column: PickerColumn): void;
    getColumns(): PickerColumn[];
    getColumn(name: string): PickerColumn;
    refresh(): void;
    /**
     * @param {string} cssClass CSS class name to add to the picker's outer wrapper.
     */
    setCssClass(cssClass: string): void;
    /**
     * Present the picker instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions?: NavOptions): Promise<any>;
}
