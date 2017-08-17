(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../app/app", "../../config/config", "./modal", "../../navigation/deep-linker"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("../app/app");
    var config_1 = require("../../config/config");
    var modal_1 = require("./modal");
    var deep_linker_1 = require("../../navigation/deep-linker");
    /**
     * \@name ModalController
     * \@description
     * A Modal is a content pane that goes over the user's current page.
     * Usually it is used for making a choice or editing an item. A modal uses the
     * `NavController` to
     * {\@link /docs/api/components/nav/NavController/#present present}
     * itself in the root nav stack. It is added to the stack similar to how
     * {\@link /docs/api/components/nav/NavController/#push NavController.push}
     * works.
     *
     * When a modal (or any other overlay such as an alert or actionsheet) is
     * "presented" to a nav controller, the overlay is added to the app's root nav.
     * After the modal has been presented, from within the component instance The
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
     * \@usage
     * ```ts
     * import { ModalController, NavParams } from 'ionic-angular';
     *
     * \@Component(...)
     * class HomePage {
     *
     *  constructor(public modalCtrl: ModalController) {
     *
     *  }
     *
     *  presentProfileModal() {
     *    let profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
     *    profileModal.present();
     *  }
     *
     * }
     *
     * \@Component(...)
     * class Profile {
     *
     *  constructor(params: NavParams) {
     *    console.log('UserId', params.get('userId'));
     *  }
     *
     * }
     * ```
     *
     * \@advanced
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
     * import { Component } from '\@angular/core';
     * import { ModalController, ViewController } from 'ionic-angular';
     *
     * \@Component(...)
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
     * \@Component(...)
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
     * \@demo /docs/demos/src/modal/
     * @see {\@link /docs/components#modals Modal Component Docs}
     */
    var ModalController = (function () {
        /**
         * @param {?} _app
         * @param {?} config
         * @param {?} deepLinker
         */
        function ModalController(_app, config, deepLinker) {
            this._app = _app;
            this.config = config;
            this.deepLinker = deepLinker;
        }
        /**
         * Create a modal to display. See below for options.
         *
         * @param {?} component
         * @param {?=} data
         * @param {?=} opts
         * @return {?}
         */
        ModalController.prototype.create = function (component, data, opts) {
            if (data === void 0) { data = {}; }
            if (opts === void 0) { opts = {}; }
            return new modal_1.Modal(this._app, component, data, opts, this.config, this.deepLinker);
        };
        return ModalController;
    }());
    ModalController.decorators = [
        { type: core_1.Injectable },
    ];
    /**
     * @nocollapse
     */
    ModalController.ctorParameters = function () { return [
        { type: app_1.App, },
        { type: config_1.Config, },
        { type: deep_linker_1.DeepLinker, },
    ]; };
    exports.ModalController = ModalController;
    function ModalController_tsickle_Closure_declarations() {
        /** @type {?} */
        ModalController.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ModalController.ctorParameters;
        /** @type {?} */
        ModalController.prototype._app;
        /** @type {?} */
        ModalController.prototype.config;
        /** @type {?} */
        ModalController.prototype.deepLinker;
    }
});
//# sourceMappingURL=modal-controller.js.map