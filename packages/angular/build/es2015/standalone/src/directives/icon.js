import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { defineCustomElement as defineIonIcon } from 'ionicons/components/ion-icon.js';
import { ProxyCmp } from './angular-component-lib/utils';
let IonIcon = class IonIcon {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonIcon = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineIonIcon,
        inputs: ['color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src'],
    }),
    Component({
        selector: 'ion-icon',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src'],
        standalone: true,
    })
], IonIcon);
export { IonIcon };
