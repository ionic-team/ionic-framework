import { EventEmitter, Injectable, Output } from '@angular/core';

import { App } from '../app/app';
import { isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { PickerCmp } from './picker-component';
import { PickerOptions, PickerColumn } from './picker-options';
import { ViewController } from '../../navigation/view-controller';

/**
 * @private
 */
export class Picker extends ViewController {
  private _app: App;

  @Output() ionChange: EventEmitter<any>;

  constructor(app: App, opts: PickerOptions = {}) {
    opts.columns = opts.columns || [];
    opts.buttons = opts.buttons || [];
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(PickerCmp, opts, null);
    this._app = app;
    this.isOverlay = true;

    this.ionChange = new EventEmitter<any>();
  }

  /**
  * @private
  */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'pickerLeave' : 'pickerEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {any} button Picker toolbar button
   */
  addButton(button: any) {
    this.data.buttons.push(button);
  }

  /**
   * @param {any} button Picker toolbar button
   */
  addColumn(column: PickerColumn) {
    this.data.columns.push(column);
  }

  getColumns(): PickerColumn[] {
    return this.data.columns;
  }

  refresh() {
    this._cmp && this._cmp.instance.refresh && this._cmp.instance.refresh();
  }

  /**
   * @param {string} cssClass CSS class name to add to the picker's outer wrapper.
   */
  setCssClass(cssClass: string) {
    this.data.cssClass = cssClass;
  }

  /**
   * Present the picker instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    return this._app.present(this, navOptions);
  }

  /**
   * @private
   * DEPRECATED: Please inject PickerController instead
   */
  static create(opt: any) {
    // deprecated warning: added beta.11 2016-06-27
    console.warn('Picker.create(..) has been deprecated. Please inject PickerController instead');
  }

}



/**
 * @private
 * @name PickerController
 * @description
 *
 */
@Injectable()
export class PickerController {

  constructor(private _app: App) {}

  /**
   * Open a picker.
   */
  create(opts: PickerOptions = {}): Picker {
    return new Picker(this._app, opts);
  }

}
