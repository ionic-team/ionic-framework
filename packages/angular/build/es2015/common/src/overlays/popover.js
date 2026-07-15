import { __decorate } from "tslib";
import { ContentChild, Directive, TemplateRef, } from '@angular/core';
import { ProxyCmp, proxyOutputs } from '../utils/proxy';
const POPOVER_INPUTS = [
    'alignment',
    'animated',
    'arrow',
    'keepContentsMounted',
    'backdropDismiss',
    'cssClass',
    'dismissOnSelect',
    'enterAnimation',
    'event',
    'focusTrap',
    'isOpen',
    'keyboardClose',
    'leaveAnimation',
    'mode',
    'showBackdrop',
    'translucent',
    'trigger',
    'triggerAction',
    'reference',
    'size',
    'side',
];
const POPOVER_METHODS = ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss'];
let IonPopover = class IonPopover {
    constructor(c, r, z) {
        this.z = z;
        this.isCmpOpen = false;
        this.el = r.nativeElement;
        this.el.addEventListener('ionMount', () => {
            this.isCmpOpen = true;
            c.detectChanges();
        });
        this.el.addEventListener('didDismiss', () => {
            this.isCmpOpen = false;
            c.detectChanges();
        });
        proxyOutputs(this, this.el, [
            'ionPopoverDidPresent',
            'ionPopoverWillPresent',
            'ionPopoverWillDismiss',
            'ionPopoverDidDismiss',
            'didPresent',
            'willPresent',
            'willDismiss',
            'didDismiss',
        ]);
    }
};
__decorate([
    ContentChild(TemplateRef, { static: false })
], IonPopover.prototype, "template", void 0);
IonPopover = __decorate([
    ProxyCmp({
        inputs: POPOVER_INPUTS,
        methods: POPOVER_METHODS,
    })
    /**
     * @Component extends from @Directive
     * so by defining the inputs here we
     * do not need to re-define them for the
     * lazy loaded popover.
     */
    ,
    Directive({
        selector: 'ion-popover',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: POPOVER_INPUTS,
    })
], IonPopover);
export { IonPopover };
