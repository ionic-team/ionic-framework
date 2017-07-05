import { EventEmitter, Output } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { assert, isPresent } from '../../util/util';
import { NavOptions } from '../../navigation/nav-util';
import { PickerCmp } from './picker-component';
import { PickerColumn, PickerOptions } from './picker-options';
import { PickerSlideIn, PickerSlideOut } from './picker-transitions';
import { ViewController } from '../../navigation/view-controller';


/**
 * @hidden
 */
export class Picker extends ViewController {
  private _app: App;

  @Output() ionChange: EventEmitter<any>;

  constructor(app: App, opts: PickerOptions = {}, config: Config) {
    if (!opts) {
      opts = {};
    }
    opts.columns = opts.columns || [];
    opts.buttons = opts.buttons || [];
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? Boolean(opts.enableBackdropDismiss) : true;

    super(PickerCmp, opts, null);
    this._app = app;
    this.isOverlay = true;

    this.ionChange = new EventEmitter<any>();

    config.setTransition('picker-slide-in', PickerSlideIn);
    config.setTransition('picker-slide-out', PickerSlideOut);
  }

  /**
  * @hidden
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
   * @param {PickerColumn} column Picker toolbar button
   */
  addColumn(column: PickerColumn) {
    this.data.columns.push(column);
  }

  getColumns(): PickerColumn[] {
    return this.data.columns;
  }

  getColumn(name: string): PickerColumn {
    return this.getColumns().find(column => column.name === name);
  }

  refresh() {
    assert(this._cmp, 'componentRef must be valid');
    assert(this._cmp.instance.refresh, 'instance must implement refresh()');

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
   * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    return this._app.present(this, navOptions);
  }

}
