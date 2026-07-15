import { __decorate } from "tslib";
import { ContentChild, Directive, TemplateRef, } from '@angular/core';
import { ProxyCmp, proxyOutputs } from '../utils/proxy';
const MODAL_INPUTS = [
    'animated',
    'keepContentsMounted',
    'backdropBreakpoint',
    'backdropDismiss',
    'breakpoints',
    'canDismiss',
    'cssClass',
    'enterAnimation',
    'expandToScroll',
    'event',
    'focusTrap',
    'handle',
    'handleBehavior',
    'initialBreakpoint',
    'isOpen',
    'keyboardClose',
    'leaveAnimation',
    'mode',
    'presentingElement',
    'showBackdrop',
    'translucent',
    'trigger',
];
const MODAL_METHODS = [
    'present',
    'dismiss',
    'onDidDismiss',
    'onWillDismiss',
    'setCurrentBreakpoint',
    'getCurrentBreakpoint',
];
let IonModal = class IonModal {
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
            'ionModalDidPresent',
            'ionModalWillPresent',
            'ionModalWillDismiss',
            'ionModalDidDismiss',
            'ionBreakpointDidChange',
            'didPresent',
            'willPresent',
            'willDismiss',
            'didDismiss',
            'ionDragStart',
            'ionDragMove',
            'ionDragEnd',
        ]);
    }
};
__decorate([
    ContentChild(TemplateRef, { static: false })
], IonModal.prototype, "template", void 0);
IonModal = __decorate([
    ProxyCmp({
        inputs: MODAL_INPUTS,
        methods: MODAL_METHODS,
    })
    /**
     * @Component extends from @Directive
     * so by defining the inputs here we
     * do not need to re-define them for the
     * lazy loaded popover.
     */
    ,
    Directive({
        selector: 'ion-modal',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: MODAL_INPUTS,
    })
], IonModal);
export { IonModal };
