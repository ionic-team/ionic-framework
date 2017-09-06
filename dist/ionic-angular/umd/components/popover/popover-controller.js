(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../app/app", "../../config/config", "./popover", "../../navigation/deep-linker"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("../app/app");
    var config_1 = require("../../config/config");
    var popover_1 = require("./popover");
    var deep_linker_1 = require("../../navigation/deep-linker");
    /**
     * \@name PopoverController
     * \@description
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
     * To present a popover, call the `present` method on a PopoverController instance.
     * In order to position the popover relative to the element clicked, a click event
     * needs to be passed into the options of the the `present method. If the event
     * is not passed, the popover will be positioned in the center of the current
     * view. See the [usage](#usage) section for an example of passing this event.
     *
     * ### Dismissing
     * To dismiss the popover after creation, call the `dismiss()` method on the
     * `Popover` instance. The popover can also be dismissed from within the popover's
     * view by calling the `dismiss()` method on the [ViewController](../../navigation/ViewController).
     * The `dismiss()` call accepts an optional parameter that will be passed to the callback described
     * as follows. The `onDidDismiss(<func>)` function can be called to set up a callback action that will
     * be performed after the popover is dismissed, receiving the parameter passed to `dismiss()`.
     * The popover will dismiss when the backdrop is clicked by implicitly performing `dismiss(null)`,
     * but this can be disabled by setting `enableBackdropDismiss` to `false` in the popover options.
     *
     * > Note that after the component is dismissed, it will not be usable anymore and
     * another one must be created. This can be avoided by wrapping the creation and
     * presentation of the component in a reusable function as shown in the [usage](#usage)
     * section below.
     *
     * \@usage
     *
     * To open a popover on the click of a button, pass `$event` to the method
     * which creates and presents the popover:
     *
     * ```html
     * <button ion-button icon-only (click)="presentPopover($event)">
     *   <ion-icon name="more"></ion-icon>
     * </button>
     * ```
     *
     * ```ts
     * import { PopoverController } from 'ionic-angular';
     *
     * \@Component({})
     * class MyPage {
     *   constructor(public popoverCtrl: PopoverController) {}
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
     * \@Component({
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
     *   constructor(public viewCtrl: ViewController) {}
     *
     *   close() {
     *     this.viewCtrl.dismiss();
     *   }
     * }
     * ```
     * \@advanced
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
     * \@demo /docs/demos/src/popover/
     */
    var PopoverController = (function () {
        /**
         * @param {?} _app
         * @param {?} config
         * @param {?} _deepLinker
         */
        function PopoverController(_app, config, _deepLinker) {
            this._app = _app;
            this.config = config;
            this._deepLinker = _deepLinker;
        }
        /**
         * Present a popover. See below for options
         * @param {?} component
         * @param {?=} data
         * @param {?=} opts
         * @return {?}
         */
        PopoverController.prototype.create = function (component, data, opts) {
            if (data === void 0) { data = {}; }
            if (opts === void 0) { opts = {}; }
            return new popover_1.Popover(this._app, component, data, opts, this.config, this._deepLinker);
        };
        return PopoverController;
    }());
    PopoverController.decorators = [
        { type: core_1.Injectable },
    ];
    /**
     * @nocollapse
     */
    PopoverController.ctorParameters = function () { return [
        { type: app_1.App, },
        { type: config_1.Config, },
        { type: deep_linker_1.DeepLinker, },
    ]; };
    exports.PopoverController = PopoverController;
    function PopoverController_tsickle_Closure_declarations() {
        /** @type {?} */
        PopoverController.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        PopoverController.ctorParameters;
        /** @type {?} */
        PopoverController.prototype._app;
        /** @type {?} */
        PopoverController.prototype.config;
        /** @type {?} */
        PopoverController.prototype._deepLinker;
    }
});
//# sourceMappingURL=popover-controller.js.map