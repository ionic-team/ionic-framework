import { Injectable } from '@angular/core';

import { Platform } from '../platform/platform';

declare var window;

/**
 * @name Haptic
 * @description
 * The `Haptic` class interacts with a haptic engine on the device, if available. Generally,
 * Ionic components use this under the hood, but you're welcome to get a bit crazy with it
 * if you fancy.
 *
 * Currently, this uses the Taptic engine on iOS.
 *
 * @usage
 * ```ts
 * export class MyClass{
 *  constructor(haptic: Haptic){
 *    haptic.selection();
 *  }
 * }
 *
 * ```
 */

@Injectable()
export class Haptic {

  /**
   * @internal
   */
  plugin: any;

  constructor(platform: Platform) {
    if (platform) {
      platform.ready().then(() => {
        this.plugin = window.TapticEngine;
      });
    }
  }

  /**
   * Check to see if the Haptic Plugin is available
   * @return {boolean} Retuns true or false if the plugin is available
   *
   */
  available() {
    return !!this.plugin;
  }

  /**
   * Trigger a selection changed haptic event. Good for one-time events (not for gestures)
   */
  selection() {
    if (!this.plugin) {
      return;
    }

    this.plugin.selection();
  }

  /**
   * Tell the haptic engine that a gesture for a selection change is starting.
   */
  gestureSelectionStart() {
    if (!this.plugin) {
      return;
    }

    this.plugin.gestureSelectionStart();
  }

  /**
   * Tell the haptic engine that a selection changed during a gesture.
   */
  gestureSelectionChanged() {
    if (!this.plugin) {
      return;
    }

    this.plugin.gestureSelectionChanged();
  }

  /**
   * Tell the haptic engine we are done with a gesture. This needs to be
   * called lest resources are not properly recycled.
   */
  gestureSelectionEnd() {
    if (!this.plugin) {
      return;
    }

    this.plugin.gestureSelectionEnd();
  }

  /**
   * Use this to indicate success/failure/warning to the user.
   * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
   */
  notification(options: { type: string }) {
    if (!this.plugin) {
      return;
    }

    this.plugin.notification(options);
  }

  /**
   * Use this to indicate success/failure/warning to the user.
   * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
   */
  impact(options: { style: string }) {
    if (!this.plugin) {
      return;
    }

    this.plugin.impact(options);
  }
}
