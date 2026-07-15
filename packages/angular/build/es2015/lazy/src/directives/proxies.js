import { __decorate } from "tslib";
/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ProxyCmp } from './angular-component-lib/utils';
let IonAccordion = class IonAccordion {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonAccordion = __decorate([
    ProxyCmp({
        inputs: ['disabled', 'mode', 'readonly', 'toggleIcon', 'toggleIconSlot', 'value']
    }),
    Component({
        selector: 'ion-accordion',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['disabled', 'mode', 'readonly', 'toggleIcon', 'toggleIconSlot', 'value'],
        standalone: false
    })
], IonAccordion);
export { IonAccordion };
let IonAccordionGroup = class IonAccordionGroup {
    constructor(c, r, z) {
        this.z = z;
        this.ionChange = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonAccordionGroup.prototype, "ionChange", void 0);
IonAccordionGroup = __decorate([
    ProxyCmp({
        inputs: ['animated', 'disabled', 'expand', 'mode', 'multiple', 'readonly', 'value']
    }),
    Component({
        selector: 'ion-accordion-group',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated', 'disabled', 'expand', 'mode', 'multiple', 'readonly', 'value'],
        outputs: ['ionChange'],
        standalone: false
    })
], IonAccordionGroup);
export { IonAccordionGroup };
let IonActionSheet = class IonActionSheet {
    constructor(c, r, z) {
        this.z = z;
        this.ionActionSheetDidPresent = new EventEmitter();
        this.ionActionSheetWillPresent = new EventEmitter();
        this.ionActionSheetWillDismiss = new EventEmitter();
        this.ionActionSheetDidDismiss = new EventEmitter();
        this.didPresent = new EventEmitter();
        this.willPresent = new EventEmitter();
        this.willDismiss = new EventEmitter();
        this.didDismiss = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonActionSheet.prototype, "ionActionSheetDidPresent", void 0);
__decorate([
    Output()
], IonActionSheet.prototype, "ionActionSheetWillPresent", void 0);
__decorate([
    Output()
], IonActionSheet.prototype, "ionActionSheetWillDismiss", void 0);
__decorate([
    Output()
], IonActionSheet.prototype, "ionActionSheetDidDismiss", void 0);
__decorate([
    Output()
], IonActionSheet.prototype, "didPresent", void 0);
__decorate([
    Output()
], IonActionSheet.prototype, "willPresent", void 0);
__decorate([
    Output()
], IonActionSheet.prototype, "willDismiss", void 0);
__decorate([
    Output()
], IonActionSheet.prototype, "didDismiss", void 0);
IonActionSheet = __decorate([
    ProxyCmp({
        inputs: ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'subHeader', 'translucent', 'trigger'],
        methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss']
    }),
    Component({
        selector: 'ion-action-sheet',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'subHeader', 'translucent', 'trigger'],
        outputs: ['ionActionSheetDidPresent', 'ionActionSheetWillPresent', 'ionActionSheetWillDismiss', 'ionActionSheetDidDismiss', 'didPresent', 'willPresent', 'willDismiss', 'didDismiss'],
        standalone: false
    })
], IonActionSheet);
export { IonActionSheet };
let IonAlert = class IonAlert {
    constructor(c, r, z) {
        this.z = z;
        this.ionAlertDidPresent = new EventEmitter();
        this.ionAlertWillPresent = new EventEmitter();
        this.ionAlertWillDismiss = new EventEmitter();
        this.ionAlertDidDismiss = new EventEmitter();
        this.didPresent = new EventEmitter();
        this.willPresent = new EventEmitter();
        this.willDismiss = new EventEmitter();
        this.didDismiss = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonAlert.prototype, "ionAlertDidPresent", void 0);
__decorate([
    Output()
], IonAlert.prototype, "ionAlertWillPresent", void 0);
__decorate([
    Output()
], IonAlert.prototype, "ionAlertWillDismiss", void 0);
__decorate([
    Output()
], IonAlert.prototype, "ionAlertDidDismiss", void 0);
__decorate([
    Output()
], IonAlert.prototype, "didPresent", void 0);
__decorate([
    Output()
], IonAlert.prototype, "willPresent", void 0);
__decorate([
    Output()
], IonAlert.prototype, "willDismiss", void 0);
__decorate([
    Output()
], IonAlert.prototype, "didDismiss", void 0);
IonAlert = __decorate([
    ProxyCmp({
        inputs: ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'inputs', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'subHeader', 'translucent', 'trigger'],
        methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss']
    }),
    Component({
        selector: 'ion-alert',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'inputs', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'subHeader', 'translucent', 'trigger'],
        outputs: ['ionAlertDidPresent', 'ionAlertWillPresent', 'ionAlertWillDismiss', 'ionAlertDidDismiss', 'didPresent', 'willPresent', 'willDismiss', 'didDismiss'],
        standalone: false
    })
], IonAlert);
export { IonAlert };
let IonApp = class IonApp {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonApp = __decorate([
    ProxyCmp({
        methods: ['setFocus']
    }),
    Component({
        selector: 'ion-app',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
        standalone: false
    })
], IonApp);
export { IonApp };
let IonAvatar = class IonAvatar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonAvatar = __decorate([
    ProxyCmp({}),
    Component({
        selector: 'ion-avatar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
        standalone: false
    })
], IonAvatar);
export { IonAvatar };
let IonBackdrop = class IonBackdrop {
    constructor(c, r, z) {
        this.z = z;
        this.ionBackdropTap = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonBackdrop.prototype, "ionBackdropTap", void 0);
IonBackdrop = __decorate([
    ProxyCmp({
        inputs: ['stopPropagation', 'tappable', 'visible']
    }),
    Component({
        selector: 'ion-backdrop',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['stopPropagation', 'tappable', 'visible'],
        outputs: ['ionBackdropTap'],
        standalone: false
    })
], IonBackdrop);
export { IonBackdrop };
let IonBadge = class IonBadge {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonBadge = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-badge',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
        standalone: false
    })
], IonBadge);
export { IonBadge };
let IonBreadcrumb = class IonBreadcrumb {
    constructor(c, r, z) {
        this.z = z;
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonBreadcrumb.prototype, "ionFocus", void 0);
__decorate([
    Output()
], IonBreadcrumb.prototype, "ionBlur", void 0);
IonBreadcrumb = __decorate([
    ProxyCmp({
        inputs: ['active', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'separator', 'target']
    }),
    Component({
        selector: 'ion-breadcrumb',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['active', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'separator', 'target'],
        outputs: ['ionFocus', 'ionBlur'],
        standalone: false
    })
], IonBreadcrumb);
export { IonBreadcrumb };
let IonBreadcrumbs = class IonBreadcrumbs {
    constructor(c, r, z) {
        this.z = z;
        this.ionCollapsedClick = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonBreadcrumbs.prototype, "ionCollapsedClick", void 0);
IonBreadcrumbs = __decorate([
    ProxyCmp({
        inputs: ['color', 'itemsAfterCollapse', 'itemsBeforeCollapse', 'maxItems', 'mode']
    }),
    Component({
        selector: 'ion-breadcrumbs',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'itemsAfterCollapse', 'itemsBeforeCollapse', 'maxItems', 'mode'],
        outputs: ['ionCollapsedClick'],
        standalone: false
    })
], IonBreadcrumbs);
export { IonBreadcrumbs };
let IonButton = class IonButton {
    constructor(c, r, z) {
        this.z = z;
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonButton.prototype, "ionFocus", void 0);
__decorate([
    Output()
], IonButton.prototype, "ionBlur", void 0);
IonButton = __decorate([
    ProxyCmp({
        inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'form', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'size', 'strong', 'target', 'type']
    }),
    Component({
        selector: 'ion-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'form', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'size', 'strong', 'target', 'type'],
        outputs: ['ionFocus', 'ionBlur'],
        standalone: false
    })
], IonButton);
export { IonButton };
let IonButtons = class IonButtons {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonButtons = __decorate([
    ProxyCmp({
        inputs: ['collapse']
    }),
    Component({
        selector: 'ion-buttons',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['collapse'],
        standalone: false
    })
], IonButtons);
export { IonButtons };
let IonCard = class IonCard {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCard = __decorate([
    ProxyCmp({
        inputs: ['button', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type']
    }),
    Component({
        selector: 'ion-card',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['button', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type'],
        standalone: false
    })
], IonCard);
export { IonCard };
let IonCardContent = class IonCardContent {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCardContent = __decorate([
    ProxyCmp({
        inputs: ['mode']
    }),
    Component({
        selector: 'ion-card-content',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['mode'],
        standalone: false
    })
], IonCardContent);
export { IonCardContent };
let IonCardHeader = class IonCardHeader {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCardHeader = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode', 'translucent']
    }),
    Component({
        selector: 'ion-card-header',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode', 'translucent'],
        standalone: false
    })
], IonCardHeader);
export { IonCardHeader };
let IonCardSubtitle = class IonCardSubtitle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCardSubtitle = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-card-subtitle',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
        standalone: false
    })
], IonCardSubtitle);
export { IonCardSubtitle };
let IonCardTitle = class IonCardTitle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCardTitle = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-card-title',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
        standalone: false
    })
], IonCardTitle);
export { IonCardTitle };
let IonCheckbox = class IonCheckbox {
    constructor(c, r, z) {
        this.z = z;
        this.ionChange = new EventEmitter();
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonCheckbox.prototype, "ionChange", void 0);
__decorate([
    Output()
], IonCheckbox.prototype, "ionFocus", void 0);
__decorate([
    Output()
], IonCheckbox.prototype, "ionBlur", void 0);
IonCheckbox = __decorate([
    ProxyCmp({
        inputs: ['alignment', 'checked', 'color', 'disabled', 'errorText', 'helperText', 'indeterminate', 'justify', 'labelPlacement', 'mode', 'name', 'required', 'value']
    }),
    Component({
        selector: 'ion-checkbox',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['alignment', 'checked', 'color', 'disabled', 'errorText', 'helperText', 'indeterminate', 'justify', 'labelPlacement', 'mode', 'name', 'required', 'value'],
        outputs: ['ionChange', 'ionFocus', 'ionBlur'],
        standalone: false
    })
], IonCheckbox);
export { IonCheckbox };
let IonChip = class IonChip {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonChip = __decorate([
    ProxyCmp({
        inputs: ['color', 'disabled', 'mode', 'outline']
    }),
    Component({
        selector: 'ion-chip',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'disabled', 'mode', 'outline'],
        standalone: false
    })
], IonChip);
export { IonChip };
let IonCol = class IonCol {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonCol = __decorate([
    ProxyCmp({
        inputs: ['offset', 'offsetLg', 'offsetMd', 'offsetSm', 'offsetXl', 'offsetXs', 'pull', 'pullLg', 'pullMd', 'pullSm', 'pullXl', 'pullXs', 'push', 'pushLg', 'pushMd', 'pushSm', 'pushXl', 'pushXs', 'size', 'sizeLg', 'sizeMd', 'sizeSm', 'sizeXl', 'sizeXs']
    }),
    Component({
        selector: 'ion-col',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['offset', 'offsetLg', 'offsetMd', 'offsetSm', 'offsetXl', 'offsetXs', 'pull', 'pullLg', 'pullMd', 'pullSm', 'pullXl', 'pullXs', 'push', 'pushLg', 'pushMd', 'pushSm', 'pushXl', 'pushXs', 'size', 'sizeLg', 'sizeMd', 'sizeSm', 'sizeXl', 'sizeXs'],
        standalone: false
    })
], IonCol);
export { IonCol };
let IonContent = class IonContent {
    constructor(c, r, z) {
        this.z = z;
        this.ionScrollStart = new EventEmitter();
        this.ionScroll = new EventEmitter();
        this.ionScrollEnd = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonContent.prototype, "ionScrollStart", void 0);
__decorate([
    Output()
], IonContent.prototype, "ionScroll", void 0);
__decorate([
    Output()
], IonContent.prototype, "ionScrollEnd", void 0);
IonContent = __decorate([
    ProxyCmp({
        inputs: ['color', 'fixedSlotPlacement', 'forceOverscroll', 'fullscreen', 'scrollEvents', 'scrollX', 'scrollY'],
        methods: ['getScrollElement', 'scrollToTop', 'scrollToBottom', 'scrollByPoint', 'scrollToPoint']
    }),
    Component({
        selector: 'ion-content',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'fixedSlotPlacement', 'forceOverscroll', 'fullscreen', 'scrollEvents', 'scrollX', 'scrollY'],
        outputs: ['ionScrollStart', 'ionScroll', 'ionScrollEnd'],
        standalone: false
    })
], IonContent);
export { IonContent };
let IonDatetime = class IonDatetime {
    constructor(c, r, z) {
        this.z = z;
        this.ionCancel = new EventEmitter();
        this.ionChange = new EventEmitter();
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonDatetime.prototype, "ionCancel", void 0);
__decorate([
    Output()
], IonDatetime.prototype, "ionChange", void 0);
__decorate([
    Output()
], IonDatetime.prototype, "ionFocus", void 0);
__decorate([
    Output()
], IonDatetime.prototype, "ionBlur", void 0);
IonDatetime = __decorate([
    ProxyCmp({
        inputs: ['cancelText', 'clearText', 'color', 'dayValues', 'disabled', 'doneText', 'firstDayOfWeek', 'formatOptions', 'highlightedDates', 'hourCycle', 'hourValues', 'isDateEnabled', 'locale', 'max', 'min', 'minuteValues', 'mode', 'monthValues', 'multiple', 'name', 'preferWheel', 'presentation', 'readonly', 'showAdjacentDays', 'showClearButton', 'showDefaultButtons', 'showDefaultTimeLabel', 'showDefaultTitle', 'size', 'titleSelectedDatesFormatter', 'value', 'yearValues'],
        methods: ['confirm', 'reset', 'cancel']
    }),
    Component({
        selector: 'ion-datetime',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['cancelText', 'clearText', 'color', 'dayValues', 'disabled', 'doneText', 'firstDayOfWeek', 'formatOptions', 'highlightedDates', 'hourCycle', 'hourValues', 'isDateEnabled', 'locale', 'max', 'min', 'minuteValues', 'mode', 'monthValues', 'multiple', 'name', 'preferWheel', 'presentation', 'readonly', 'showAdjacentDays', 'showClearButton', 'showDefaultButtons', 'showDefaultTimeLabel', 'showDefaultTitle', 'size', 'titleSelectedDatesFormatter', 'value', 'yearValues'],
        outputs: ['ionCancel', 'ionChange', 'ionFocus', 'ionBlur'],
        standalone: false
    })
], IonDatetime);
export { IonDatetime };
let IonDatetimeButton = class IonDatetimeButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonDatetimeButton = __decorate([
    ProxyCmp({
        inputs: ['color', 'datetime', 'disabled', 'mode']
    }),
    Component({
        selector: 'ion-datetime-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'datetime', 'disabled', 'mode'],
        standalone: false
    })
], IonDatetimeButton);
export { IonDatetimeButton };
let IonFab = class IonFab {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonFab = __decorate([
    ProxyCmp({
        inputs: ['activated', 'edge', 'horizontal', 'vertical'],
        methods: ['close']
    }),
    Component({
        selector: 'ion-fab',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['activated', 'edge', 'horizontal', 'vertical'],
        standalone: false
    })
], IonFab);
export { IonFab };
let IonFabButton = class IonFabButton {
    constructor(c, r, z) {
        this.z = z;
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonFabButton.prototype, "ionFocus", void 0);
__decorate([
    Output()
], IonFabButton.prototype, "ionBlur", void 0);
IonFabButton = __decorate([
    ProxyCmp({
        inputs: ['activated', 'closeIcon', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'show', 'size', 'target', 'translucent', 'type']
    }),
    Component({
        selector: 'ion-fab-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['activated', 'closeIcon', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'show', 'size', 'target', 'translucent', 'type'],
        outputs: ['ionFocus', 'ionBlur'],
        standalone: false
    })
], IonFabButton);
export { IonFabButton };
let IonFabList = class IonFabList {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonFabList = __decorate([
    ProxyCmp({
        inputs: ['activated', 'side']
    }),
    Component({
        selector: 'ion-fab-list',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['activated', 'side'],
        standalone: false
    })
], IonFabList);
export { IonFabList };
let IonFooter = class IonFooter {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonFooter = __decorate([
    ProxyCmp({
        inputs: ['collapse', 'mode', 'translucent']
    }),
    Component({
        selector: 'ion-footer',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['collapse', 'mode', 'translucent'],
        standalone: false
    })
], IonFooter);
export { IonFooter };
let IonGrid = class IonGrid {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonGrid = __decorate([
    ProxyCmp({
        inputs: ['fixed']
    }),
    Component({
        selector: 'ion-grid',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['fixed'],
        standalone: false
    })
], IonGrid);
export { IonGrid };
let IonHeader = class IonHeader {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonHeader = __decorate([
    ProxyCmp({
        inputs: ['collapse', 'mode', 'translucent']
    }),
    Component({
        selector: 'ion-header',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['collapse', 'mode', 'translucent'],
        standalone: false
    })
], IonHeader);
export { IonHeader };
let IonIcon = class IonIcon {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonIcon = __decorate([
    ProxyCmp({
        inputs: ['color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src']
    }),
    Component({
        selector: 'ion-icon',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'sanitize', 'size', 'src'],
        standalone: false
    })
], IonIcon);
export { IonIcon };
let IonImg = class IonImg {
    constructor(c, r, z) {
        this.z = z;
        this.ionImgWillLoad = new EventEmitter();
        this.ionImgDidLoad = new EventEmitter();
        this.ionError = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonImg.prototype, "ionImgWillLoad", void 0);
__decorate([
    Output()
], IonImg.prototype, "ionImgDidLoad", void 0);
__decorate([
    Output()
], IonImg.prototype, "ionError", void 0);
IonImg = __decorate([
    ProxyCmp({
        inputs: ['alt', 'src']
    }),
    Component({
        selector: 'ion-img',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['alt', 'src'],
        outputs: ['ionImgWillLoad', 'ionImgDidLoad', 'ionError'],
        standalone: false
    })
], IonImg);
export { IonImg };
let IonInfiniteScroll = class IonInfiniteScroll {
    constructor(c, r, z) {
        this.z = z;
        this.ionInfinite = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonInfiniteScroll.prototype, "ionInfinite", void 0);
IonInfiniteScroll = __decorate([
    ProxyCmp({
        inputs: ['disabled', 'position', 'threshold'],
        methods: ['complete']
    }),
    Component({
        selector: 'ion-infinite-scroll',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['disabled', 'position', 'threshold'],
        outputs: ['ionInfinite'],
        standalone: false
    })
], IonInfiniteScroll);
export { IonInfiniteScroll };
let IonInfiniteScrollContent = class IonInfiniteScrollContent {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonInfiniteScrollContent = __decorate([
    ProxyCmp({
        inputs: ['loadingSpinner', 'loadingText']
    }),
    Component({
        selector: 'ion-infinite-scroll-content',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['loadingSpinner', 'loadingText'],
        standalone: false
    })
], IonInfiniteScrollContent);
export { IonInfiniteScrollContent };
let IonInput = class IonInput {
    constructor(c, r, z) {
        this.z = z;
        this.ionInput = new EventEmitter();
        this.ionChange = new EventEmitter();
        this.ionBlur = new EventEmitter();
        this.ionFocus = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonInput.prototype, "ionInput", void 0);
__decorate([
    Output()
], IonInput.prototype, "ionChange", void 0);
__decorate([
    Output()
], IonInput.prototype, "ionBlur", void 0);
__decorate([
    Output()
], IonInput.prototype, "ionFocus", void 0);
IonInput = __decorate([
    ProxyCmp({
        inputs: ['autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearInputIcon', 'clearOnEdit', 'color', 'counter', 'counterFormatter', 'debounce', 'disabled', 'enterkeyhint', 'errorText', 'fill', 'helperText', 'inputmode', 'label', 'labelPlacement', 'max', 'maxlength', 'min', 'minlength', 'mode', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'shape', 'spellcheck', 'step', 'type', 'value'],
        methods: ['setFocus', 'getInputElement']
    }),
    Component({
        selector: 'ion-input',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearInputIcon', 'clearOnEdit', 'color', 'counter', 'counterFormatter', 'debounce', 'disabled', 'enterkeyhint', 'errorText', 'fill', 'helperText', 'inputmode', 'label', 'labelPlacement', 'max', 'maxlength', 'min', 'minlength', 'mode', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'shape', 'spellcheck', 'step', 'type', 'value'],
        outputs: ['ionInput', 'ionChange', 'ionBlur', 'ionFocus'],
        standalone: false
    })
], IonInput);
export { IonInput };
let IonInputOtp = class IonInputOtp {
    constructor(c, r, z) {
        this.z = z;
        this.ionInput = new EventEmitter();
        this.ionChange = new EventEmitter();
        this.ionComplete = new EventEmitter();
        this.ionBlur = new EventEmitter();
        this.ionFocus = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonInputOtp.prototype, "ionInput", void 0);
__decorate([
    Output()
], IonInputOtp.prototype, "ionChange", void 0);
__decorate([
    Output()
], IonInputOtp.prototype, "ionComplete", void 0);
__decorate([
    Output()
], IonInputOtp.prototype, "ionBlur", void 0);
__decorate([
    Output()
], IonInputOtp.prototype, "ionFocus", void 0);
IonInputOtp = __decorate([
    ProxyCmp({
        inputs: ['autocapitalize', 'color', 'disabled', 'fill', 'inputmode', 'length', 'pattern', 'readonly', 'separators', 'shape', 'size', 'type', 'value'],
        methods: ['setFocus']
    }),
    Component({
        selector: 'ion-input-otp',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['autocapitalize', 'color', 'disabled', 'fill', 'inputmode', 'length', 'pattern', 'readonly', 'separators', 'shape', 'size', 'type', 'value'],
        outputs: ['ionInput', 'ionChange', 'ionComplete', 'ionBlur', 'ionFocus'],
        standalone: false
    })
], IonInputOtp);
export { IonInputOtp };
let IonInputPasswordToggle = class IonInputPasswordToggle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonInputPasswordToggle = __decorate([
    ProxyCmp({
        inputs: ['color', 'hideIcon', 'mode', 'showIcon']
    }),
    Component({
        selector: 'ion-input-password-toggle',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'hideIcon', 'mode', 'showIcon'],
        standalone: false
    })
], IonInputPasswordToggle);
export { IonInputPasswordToggle };
let IonItem = class IonItem {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonItem = __decorate([
    ProxyCmp({
        inputs: ['button', 'color', 'detail', 'detailIcon', 'disabled', 'download', 'href', 'lines', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type']
    }),
    Component({
        selector: 'ion-item',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['button', 'color', 'detail', 'detailIcon', 'disabled', 'download', 'href', 'lines', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type'],
        standalone: false
    })
], IonItem);
export { IonItem };
let IonItemDivider = class IonItemDivider {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonItemDivider = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode', 'sticky']
    }),
    Component({
        selector: 'ion-item-divider',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode', 'sticky'],
        standalone: false
    })
], IonItemDivider);
export { IonItemDivider };
let IonItemGroup = class IonItemGroup {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonItemGroup = __decorate([
    ProxyCmp({}),
    Component({
        selector: 'ion-item-group',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
        standalone: false
    })
], IonItemGroup);
export { IonItemGroup };
let IonItemOption = class IonItemOption {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonItemOption = __decorate([
    ProxyCmp({
        inputs: ['color', 'disabled', 'download', 'expandable', 'href', 'mode', 'rel', 'target', 'type']
    }),
    Component({
        selector: 'ion-item-option',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'disabled', 'download', 'expandable', 'href', 'mode', 'rel', 'target', 'type'],
        standalone: false
    })
], IonItemOption);
export { IonItemOption };
let IonItemOptions = class IonItemOptions {
    constructor(c, r, z) {
        this.z = z;
        this.ionSwipe = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonItemOptions.prototype, "ionSwipe", void 0);
IonItemOptions = __decorate([
    ProxyCmp({
        inputs: ['side']
    }),
    Component({
        selector: 'ion-item-options',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['side'],
        outputs: ['ionSwipe'],
        standalone: false
    })
], IonItemOptions);
export { IonItemOptions };
let IonItemSliding = class IonItemSliding {
    constructor(c, r, z) {
        this.z = z;
        this.ionDrag = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonItemSliding.prototype, "ionDrag", void 0);
IonItemSliding = __decorate([
    ProxyCmp({
        inputs: ['disabled'],
        methods: ['getOpenAmount', 'getSlidingRatio', 'open', 'close', 'closeOpened']
    }),
    Component({
        selector: 'ion-item-sliding',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['disabled'],
        outputs: ['ionDrag'],
        standalone: false
    })
], IonItemSliding);
export { IonItemSliding };
let IonLabel = class IonLabel {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonLabel = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode', 'position']
    }),
    Component({
        selector: 'ion-label',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode', 'position'],
        standalone: false
    })
], IonLabel);
export { IonLabel };
let IonList = class IonList {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonList = __decorate([
    ProxyCmp({
        inputs: ['inset', 'lines', 'mode'],
        methods: ['closeSlidingItems']
    }),
    Component({
        selector: 'ion-list',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['inset', 'lines', 'mode'],
        standalone: false
    })
], IonList);
export { IonList };
let IonListHeader = class IonListHeader {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonListHeader = __decorate([
    ProxyCmp({
        inputs: ['color', 'lines', 'mode']
    }),
    Component({
        selector: 'ion-list-header',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'lines', 'mode'],
        standalone: false
    })
], IonListHeader);
export { IonListHeader };
let IonLoading = class IonLoading {
    constructor(c, r, z) {
        this.z = z;
        this.ionLoadingDidPresent = new EventEmitter();
        this.ionLoadingWillPresent = new EventEmitter();
        this.ionLoadingWillDismiss = new EventEmitter();
        this.ionLoadingDidDismiss = new EventEmitter();
        this.didPresent = new EventEmitter();
        this.willPresent = new EventEmitter();
        this.willDismiss = new EventEmitter();
        this.didDismiss = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonLoading.prototype, "ionLoadingDidPresent", void 0);
__decorate([
    Output()
], IonLoading.prototype, "ionLoadingWillPresent", void 0);
__decorate([
    Output()
], IonLoading.prototype, "ionLoadingWillDismiss", void 0);
__decorate([
    Output()
], IonLoading.prototype, "ionLoadingDidDismiss", void 0);
__decorate([
    Output()
], IonLoading.prototype, "didPresent", void 0);
__decorate([
    Output()
], IonLoading.prototype, "willPresent", void 0);
__decorate([
    Output()
], IonLoading.prototype, "willDismiss", void 0);
__decorate([
    Output()
], IonLoading.prototype, "didDismiss", void 0);
IonLoading = __decorate([
    ProxyCmp({
        inputs: ['animated', 'backdropDismiss', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'showBackdrop', 'spinner', 'translucent', 'trigger'],
        methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss']
    }),
    Component({
        selector: 'ion-loading',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated', 'backdropDismiss', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'showBackdrop', 'spinner', 'translucent', 'trigger'],
        outputs: ['ionLoadingDidPresent', 'ionLoadingWillPresent', 'ionLoadingWillDismiss', 'ionLoadingDidDismiss', 'didPresent', 'willPresent', 'willDismiss', 'didDismiss'],
        standalone: false
    })
], IonLoading);
export { IonLoading };
let IonMenu = class IonMenu {
    constructor(c, r, z) {
        this.z = z;
        this.ionWillOpen = new EventEmitter();
        this.ionWillClose = new EventEmitter();
        this.ionDidOpen = new EventEmitter();
        this.ionDidClose = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonMenu.prototype, "ionWillOpen", void 0);
__decorate([
    Output()
], IonMenu.prototype, "ionWillClose", void 0);
__decorate([
    Output()
], IonMenu.prototype, "ionDidOpen", void 0);
__decorate([
    Output()
], IonMenu.prototype, "ionDidClose", void 0);
IonMenu = __decorate([
    ProxyCmp({
        inputs: ['contentId', 'disabled', 'maxEdgeStart', 'menuId', 'side', 'swipeGesture', 'type'],
        methods: ['isOpen', 'isActive', 'open', 'close', 'toggle', 'setOpen']
    }),
    Component({
        selector: 'ion-menu',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['contentId', 'disabled', 'maxEdgeStart', 'menuId', 'side', 'swipeGesture', 'type'],
        outputs: ['ionWillOpen', 'ionWillClose', 'ionDidOpen', 'ionDidClose'],
        standalone: false
    })
], IonMenu);
export { IonMenu };
let IonMenuButton = class IonMenuButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonMenuButton = __decorate([
    ProxyCmp({
        inputs: ['autoHide', 'color', 'disabled', 'menu', 'mode', 'type']
    }),
    Component({
        selector: 'ion-menu-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['autoHide', 'color', 'disabled', 'menu', 'mode', 'type'],
        standalone: false
    })
], IonMenuButton);
export { IonMenuButton };
let IonMenuToggle = class IonMenuToggle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonMenuToggle = __decorate([
    ProxyCmp({
        inputs: ['autoHide', 'menu']
    }),
    Component({
        selector: 'ion-menu-toggle',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['autoHide', 'menu'],
        standalone: false
    })
], IonMenuToggle);
export { IonMenuToggle };
let IonNavLink = class IonNavLink {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonNavLink = __decorate([
    ProxyCmp({
        inputs: ['component', 'componentProps', 'routerAnimation', 'routerDirection']
    }),
    Component({
        selector: 'ion-nav-link',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['component', 'componentProps', 'routerAnimation', 'routerDirection'],
        standalone: false
    })
], IonNavLink);
export { IonNavLink };
let IonNote = class IonNote {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonNote = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-note',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
        standalone: false
    })
], IonNote);
export { IonNote };
let IonPicker = class IonPicker {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonPicker = __decorate([
    ProxyCmp({
        inputs: ['mode']
    }),
    Component({
        selector: 'ion-picker',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['mode'],
        standalone: false
    })
], IonPicker);
export { IonPicker };
let IonPickerColumn = class IonPickerColumn {
    constructor(c, r, z) {
        this.z = z;
        this.ionChange = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonPickerColumn.prototype, "ionChange", void 0);
IonPickerColumn = __decorate([
    ProxyCmp({
        inputs: ['color', 'disabled', 'mode', 'value'],
        methods: ['setFocus']
    }),
    Component({
        selector: 'ion-picker-column',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'disabled', 'mode', 'value'],
        outputs: ['ionChange'],
        standalone: false
    })
], IonPickerColumn);
export { IonPickerColumn };
let IonPickerColumnOption = class IonPickerColumnOption {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonPickerColumnOption = __decorate([
    ProxyCmp({
        inputs: ['color', 'disabled', 'value']
    }),
    Component({
        selector: 'ion-picker-column-option',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'disabled', 'value'],
        standalone: false
    })
], IonPickerColumnOption);
export { IonPickerColumnOption };
let IonProgressBar = class IonProgressBar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonProgressBar = __decorate([
    ProxyCmp({
        inputs: ['buffer', 'color', 'mode', 'reversed', 'type', 'value']
    }),
    Component({
        selector: 'ion-progress-bar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['buffer', 'color', 'mode', 'reversed', 'type', 'value'],
        standalone: false
    })
], IonProgressBar);
export { IonProgressBar };
let IonRadio = class IonRadio {
    constructor(c, r, z) {
        this.z = z;
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonRadio.prototype, "ionFocus", void 0);
__decorate([
    Output()
], IonRadio.prototype, "ionBlur", void 0);
IonRadio = __decorate([
    ProxyCmp({
        inputs: ['alignment', 'color', 'disabled', 'justify', 'labelPlacement', 'mode', 'name', 'value']
    }),
    Component({
        selector: 'ion-radio',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['alignment', 'color', 'disabled', 'justify', 'labelPlacement', 'mode', 'name', 'value'],
        outputs: ['ionFocus', 'ionBlur'],
        standalone: false
    })
], IonRadio);
export { IonRadio };
let IonRadioGroup = class IonRadioGroup {
    constructor(c, r, z) {
        this.z = z;
        this.ionChange = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonRadioGroup.prototype, "ionChange", void 0);
IonRadioGroup = __decorate([
    ProxyCmp({
        inputs: ['allowEmptySelection', 'compareWith', 'errorText', 'helperText', 'name', 'value']
    }),
    Component({
        selector: 'ion-radio-group',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['allowEmptySelection', 'compareWith', 'errorText', 'helperText', 'name', 'value'],
        outputs: ['ionChange'],
        standalone: false
    })
], IonRadioGroup);
export { IonRadioGroup };
let IonRange = class IonRange {
    constructor(c, r, z) {
        this.z = z;
        this.ionChange = new EventEmitter();
        this.ionInput = new EventEmitter();
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        this.ionKnobMoveStart = new EventEmitter();
        this.ionKnobMoveEnd = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonRange.prototype, "ionChange", void 0);
__decorate([
    Output()
], IonRange.prototype, "ionInput", void 0);
__decorate([
    Output()
], IonRange.prototype, "ionFocus", void 0);
__decorate([
    Output()
], IonRange.prototype, "ionBlur", void 0);
__decorate([
    Output()
], IonRange.prototype, "ionKnobMoveStart", void 0);
__decorate([
    Output()
], IonRange.prototype, "ionKnobMoveEnd", void 0);
IonRange = __decorate([
    ProxyCmp({
        inputs: ['activeBarStart', 'color', 'debounce', 'disabled', 'dualKnobs', 'label', 'labelPlacement', 'max', 'min', 'mode', 'name', 'pin', 'pinFormatter', 'snaps', 'step', 'ticks', 'value']
    }),
    Component({
        selector: 'ion-range',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['activeBarStart', 'color', 'debounce', 'disabled', 'dualKnobs', 'label', 'labelPlacement', 'max', 'min', 'mode', 'name', 'pin', 'pinFormatter', 'snaps', 'step', 'ticks', 'value'],
        outputs: ['ionChange', 'ionInput', 'ionFocus', 'ionBlur', 'ionKnobMoveStart', 'ionKnobMoveEnd'],
        standalone: false
    })
], IonRange);
export { IonRange };
let IonRefresher = class IonRefresher {
    constructor(c, r, z) {
        this.z = z;
        this.ionRefresh = new EventEmitter();
        this.ionPull = new EventEmitter();
        this.ionStart = new EventEmitter();
        this.ionPullStart = new EventEmitter();
        this.ionPullEnd = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonRefresher.prototype, "ionRefresh", void 0);
__decorate([
    Output()
], IonRefresher.prototype, "ionPull", void 0);
__decorate([
    Output()
], IonRefresher.prototype, "ionStart", void 0);
__decorate([
    Output()
], IonRefresher.prototype, "ionPullStart", void 0);
__decorate([
    Output()
], IonRefresher.prototype, "ionPullEnd", void 0);
IonRefresher = __decorate([
    ProxyCmp({
        inputs: ['closeDuration', 'disabled', 'mode', 'pullFactor', 'pullMax', 'pullMin', 'snapbackDuration'],
        methods: ['complete', 'cancel', 'getProgress']
    }),
    Component({
        selector: 'ion-refresher',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['closeDuration', 'disabled', 'mode', 'pullFactor', 'pullMax', 'pullMin', 'snapbackDuration'],
        outputs: ['ionRefresh', 'ionPull', 'ionStart', 'ionPullStart', 'ionPullEnd'],
        standalone: false
    })
], IonRefresher);
export { IonRefresher };
let IonRefresherContent = class IonRefresherContent {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonRefresherContent = __decorate([
    ProxyCmp({
        inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']
    }),
    Component({
        selector: 'ion-refresher-content',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText'],
        standalone: false
    })
], IonRefresherContent);
export { IonRefresherContent };
let IonReorder = class IonReorder {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonReorder = __decorate([
    ProxyCmp({}),
    Component({
        selector: 'ion-reorder',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
        standalone: false
    })
], IonReorder);
export { IonReorder };
let IonReorderGroup = class IonReorderGroup {
    constructor(c, r, z) {
        this.z = z;
        this.ionItemReorder = new EventEmitter();
        this.ionReorderStart = new EventEmitter();
        this.ionReorderMove = new EventEmitter();
        this.ionReorderEnd = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonReorderGroup.prototype, "ionItemReorder", void 0);
__decorate([
    Output()
], IonReorderGroup.prototype, "ionReorderStart", void 0);
__decorate([
    Output()
], IonReorderGroup.prototype, "ionReorderMove", void 0);
__decorate([
    Output()
], IonReorderGroup.prototype, "ionReorderEnd", void 0);
IonReorderGroup = __decorate([
    ProxyCmp({
        inputs: ['disabled'],
        methods: ['complete']
    }),
    Component({
        selector: 'ion-reorder-group',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['disabled'],
        outputs: ['ionItemReorder', 'ionReorderStart', 'ionReorderMove', 'ionReorderEnd'],
        standalone: false
    })
], IonReorderGroup);
export { IonReorderGroup };
let IonRippleEffect = class IonRippleEffect {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonRippleEffect = __decorate([
    ProxyCmp({
        inputs: ['type'],
        methods: ['addRipple']
    }),
    Component({
        selector: 'ion-ripple-effect',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['type'],
        standalone: false
    })
], IonRippleEffect);
export { IonRippleEffect };
let IonRow = class IonRow {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonRow = __decorate([
    ProxyCmp({}),
    Component({
        selector: 'ion-row',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
        standalone: false
    })
], IonRow);
export { IonRow };
let IonSearchbar = class IonSearchbar {
    constructor(c, r, z) {
        this.z = z;
        this.ionInput = new EventEmitter();
        this.ionChange = new EventEmitter();
        this.ionCancel = new EventEmitter();
        this.ionClear = new EventEmitter();
        this.ionBlur = new EventEmitter();
        this.ionFocus = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonSearchbar.prototype, "ionInput", void 0);
__decorate([
    Output()
], IonSearchbar.prototype, "ionChange", void 0);
__decorate([
    Output()
], IonSearchbar.prototype, "ionCancel", void 0);
__decorate([
    Output()
], IonSearchbar.prototype, "ionClear", void 0);
__decorate([
    Output()
], IonSearchbar.prototype, "ionBlur", void 0);
__decorate([
    Output()
], IonSearchbar.prototype, "ionFocus", void 0);
IonSearchbar = __decorate([
    ProxyCmp({
        inputs: ['animated', 'autocapitalize', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'color', 'debounce', 'disabled', 'enterkeyhint', 'inputmode', 'maxlength', 'minlength', 'mode', 'name', 'placeholder', 'searchIcon', 'showCancelButton', 'showClearButton', 'spellcheck', 'type', 'value'],
        methods: ['setFocus', 'getInputElement']
    }),
    Component({
        selector: 'ion-searchbar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated', 'autocapitalize', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'color', 'debounce', 'disabled', 'enterkeyhint', 'inputmode', 'maxlength', 'minlength', 'mode', 'name', 'placeholder', 'searchIcon', 'showCancelButton', 'showClearButton', 'spellcheck', 'type', 'value'],
        outputs: ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus'],
        standalone: false
    })
], IonSearchbar);
export { IonSearchbar };
let IonSegment = class IonSegment {
    constructor(c, r, z) {
        this.z = z;
        this.ionChange = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonSegment.prototype, "ionChange", void 0);
IonSegment = __decorate([
    ProxyCmp({
        inputs: ['color', 'disabled', 'mode', 'scrollable', 'selectOnFocus', 'swipeGesture', 'value']
    }),
    Component({
        selector: 'ion-segment',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'disabled', 'mode', 'scrollable', 'selectOnFocus', 'swipeGesture', 'value'],
        outputs: ['ionChange'],
        standalone: false
    })
], IonSegment);
export { IonSegment };
let IonSegmentButton = class IonSegmentButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSegmentButton = __decorate([
    ProxyCmp({
        inputs: ['contentId', 'disabled', 'layout', 'mode', 'type', 'value']
    }),
    Component({
        selector: 'ion-segment-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['contentId', 'disabled', 'layout', 'mode', 'type', 'value'],
        standalone: false
    })
], IonSegmentButton);
export { IonSegmentButton };
let IonSegmentContent = class IonSegmentContent {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSegmentContent = __decorate([
    ProxyCmp({}),
    Component({
        selector: 'ion-segment-content',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
        standalone: false
    })
], IonSegmentContent);
export { IonSegmentContent };
let IonSegmentView = class IonSegmentView {
    constructor(c, r, z) {
        this.z = z;
        this.ionSegmentViewScroll = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonSegmentView.prototype, "ionSegmentViewScroll", void 0);
IonSegmentView = __decorate([
    ProxyCmp({
        inputs: ['disabled', 'swipeGesture']
    }),
    Component({
        selector: 'ion-segment-view',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['disabled', 'swipeGesture'],
        outputs: ['ionSegmentViewScroll'],
        standalone: false
    })
], IonSegmentView);
export { IonSegmentView };
let IonSelect = class IonSelect {
    constructor(c, r, z) {
        this.z = z;
        this.ionChange = new EventEmitter();
        this.ionCancel = new EventEmitter();
        this.ionDismiss = new EventEmitter();
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonSelect.prototype, "ionChange", void 0);
__decorate([
    Output()
], IonSelect.prototype, "ionCancel", void 0);
__decorate([
    Output()
], IonSelect.prototype, "ionDismiss", void 0);
__decorate([
    Output()
], IonSelect.prototype, "ionFocus", void 0);
__decorate([
    Output()
], IonSelect.prototype, "ionBlur", void 0);
IonSelect = __decorate([
    ProxyCmp({
        inputs: ['cancelText', 'color', 'compareWith', 'disabled', 'errorText', 'expandedIcon', 'fill', 'helperText', 'interface', 'interfaceOptions', 'justify', 'label', 'labelPlacement', 'mode', 'multiple', 'name', 'okText', 'placeholder', 'required', 'selectedText', 'shape', 'toggleIcon', 'value'],
        methods: ['open']
    }),
    Component({
        selector: 'ion-select',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['cancelText', 'color', 'compareWith', 'disabled', 'errorText', 'expandedIcon', 'fill', 'helperText', 'interface', 'interfaceOptions', 'justify', 'label', 'labelPlacement', 'mode', 'multiple', 'name', 'okText', 'placeholder', 'required', 'selectedText', 'shape', 'toggleIcon', 'value'],
        outputs: ['ionChange', 'ionCancel', 'ionDismiss', 'ionFocus', 'ionBlur'],
        standalone: false
    })
], IonSelect);
export { IonSelect };
let IonSelectModal = class IonSelectModal {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSelectModal = __decorate([
    ProxyCmp({
        inputs: ['cancelText', 'header', 'multiple', 'options']
    }),
    Component({
        selector: 'ion-select-modal',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['cancelText', 'header', 'multiple', 'options'],
        standalone: false
    })
], IonSelectModal);
export { IonSelectModal };
let IonSelectOption = class IonSelectOption {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSelectOption = __decorate([
    ProxyCmp({
        inputs: ['description', 'disabled', 'justify', 'labelPlacement', 'mode', 'value']
    }),
    Component({
        selector: 'ion-select-option',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['description', 'disabled', 'justify', 'labelPlacement', 'mode', 'value'],
        standalone: false
    })
], IonSelectOption);
export { IonSelectOption };
let IonSkeletonText = class IonSkeletonText {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSkeletonText = __decorate([
    ProxyCmp({
        inputs: ['animated']
    }),
    Component({
        selector: 'ion-skeleton-text',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated'],
        standalone: false
    })
], IonSkeletonText);
export { IonSkeletonText };
let IonSpinner = class IonSpinner {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSpinner = __decorate([
    ProxyCmp({
        inputs: ['color', 'duration', 'name', 'paused']
    }),
    Component({
        selector: 'ion-spinner',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'duration', 'name', 'paused'],
        standalone: false
    })
], IonSpinner);
export { IonSpinner };
let IonSplitPane = class IonSplitPane {
    constructor(c, r, z) {
        this.z = z;
        this.ionSplitPaneVisible = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonSplitPane.prototype, "ionSplitPaneVisible", void 0);
IonSplitPane = __decorate([
    ProxyCmp({
        inputs: ['contentId', 'disabled', 'when']
    }),
    Component({
        selector: 'ion-split-pane',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['contentId', 'disabled', 'when'],
        outputs: ['ionSplitPaneVisible'],
        standalone: false
    })
], IonSplitPane);
export { IonSplitPane };
let IonTab = class IonTab {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonTab = __decorate([
    ProxyCmp({
        inputs: ['component', 'tab'],
        methods: ['setActive']
    }),
    Component({
        selector: 'ion-tab',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['component', { name: 'tab', required: true }],
        standalone: false
    })
], IonTab);
export { IonTab };
let IonTabBar = class IonTabBar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonTabBar = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode', 'selectedTab', 'translucent']
    }),
    Component({
        selector: 'ion-tab-bar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode', 'selectedTab', 'translucent'],
        standalone: false
    })
], IonTabBar);
export { IonTabBar };
let IonTabButton = class IonTabButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonTabButton = __decorate([
    ProxyCmp({
        inputs: ['disabled', 'download', 'href', 'layout', 'mode', 'rel', 'selected', 'tab', 'target']
    }),
    Component({
        selector: 'ion-tab-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['disabled', 'download', 'href', 'layout', 'mode', 'rel', 'selected', 'tab', 'target'],
        standalone: false
    })
], IonTabButton);
export { IonTabButton };
let IonText = class IonText {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonText = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-text',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
        standalone: false
    })
], IonText);
export { IonText };
let IonTextarea = class IonTextarea {
    constructor(c, r, z) {
        this.z = z;
        this.ionChange = new EventEmitter();
        this.ionInput = new EventEmitter();
        this.ionBlur = new EventEmitter();
        this.ionFocus = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonTextarea.prototype, "ionChange", void 0);
__decorate([
    Output()
], IonTextarea.prototype, "ionInput", void 0);
__decorate([
    Output()
], IonTextarea.prototype, "ionBlur", void 0);
__decorate([
    Output()
], IonTextarea.prototype, "ionFocus", void 0);
IonTextarea = __decorate([
    ProxyCmp({
        inputs: ['autoGrow', 'autocapitalize', 'autofocus', 'clearOnEdit', 'color', 'cols', 'counter', 'counterFormatter', 'debounce', 'disabled', 'enterkeyhint', 'errorText', 'fill', 'helperText', 'inputmode', 'label', 'labelPlacement', 'maxlength', 'minlength', 'mode', 'name', 'placeholder', 'readonly', 'required', 'rows', 'shape', 'spellcheck', 'value', 'wrap'],
        methods: ['setFocus', 'getInputElement']
    }),
    Component({
        selector: 'ion-textarea',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['autoGrow', 'autocapitalize', 'autofocus', 'clearOnEdit', 'color', 'cols', 'counter', 'counterFormatter', 'debounce', 'disabled', 'enterkeyhint', 'errorText', 'fill', 'helperText', 'inputmode', 'label', 'labelPlacement', 'maxlength', 'minlength', 'mode', 'name', 'placeholder', 'readonly', 'required', 'rows', 'shape', 'spellcheck', 'value', 'wrap'],
        outputs: ['ionChange', 'ionInput', 'ionBlur', 'ionFocus'],
        standalone: false
    })
], IonTextarea);
export { IonTextarea };
let IonThumbnail = class IonThumbnail {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonThumbnail = __decorate([
    ProxyCmp({}),
    Component({
        selector: 'ion-thumbnail',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
        standalone: false
    })
], IonThumbnail);
export { IonThumbnail };
let IonTitle = class IonTitle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonTitle = __decorate([
    ProxyCmp({
        inputs: ['color', 'size']
    }),
    Component({
        selector: 'ion-title',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'size'],
        standalone: false
    })
], IonTitle);
export { IonTitle };
let IonToast = class IonToast {
    constructor(c, r, z) {
        this.z = z;
        this.ionToastDidPresent = new EventEmitter();
        this.ionToastWillPresent = new EventEmitter();
        this.ionToastWillDismiss = new EventEmitter();
        this.ionToastDidDismiss = new EventEmitter();
        this.didPresent = new EventEmitter();
        this.willPresent = new EventEmitter();
        this.willDismiss = new EventEmitter();
        this.didDismiss = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonToast.prototype, "ionToastDidPresent", void 0);
__decorate([
    Output()
], IonToast.prototype, "ionToastWillPresent", void 0);
__decorate([
    Output()
], IonToast.prototype, "ionToastWillDismiss", void 0);
__decorate([
    Output()
], IonToast.prototype, "ionToastDidDismiss", void 0);
__decorate([
    Output()
], IonToast.prototype, "didPresent", void 0);
__decorate([
    Output()
], IonToast.prototype, "willPresent", void 0);
__decorate([
    Output()
], IonToast.prototype, "willDismiss", void 0);
__decorate([
    Output()
], IonToast.prototype, "didDismiss", void 0);
IonToast = __decorate([
    ProxyCmp({
        inputs: ['animated', 'buttons', 'color', 'cssClass', 'duration', 'enterAnimation', 'header', 'htmlAttributes', 'icon', 'isOpen', 'keyboardClose', 'layout', 'leaveAnimation', 'message', 'mode', 'position', 'positionAnchor', 'swipeGesture', 'translucent', 'trigger'],
        methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss']
    }),
    Component({
        selector: 'ion-toast',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated', 'buttons', 'color', 'cssClass', 'duration', 'enterAnimation', 'header', 'htmlAttributes', 'icon', 'isOpen', 'keyboardClose', 'layout', 'leaveAnimation', 'message', 'mode', 'position', 'positionAnchor', 'swipeGesture', 'translucent', 'trigger'],
        outputs: ['ionToastDidPresent', 'ionToastWillPresent', 'ionToastWillDismiss', 'ionToastDidDismiss', 'didPresent', 'willPresent', 'willDismiss', 'didDismiss'],
        standalone: false
    })
], IonToast);
export { IonToast };
let IonToggle = class IonToggle {
    constructor(c, r, z) {
        this.z = z;
        this.ionChange = new EventEmitter();
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        c.detach();
        this.el = r.nativeElement;
    }
};
__decorate([
    Output()
], IonToggle.prototype, "ionChange", void 0);
__decorate([
    Output()
], IonToggle.prototype, "ionFocus", void 0);
__decorate([
    Output()
], IonToggle.prototype, "ionBlur", void 0);
IonToggle = __decorate([
    ProxyCmp({
        inputs: ['alignment', 'checked', 'color', 'disabled', 'enableOnOffLabels', 'errorText', 'helperText', 'justify', 'labelPlacement', 'mode', 'name', 'required', 'value']
    }),
    Component({
        selector: 'ion-toggle',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['alignment', 'checked', 'color', 'disabled', 'enableOnOffLabels', 'errorText', 'helperText', 'justify', 'labelPlacement', 'mode', 'name', 'required', 'value'],
        outputs: ['ionChange', 'ionFocus', 'ionBlur'],
        standalone: false
    })
], IonToggle);
export { IonToggle };
let IonToolbar = class IonToolbar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonToolbar = __decorate([
    ProxyCmp({
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-toolbar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
        standalone: false
    })
], IonToolbar);
export { IonToolbar };
