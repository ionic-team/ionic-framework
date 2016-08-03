import { NgModule, Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Content } from '../dist';
import { App, IonicModule } from '../dist';
import { NavParams, ViewController } from '../dist';
export var MyCmpTest = (function () {
    function MyCmpTest() {
    }
    MyCmpTest.decorators = [
        { type: Component, args: [{
                    selector: 'my-cmp',
                    template: "<p>My Custom Component Test <ion-icon name=\"star\"></ion-icon></p>"
                },] },
    ];
    return MyCmpTest;
}());
export var FirstPage = (function () {
    function FirstPage(nav, view) {
        this.nav = nav;
        this.view = view;
        this.pushPage = FullPage;
        this.title = 'First Page';
        this.pages = [];
        for (var i = 1; i <= 50; i++) {
            this.pages.push(i);
        }
    }
    FirstPage.prototype.setPages = function () {
        var items = [
            { page: PrimaryHeaderPage }
        ];
        this.nav.setPages(items);
    };
    FirstPage.prototype.setRoot = function () {
        this.nav.setRoot(PrimaryHeaderPage);
    };
    FirstPage.prototype.pushPrimaryHeaderPage = function () {
        this.nav.push(PrimaryHeaderPage);
    };
    FirstPage.prototype.pushFullPage = function () {
        this.nav.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] });
    };
    FirstPage.prototype.pushAnother = function () {
        this.nav.push(AnotherPage);
    };
    FirstPage.prototype.quickPush = function () {
        var _this = this;
        this.nav.push(AnotherPage);
        setTimeout(function () {
            _this.nav.push(PrimaryHeaderPage);
        }, 150);
    };
    FirstPage.prototype.quickPop = function () {
        var _this = this;
        this.nav.push(AnotherPage);
        setTimeout(function () {
            _this.nav.remove(1, 1);
        }, 250);
    };
    FirstPage.prototype.viewDismiss = function () {
        this.view.dismiss();
    };
    FirstPage.prototype.reload = function () {
        window.location.reload();
    };
    FirstPage.prototype.scrollToTop = function () {
        this.content.scrollToTop();
    };
    FirstPage.prototype.scrollToBottom = function () {
        this.content.scrollToBottom(1000);
    };
    /** @nocollapse */
    FirstPage.decorators = [
        { type: Component, args: [{
                    template: "\n    <ion-header>\n      <ion-navbar>\n        <ion-title>{{title}}</ion-title>\n        <ion-buttons start>\n          <button><ion-icon name=\"star\"></ion-icon></button>\n        </ion-buttons>\n        <ion-buttons end>\n          <button>S1g</button>\n        </ion-buttons>\n      </ion-navbar>\n    </ion-header>\n    <ion-content>\n      <ion-list>\n        <ion-list-header>\n          {{title}}\n        </ion-list-header>\n        <button ion-item class=\"e2eFrom1To2\" (click)=\"pushFullPage()\">Push to FullPage</button>\n        <button ion-item (click)=\"pushPrimaryHeaderPage()\">Push to PrimaryHeaderPage</button>\n        <button ion-item (click)=\"pushAnother()\">Push to AnotherPage</button>\n        <ion-item>\n          <ion-label>Text Input</ion-label>\n          <ion-textarea></ion-textarea>\n        </ion-item>\n        <button ion-item [navPush]=\"[pushPage, {id: 42}]\">Push FullPage w/ [navPush] array</button>\n        <button ion-item [navPush]=\"pushPage\" [navParams]=\"{id:40}\">Push w/ [navPush] and [navParams]</button>\n        <button ion-item [navPush]=\"['FirstPage', {id: 22}]\">Push w/ [navPush] array and string view name</button>\n        <button ion-item (click)=\"setPages()\">setPages() (Go to PrimaryHeaderPage)</button>\n        <button ion-item (click)=\"setRoot()\">setRoot(PrimaryHeaderPage) (Go to PrimaryHeaderPage)</button>\n        <button ion-item (click)=\"nav.pop()\">Pop</button>\n        <button ion-item (click)=\"viewDismiss()\">View Dismiss</button>\n        <button ion-item (click)=\"quickPush()\">New push during transition</button>\n        <button ion-item (click)=\"quickPop()\">New pop during transition</button>\n        <button ion-item (click)=\"reload()\">Reload</button>\n        <button ion-item (click)=\"scrollToBottom()\">Scroll to bottom</button>\n        <button *ngFor=\"let i of pages\" ion-item (click)=\"pushPrimaryHeaderPage()\">Page {{i}}</button>\n        <button ion-item (click)=\"content.scrollToTop()\">Scroll to top</button>\n      </ion-list>\n      <my-cmp></my-cmp>\n    </ion-content>",
                    directives: [MyCmpTest]
                },] },
    ];
    /** @nocollapse */
    FirstPage.ctorParameters = [
        { type: NavController, },
        { type: ViewController, },
    ];
    /** @nocollapse */
    FirstPage.propDecorators = {
        'content': [{ type: ViewChild, args: [Content,] },],
    };
    return FirstPage;
}());
export var FullPage = (function () {
    function FullPage(nav, app, alertCtrl, params) {
        this.nav = nav;
        this.app = app;
        this.alertCtrl = alertCtrl;
        this.params = params;
    }
    FullPage.prototype.setPages = function () {
        var items = [
            { page: FirstPage },
            { page: PrimaryHeaderPage }
        ];
        this.nav.setPages(items);
    };
    FullPage.prototype.pushPrimaryHeaderPage = function () {
        this.nav.push(PrimaryHeaderPage);
    };
    FullPage.prototype.pushAnother = function () {
        this.nav.push(AnotherPage);
    };
    FullPage.prototype.pushFirstPage = function () {
        this.nav.push(FirstPage);
    };
    FullPage.prototype.presentAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create();
        alert.setTitle('Hello Alert');
        alert.setMessage('Dismiss this alert, then pop one page');
        alert.addButton({
            text: 'Dismiss',
            role: 'cancel',
            handler: function () {
                // overlays are added and removed from the root navigation
                // ensure you using the root navigation, and pop this alert
                // when the alert is done animating out, then pop off the active page
                _this.app.getRootNav().pop().then(function () {
                    _this.app.getRootNav().pop();
                });
                // by default an alert will dismiss itself
                // however, we don't want to use the default
                // but rather fire off our own pop navigation
                // return false so it doesn't pop automatically
                return false;
            }
        });
        alert.present();
    };
    /** @nocollapse */
    FullPage.decorators = [
        { type: Component, args: [{
                    template: "\n    <ion-content padding>\n      <h1>Full page</h1>\n      <p>This page does not have a nav bar!</p>\n      <p><button (click)=\"nav.pop()\">Pop</button></p>\n      <p><button class=\"e2eFrom2To3\" (click)=\"pushPrimaryHeaderPage()\">Push to PrimaryHeaderPage</button></p>\n      <p><button (click)=\"pushAnother()\">Push to AnotherPage</button></p>\n      <p><button (click)=\"pushFirstPage()\">Push to FirstPage</button></p>\n      <p><button class=\"e2eFrom2To1\" nav-pop>Pop with NavPop (Go back to 1st)</button></p>\n      <p><button (click)=\"setPages()\">setPages() (Go to PrimaryHeaderPage, FirstPage 1st in history)</button></p>\n      <p><button (click)=\"presentAlert()\">Present Alert</button></p>\n    </ion-content>\n  "
                },] },
    ];
    /** @nocollapse */
    FullPage.ctorParameters = [
        { type: NavController, },
        { type: App, },
        { type: AlertController, },
        { type: NavParams, },
    ];
    return FullPage;
}());
export var PrimaryHeaderPage = (function () {
    function PrimaryHeaderPage(nav, alertCtrl, viewCtrl) {
        this.nav = nav;
        this.alertCtrl = alertCtrl;
        this.viewCtrl = viewCtrl;
    }
    PrimaryHeaderPage.prototype.ionViewWillEnter = function () {
        this.viewCtrl.setBackButtonText('Previous');
    };
    PrimaryHeaderPage.prototype.pushAnother = function () {
        this.nav.push(AnotherPage);
    };
    PrimaryHeaderPage.prototype.pushFullPage = function () {
        this.nav.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] });
    };
    PrimaryHeaderPage.prototype.insert = function () {
        this.nav.insert(2, FirstPage);
    };
    PrimaryHeaderPage.prototype.removeSecond = function () {
        this.nav.remove(1);
    };
    PrimaryHeaderPage.prototype.setRoot = function () {
        this.nav.setRoot(AnotherPage);
    };
    PrimaryHeaderPage.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create();
        alert.setTitle('Hello Alert');
        alert.addButton({ text: 'Dismiss', role: 'cancel', });
        alert.present();
    };
    /** @nocollapse */
    PrimaryHeaderPage.decorators = [
        { type: Component, args: [{
                    template: "\n    <ion-header>\n      <ion-navbar primary>\n        <ion-title>Primary Color Page Header</ion-title>\n        <ion-buttons end>\n          <button>S1g</button>\n        </ion-buttons>\n      </ion-navbar>\n      <ion-toolbar no-border-top>\n        <ion-title>I'm a sub header!</ion-title>\n      </ion-toolbar>\n    </ion-header>\n    <ion-content padding fullscreen>\n      <p><button class=\"e2eFrom3To2\" (click)=\"nav.pop()\">Pop</button></p>\n      <p><button (click)=\"pushAnother()\">Push to AnotherPage</button></p>\n      <p><button (click)=\"pushFullPage()\">Push to FullPage</button></p>\n      <p><button (click)=\"setRoot()\">setRoot(AnotherPage)</button></p>\n      <p><button (click)=\"nav.popToRoot()\">Pop to root</button></p>\n      <p><button id=\"insert\" (click)=\"insert()\">Insert first page into history before this</button></p>\n      <p><button id=\"remove\" (click)=\"removeSecond()\">Remove second page in history</button></p>\n      <div class=\"yellow\"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>\n      <ion-fixed style=\"bottom:0\">\n        <button (click)=\"presentAlert()\">fixed button (alert)</button>\n      </ion-fixed>\n      <ion-fixed style=\"pointer-events: none; top:0; bottom:0; right:0; width:50%; background: rgba(0,0,0,0.5);\"></ion-fixed>\n    </ion-content>\n    <ion-footer>\n      <ion-toolbar no-border-bottom>\n        I'm a sub footer!\n      </ion-toolbar>\n      <ion-toolbar no-border-top>\n        <ion-title>Footer</ion-title>\n      </ion-toolbar>\n    </ion-footer>\n  "
                },] },
    ];
    /** @nocollapse */
    PrimaryHeaderPage.ctorParameters = [
        { type: NavController, },
        { type: AlertController, },
        { type: ViewController, },
    ];
    return PrimaryHeaderPage;
}());
export var AnotherPage = (function () {
    function AnotherPage(nav, viewCtrl) {
        this.nav = nav;
        this.viewCtrl = viewCtrl;
        this.bbHideToggleVal = false;
        this.bbCount = 0;
        console.log('Page, AnotherPage, constructor', this.viewCtrl.id);
    }
    AnotherPage.prototype.pushFullPage = function () {
        this.nav.push(FullPage);
    };
    AnotherPage.prototype.pushPrimaryHeaderPage = function () {
        this.nav.push(PrimaryHeaderPage);
    };
    AnotherPage.prototype.pushFirstPage = function () {
        this.nav.push(FirstPage);
    };
    AnotherPage.prototype.setRoot = function () {
        this.nav.setRoot(FirstPage);
    };
    AnotherPage.prototype.toggleBackButton = function () {
        this.bbHideToggleVal = !this.bbHideToggleVal;
        this.viewCtrl.showBackButton(this.bbHideToggleVal);
    };
    AnotherPage.prototype.setBackButtonText = function () {
        var backButtonText = 'Messages';
        if (this.bbCount > 0) {
            backButtonText += " (" + this.bbCount + ")";
        }
        this.viewCtrl.setBackButtonText(backButtonText);
        ++this.bbCount;
    };
    AnotherPage.prototype.ionViewWillEnter = function () {
        console.log('Page, AnotherPage, ionViewWillEnter', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewDidEnter = function () {
        console.log('Page, AnotherPage, ionViewDidEnter', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewWillLeave = function () {
        console.log('Page, AnotherPage, ionViewWillLeave', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewDidLeave = function () {
        console.log('Page, AnotherPage, ionViewDidLeave', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewWillUnload = function () {
        console.log('Page, AnotherPage, ionViewWillUnload', this.viewCtrl.id);
    };
    AnotherPage.prototype.ionViewDidUnload = function () {
        console.log('Page, AnotherPage, ionViewDidUnload', this.viewCtrl.id);
    };
    AnotherPage.prototype.ngOnDestroy = function () {
        console.log('Page, AnotherPage, ngOnDestroy', this.viewCtrl.id);
    };
    /** @nocollapse */
    AnotherPage.decorators = [
        { type: Component, args: [{
                    template: "\n    <ion-header>\n      <ion-navbar hideBackButton>\n        <ion-title>Another Page Header</ion-title>\n      </ion-navbar>\n    </ion-header>\n    <ion-content>\n      <ion-toolbar no-border-top>\n        I'm a sub header in the content!\n      </ion-toolbar>\n      <ion-list>\n        <ion-item>\n          <ion-label>Text Input</ion-label>\n          <ion-textarea></ion-textarea>\n        </ion-item>\n        <ion-item>Back button hidden w/ <code>ion-navbar hideBackButton</code></ion-item>\n        <button ion-item (click)=\"nav.pop()\">Pop</button>\n        <button ion-item (click)=\"pushFullPage()\">Push to FullPage</button>\n        <button ion-item (click)=\"pushPrimaryHeaderPage()\">Push to PrimaryHeaderPage</button>\n        <button ion-item (click)=\"pushFirstPage()\">Push to FirstPage</button>\n        <button ion-item (click)=\"setRoot()\">setRoot(FirstPage)</button>\n        <button ion-item (click)=\"toggleBackButton()\">Toggle hideBackButton</button>\n        <button ion-item (click)=\"setBackButtonText()\">Set Back Button Text</button>\n        <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>\n      </ion-list>\n      <ion-toolbar no-border-bottom>\n        I'm a sub footer in the content!\n      </ion-toolbar>\n      <ion-toolbar no-border-bottom no-border-top>\n        And I'm a sub footer in the content too!\n      </ion-toolbar>\n    </ion-content>\n    <ion-footer>\n      <ion-toolbar>\n        Another Page Footer\n      </ion-toolbar>\n    </ion-footer>\n  "
                },] },
    ];
    /** @nocollapse */
    AnotherPage.ctorParameters = [
        { type: NavController, },
        { type: ViewController, },
    ];
    return AnotherPage;
}());
export var E2EApp = (function () {
    function E2EApp() {
        this.root = FirstPage;
    }
    Object.defineProperty(E2EApp.prototype, "isChangeDetecting", {
        get: function () {
            console.log('isChangeDetecting');
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /** @nocollapse */
    E2EApp.decorators = [
        { type: Component, args: [{
                    template: "<ion-nav [root]=\"root\"></ion-nav>",
                    host: {
                        '[class.is-change-detecting]': 'isChangeDetecting'
                    }
                },] },
    ];
    return E2EApp;
}());
export var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        E2EApp,
                        FirstPage,
                        AnotherPage,
                        MyCmpTest,
                        FullPage,
                        PrimaryHeaderPage
                    ],
                    imports: [
                        IonicModule.forRoot(E2EApp)
                    ],
                    entryComponents: [
                        E2EApp,
                        FirstPage,
                        AnotherPage,
                        MyCmpTest,
                        FullPage,
                        PrimaryHeaderPage
                    ]
                },] },
    ];
    return AppModule;
}());
