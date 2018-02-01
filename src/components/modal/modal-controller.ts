import { Injectable } from '@angular/core';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Modal } from './modal';
import { ModalOptions } from './modal-options';
import { DeepLinker } from '../../navigation/deep-linker';

/**
 * @name ModalController
 * @description
 * A Modal is a content pane that goes over the user's current page.
 * Usually it is used for making a choice or editing an item. A modal uses the
 * `NavController` to
 * {@link /docs/api/components/nav/NavController/#present present}
 * itself in the root nav stack. It is added to the stack similar to how
 * {@link /docs/api/components/nav/NavController/#push NavController.push}
 * works.
 *
 * When a modal (or any other overlay such as an alert or actionsheet) is
 * "presented" to a nav controller, the overlay is added to the app's root nav.
 * After the modal has been presented, from within the component instance, the
 * modal can later be closed or "dismissed" by using the ViewController's
 * `dismiss` method. Additionally, you can dismiss any overlay by using `pop`
 * on the root nav controller. Modals are not reusable. When a modal is dismissed
 * it is destroyed.
 *
 * Data can be passed to a new modal through `Modal.create()` as the second
 * argument. The data can then be accessed from the opened page by injecting
 * `NavParams`. Note that the page, which opened as a modal, has no special
 * "modal" logic within it, but uses `NavParams` no differently than a
 * standard page.
 *
 * @usage
 * ```ts
 * import { ModalController, NavParams } from 'ionic-angular';
 *
 * @Component(...)
 * class HomePage {
 *
 *  constructor(public modalCtrl: ModalController) { }
 *
 *  presentProfileModal() {
 *    const profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
 *    profileModal.present();
 *  }
 *
 * }
 *
 * @Component(...)
 * class Profile {
 *
 *  constructor(params: NavParams) {
 *    console.log('UserId', params.get('userId'));
 *  }
 *
 * }
 * ```
 *
 * @advanced
 *
 * | Option                | Type       | Description                                                                                                      |
 * |-----------------------|------------|------------------------------------------------------------------------------------------------------------------|
 * | showBackdrop          |`boolean`   | Whether to show the backdrop. Default true.                                                                      |
 * | enableBackdropDismiss |`boolean`   | Whether the popover should be dismissed by tapping the backdrop. Default true.                                   |
 * | cssClass              |`string`    | Additional classes for custom styles, separated by spaces.                                                       |
 *
 * A modal can also emit data, which is useful when it is used to add or edit
 * data. For example, a profile page could slide up in a modal, and on submit,
 * the submit button could pass the updated profile data, then dismiss the
 * modal.
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { ModalController, ViewController } from 'ionic-angular';
 *
 * @Component(...)
 * class HomePage {
 *
 *  constructor(public modalCtrl: ModalController) {
 *
 *  }
 *
 *  presentContactModal() {
 *    let contactModal = this.modalCtrl.create(ContactUs);
 *    contactModal.present();
 *  }
 *
 *  presentProfileModal() {
 *    let profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
 *    profileModal.onDidDismiss(data => {
 *      console.log(data);
 *    });
 *    profileModal.present();
 *  }
 *
 * }
 *
 * @Component(...)
 * class Profile {
 *
 *  constructor(public viewCtrl: ViewController) {
 *
 *  }
 *
 *  dismiss() {
 *    let data = { 'foo': 'bar' };
 *    this.viewCtrl.dismiss(data);
 *  }
 *
 * }
 * ```
 *
 * A common issue is that a developer may try to implement navigation in a modal, but when you try NavController.push(),
 * you will notice that the status bar on iOS gets cut off. The proper way to implement navigation in a modal is to
 * make the modal component a navigation container, and set the root page to the page you want to show in your modal.
 *
 * ```ts
 * @Component({
 *   template: '<ion-nav [root]="rootPage" [rootParams]="rootParams"></ion-nav>'
 * })
 * export class MyModalWrapper {
 *   rootPage = 'MyModalContentPage'; // This is the page you want your modal to display
 *   rootParams;
 *
 *   constructor(navParams: NavParams, private viewCtrl: ViewController) {
 *       this.rootParams = Object.assign({}, navParams.data, {viewCtrl: viewCtrl});
 *       // This line will send the view controller into your child views, so you can dismiss the modals from there.
 *   }
 * }
 * ```
 * @demo /docs/demos/src/modal/
 * @see {@link /docs/components#modals Modal Component Docs}
 */
@Injectable()
export class ModalController {

  constructor(private _app: App, public config: Config, private deepLinker: DeepLinker) { }

  /**
   * Create a modal to display. See below for options.
   *
   * @param {object} component The Modal view
   * @param {object} data Any data to pass to the Modal view
   * @param {object} opts Modal options
   */
  create(component: any, data: any = {}, opts: ModalOptions = {}) {
    return new Modal(this._app, component, data, opts, this.config, this.deepLinker);
  }
}
