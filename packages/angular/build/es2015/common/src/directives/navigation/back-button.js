import { __decorate, __param } from "tslib";
import { HostListener, Optional, Directive } from '@angular/core';
import { ProxyCmp } from '../../utils/proxy';
const BACK_BUTTON_INPUTS = ['color', 'defaultHref', 'disabled', 'icon', 'mode', 'routerAnimation', 'text', 'type'];
let IonBackButton = class IonBackButton {
    constructor(routerOutlet, navCtrl, config, r, z, c) {
        this.routerOutlet = routerOutlet;
        this.navCtrl = navCtrl;
        this.config = config;
        this.r = r;
        this.z = z;
        c.detach();
        this.el = this.r.nativeElement;
    }
    /**
     * @internal
     */
    onClick(ev) {
        var _a;
        const defaultHref = this.defaultHref || this.config.get('backButtonDefaultHref');
        if ((_a = this.routerOutlet) === null || _a === void 0 ? void 0 : _a.canGoBack()) {
            this.navCtrl.setDirection('back', undefined, undefined, this.routerAnimation);
            this.routerOutlet.pop();
            ev.preventDefault();
        }
        else if (defaultHref != null) {
            this.navCtrl.navigateBack(defaultHref, { animation: this.routerAnimation });
            ev.preventDefault();
        }
    }
};
__decorate([
    HostListener('click', ['$event'])
], IonBackButton.prototype, "onClick", null);
IonBackButton = __decorate([
    ProxyCmp({
        inputs: BACK_BUTTON_INPUTS,
    }),
    Directive({
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: BACK_BUTTON_INPUTS,
    }),
    __param(0, Optional())
], IonBackButton);
export { IonBackButton };
