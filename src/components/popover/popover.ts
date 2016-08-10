import { Injectable } from '@angular/core';

import { App } from '../app/app';
import { isPresent } from '../../util/util';
import { NavOptions } from '../nav/nav-interfaces';
import { PopoverCmp } from './popover-component';
import { PopoverOptions } from './popover-options';
import { ViewController } from '../nav/view-controller';


/**
 * @private
 */
export class Popover extends ViewController {
  private _app: App;

  constructor(app: App, componentType: any, data: any = {}, opts: PopoverOptions = {}) {
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    data.componentType = componentType;
    data.opts = opts;
    super(PopoverCmp, data);
    this._app = app;
    this.isOverlay = true;

    // by default, popovers should not fire lifecycle events of other views
    // for example, when a popover enters, the current active view should
    // not fire its lifecycle events because it's not conceptually leaving
    this.fireOtherLifecycles = false;
  }

  /**
   * @private
   */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'popoverLeave' : 'popoverEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * Present the popover instance.
   *
   * @param {NavOptions} [opts={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}) {
    return this._app.present(this, navOptions);
  }

  /**
   * @private
   * DEPRECATED: Please inject PopoverController instead
   */
  static create(componentType: any, data = {}, opts: PopoverOptions = {}) {
    // deprecated warning: added beta.11 2016-06-27
    console.warn('Popover.create(..) has been deprecated. Please inject PopoverController instead');
  }

}


/**
 * @name PopoverController
 * @description
 * A Popover is a dialog that appears on top of the current page.
 * It can be used for anything, but generally it is used for overflow
 * actions that don't fit in the navigation bar.
 *
 * ### Creating
 * A popover can be created by calling the `create` method. The view
 * to display in the popover should be passed as the first argument.
 * Any data to pass to the popover view can optionally be passed in
 * the second argument. Options for the popover can optionally be
 * passed in the third argument. See the [create](#create) method
 * below for all available options.
 *
 * ### Presenting
 * To present a popover, call the `present` method on the [NavController](../../nav/NavController).
 * The first argument passed to the `present` should be the popover. In order
 * to position the popover relative to the element clicked, the event needs to be
 * passed as the second argument. If the event is not passed, the popover will be
 * positioned in the center of the current view. See the [usage](#usage) section for
 * an example of passing this event.
 *
 * ### Dismissing
 * To dismiss the popover after creation, call the `dismiss()` method on the
 * `Popover` instance. The popover can also be dismissed from within the popover's
 * view by calling the `dismiss()` method on the [ViewController](../../nav/ViewController).
 * The `onDidDismiss` function can be called to perform an action after the popover
 * is dismissed. The popover will dismiss when the backdrop is clicked, but this
 * can be disabled by setting `enableBackdropDismiss` to `false` in the popover
 * options.
 *
 * > Note that after the component is dismissed, it will not be usable anymore and
 * another one must be created. This can be avoided by wrapping the creation and
 * presentation of the component in a reusable function as shown in the [usage](#usage)
 * section below.
 *
 * @usage
 *
 * To open a popover on the click of a button, pass `$event` to the method
 * which creates and presents the popover:
 *
 * ```html
 * <button (click)="presentPopover($event)">
 *   <ion-icon name="more"></ion-icon>
 * </button>
 * ```
 *
 * ```ts
 * @Component({})
 * class MyPage {
 *   constructor(private popoverCtrl: PopoverController) {}
 *
 *   presentPopover(myEvent) {
 *     let popover = this.popoverCtrl.create(PopoverPage);
 *     popover.present({
 *       ev: myEvent
 *     });
 *   }
 * }
 * ```
 *
 * The `PopoverPage` will display inside of the popover, and
 * can be anything. Below is an example of a page with items
 * that close the popover on click.
 *
 * ```ts
 * @Component({
 *   template: `
 *     <ion-list>
 *       <ion-list-header>Ionic</ion-list-header>
 *       <button ion-item (click)="close()">Learn Ionic</button>
 *       <button ion-item (click)="close()">Documentation</button>
 *       <button ion-item (click)="close()">Showcase</button>
 *       <button ion-item (click)="close()">GitHub Repo</button>
 *     </ion-list>
 *   `
 * })
 * class PopoverPage {
 *   constructor(private viewCtrl: ViewController) {}
 *
 *   close() {
 *     this.viewCtrl.dismiss();
 *   }
 * }
 * ```
 * @advanced
 * Popover Options
 *
 * | Option                | Type       | Description                                                                                                      |
 * |-----------------------|------------|------------------------------------------------------------------------------------------------------------------|
 * | cssClass              |`string`    | Additional classes for custom styles, separated by spaces.                                                       |
 * | showBackdrop          |`boolean`   | Whether to show the backdrop. Default true.                                                                      |
 * | enableBackdropDismiss |`boolean`   | Whether the popover should be dismissed by tapping the backdrop. Default true.                                   |
 *
 *
 *
 * @demo /docs/v2/demos/popover/
 */
@Injectable()
export class PopoverController {

  constructor(private _app: App) {}

  /**
   * Present a popover. See below for options
   * @param {object} componentType The Popover
   * @param {object} data Any data to pass to the Popover view
   * @param {PopoverOptions} opts Popover options
   */
  create(componentType: any, data = {}, opts: PopoverOptions = {}): Popover {
    return new Popover(this._app, componentType, data, opts);
  }

}
