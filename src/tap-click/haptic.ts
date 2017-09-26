import { Injectable } from '@angular/core';

import { Platform } from '../platform/platform';


/**
 * @name Haptic
 * @description
 * The `Haptic` class interacts with a haptic engine on the device, if
 * available. Generally, Ionic components use this under the hood, but you're
 * welcome to get a bit crazy with it if you fancy.
 *
 * Currently, this uses the Taptic engine on iOS.
 *
 * @usage
 * ```ts
 * export class MyClass {
 *
 *  constructor(haptic: Haptic) {
 *    haptic.selection();
 *  }
 * }
 *
 * ```
 */

@Injectable()
export class Haptic {
  private _p: any;

  constructor(plt: Platform) {
    if (plt) {
      plt.ready().then(() => {
        this._p = (<any>plt.win()).TapticEngine;
      });
    }
  }

  /**
   * Check to see if the Haptic Plugin is available
   * @return {boolean} Returns true or false if the plugin is available
   *
   */
  available() {
    return !!this._p;
  }

  /**
   * Trigger a selection changed haptic event. Good for one-time events
   * (not for gestures)
   */
  selection() {
    this._p && this._p.selection();
  }

  /**
   * Tell the haptic engine that a gesture for a selection change is starting.
   */
  gestureSelectionStart() {
    this._p && this._p.gestureSelectionStart();
  }

  /**
   * Tell the haptic engine that a selection changed during a gesture.
   */
  gestureSelectionChanged() {
    this._p && this._p.gestureSelectionChanged();
  }

  /**
   * Tell the haptic engine we are done with a gesture. This needs to be
   * called lest resources are not properly recycled.
   */
  gestureSelectionEnd() {
    this._p && this._p.gestureSelectionEnd();
  }

  /**
   * Use this to indicate success/failure/warning to the user.
   * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
   */
  notification(options: { type: string }) {
    this._p && this._p.notification(options);
  }

  /**
   * Use this to indicate success/failure/warning to the user.
   * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
   */
  impact(options: { style: string }) {
    this._p && this._p.impact(options);
  }
}
