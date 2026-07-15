import { __decorate } from "tslib";
/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ProxyCmp } from './angular-component-lib/utils';
import { defineCustomElement as defineIonAccordion } from '@ionic/core/components/ion-accordion.js';
import { defineCustomElement as defineIonAccordionGroup } from '@ionic/core/components/ion-accordion-group.js';
import { defineCustomElement as defineIonActionSheet } from '@ionic/core/components/ion-action-sheet.js';
import { defineCustomElement as defineIonAlert } from '@ionic/core/components/ion-alert.js';
import { defineCustomElement as defineIonApp } from '@ionic/core/components/ion-app.js';
import { defineCustomElement as defineIonAvatar } from '@ionic/core/components/ion-avatar.js';
import { defineCustomElement as defineIonBackdrop } from '@ionic/core/components/ion-backdrop.js';
import { defineCustomElement as defineIonBadge } from '@ionic/core/components/ion-badge.js';
import { defineCustomElement as defineIonBreadcrumb } from '@ionic/core/components/ion-breadcrumb.js';
import { defineCustomElement as defineIonBreadcrumbs } from '@ionic/core/components/ion-breadcrumbs.js';
import { defineCustomElement as defineIonButton } from '@ionic/core/components/ion-button.js';
import { defineCustomElement as defineIonButtons } from '@ionic/core/components/ion-buttons.js';
import { defineCustomElement as defineIonCard } from '@ionic/core/components/ion-card.js';
import { defineCustomElement as defineIonCardContent } from '@ionic/core/components/ion-card-content.js';
import { defineCustomElement as defineIonCardHeader } from '@ionic/core/components/ion-card-header.js';
import { defineCustomElement as defineIonCardSubtitle } from '@ionic/core/components/ion-card-subtitle.js';
import { defineCustomElement as defineIonCardTitle } from '@ionic/core/components/ion-card-title.js';
import { defineCustomElement as defineIonChip } from '@ionic/core/components/ion-chip.js';
import { defineCustomElement as defineIonCol } from '@ionic/core/components/ion-col.js';
import { defineCustomElement as defineIonContent } from '@ionic/core/components/ion-content.js';
import { defineCustomElement as defineIonDatetimeButton } from '@ionic/core/components/ion-datetime-button.js';
import { defineCustomElement as defineIonFab } from '@ionic/core/components/ion-fab.js';
import { defineCustomElement as defineIonFabButton } from '@ionic/core/components/ion-fab-button.js';
import { defineCustomElement as defineIonFabList } from '@ionic/core/components/ion-fab-list.js';
import { defineCustomElement as defineIonFooter } from '@ionic/core/components/ion-footer.js';
import { defineCustomElement as defineIonGrid } from '@ionic/core/components/ion-grid.js';
import { defineCustomElement as defineIonHeader } from '@ionic/core/components/ion-header.js';
import { defineCustomElement as defineIonImg } from '@ionic/core/components/ion-img.js';
import { defineCustomElement as defineIonInfiniteScroll } from '@ionic/core/components/ion-infinite-scroll.js';
import { defineCustomElement as defineIonInfiniteScrollContent } from '@ionic/core/components/ion-infinite-scroll-content.js';
import { defineCustomElement as defineIonInputPasswordToggle } from '@ionic/core/components/ion-input-password-toggle.js';
import { defineCustomElement as defineIonItem } from '@ionic/core/components/ion-item.js';
import { defineCustomElement as defineIonItemDivider } from '@ionic/core/components/ion-item-divider.js';
import { defineCustomElement as defineIonItemGroup } from '@ionic/core/components/ion-item-group.js';
import { defineCustomElement as defineIonItemOption } from '@ionic/core/components/ion-item-option.js';
import { defineCustomElement as defineIonItemOptions } from '@ionic/core/components/ion-item-options.js';
import { defineCustomElement as defineIonItemSliding } from '@ionic/core/components/ion-item-sliding.js';
import { defineCustomElement as defineIonLabel } from '@ionic/core/components/ion-label.js';
import { defineCustomElement as defineIonList } from '@ionic/core/components/ion-list.js';
import { defineCustomElement as defineIonListHeader } from '@ionic/core/components/ion-list-header.js';
import { defineCustomElement as defineIonLoading } from '@ionic/core/components/ion-loading.js';
import { defineCustomElement as defineIonMenu } from '@ionic/core/components/ion-menu.js';
import { defineCustomElement as defineIonMenuButton } from '@ionic/core/components/ion-menu-button.js';
import { defineCustomElement as defineIonMenuToggle } from '@ionic/core/components/ion-menu-toggle.js';
import { defineCustomElement as defineIonNavLink } from '@ionic/core/components/ion-nav-link.js';
import { defineCustomElement as defineIonNote } from '@ionic/core/components/ion-note.js';
import { defineCustomElement as defineIonPicker } from '@ionic/core/components/ion-picker.js';
import { defineCustomElement as defineIonPickerColumn } from '@ionic/core/components/ion-picker-column.js';
import { defineCustomElement as defineIonPickerColumnOption } from '@ionic/core/components/ion-picker-column-option.js';
import { defineCustomElement as defineIonProgressBar } from '@ionic/core/components/ion-progress-bar.js';
import { defineCustomElement as defineIonRadio } from '@ionic/core/components/ion-radio.js';
import { defineCustomElement as defineIonRefresher } from '@ionic/core/components/ion-refresher.js';
import { defineCustomElement as defineIonRefresherContent } from '@ionic/core/components/ion-refresher-content.js';
import { defineCustomElement as defineIonReorder } from '@ionic/core/components/ion-reorder.js';
import { defineCustomElement as defineIonReorderGroup } from '@ionic/core/components/ion-reorder-group.js';
import { defineCustomElement as defineIonRippleEffect } from '@ionic/core/components/ion-ripple-effect.js';
import { defineCustomElement as defineIonRow } from '@ionic/core/components/ion-row.js';
import { defineCustomElement as defineIonSegmentButton } from '@ionic/core/components/ion-segment-button.js';
import { defineCustomElement as defineIonSegmentContent } from '@ionic/core/components/ion-segment-content.js';
import { defineCustomElement as defineIonSegmentView } from '@ionic/core/components/ion-segment-view.js';
import { defineCustomElement as defineIonSelectModal } from '@ionic/core/components/ion-select-modal.js';
import { defineCustomElement as defineIonSelectOption } from '@ionic/core/components/ion-select-option.js';
import { defineCustomElement as defineIonSkeletonText } from '@ionic/core/components/ion-skeleton-text.js';
import { defineCustomElement as defineIonSpinner } from '@ionic/core/components/ion-spinner.js';
import { defineCustomElement as defineIonSplitPane } from '@ionic/core/components/ion-split-pane.js';
import { defineCustomElement as defineIonTab } from '@ionic/core/components/ion-tab.js';
import { defineCustomElement as defineIonTabBar } from '@ionic/core/components/ion-tab-bar.js';
import { defineCustomElement as defineIonTabButton } from '@ionic/core/components/ion-tab-button.js';
import { defineCustomElement as defineIonText } from '@ionic/core/components/ion-text.js';
import { defineCustomElement as defineIonThumbnail } from '@ionic/core/components/ion-thumbnail.js';
import { defineCustomElement as defineIonTitle } from '@ionic/core/components/ion-title.js';
import { defineCustomElement as defineIonToast } from '@ionic/core/components/ion-toast.js';
import { defineCustomElement as defineIonToolbar } from '@ionic/core/components/ion-toolbar.js';
let IonAccordion = class IonAccordion {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonAccordion = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineIonAccordion,
        inputs: ['disabled', 'mode', 'readonly', 'toggleIcon', 'toggleIconSlot', 'value']
    }),
    Component({
        selector: 'ion-accordion',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['disabled', 'mode', 'readonly', 'toggleIcon', 'toggleIconSlot', 'value'],
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
        defineCustomElementFn: defineIonAccordionGroup,
        inputs: ['animated', 'disabled', 'expand', 'mode', 'multiple', 'readonly', 'value']
    }),
    Component({
        selector: 'ion-accordion-group',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated', 'disabled', 'expand', 'mode', 'multiple', 'readonly', 'value'],
        outputs: ['ionChange'],
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
        defineCustomElementFn: defineIonActionSheet,
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
        defineCustomElementFn: defineIonAlert,
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
        defineCustomElementFn: defineIonApp,
        methods: ['setFocus']
    }),
    Component({
        selector: 'ion-app',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
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
    ProxyCmp({
        defineCustomElementFn: defineIonAvatar
    }),
    Component({
        selector: 'ion-avatar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
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
        defineCustomElementFn: defineIonBackdrop,
        inputs: ['stopPropagation', 'tappable', 'visible']
    }),
    Component({
        selector: 'ion-backdrop',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['stopPropagation', 'tappable', 'visible'],
        outputs: ['ionBackdropTap'],
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
        defineCustomElementFn: defineIonBadge,
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-badge',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
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
        defineCustomElementFn: defineIonBreadcrumb,
        inputs: ['active', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'separator', 'target']
    }),
    Component({
        selector: 'ion-breadcrumb',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['active', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'separator', 'target'],
        outputs: ['ionFocus', 'ionBlur'],
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
        defineCustomElementFn: defineIonBreadcrumbs,
        inputs: ['color', 'itemsAfterCollapse', 'itemsBeforeCollapse', 'maxItems', 'mode']
    }),
    Component({
        selector: 'ion-breadcrumbs',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'itemsAfterCollapse', 'itemsBeforeCollapse', 'maxItems', 'mode'],
        outputs: ['ionCollapsedClick'],
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
        defineCustomElementFn: defineIonButton,
        inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'form', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'size', 'strong', 'target', 'type']
    }),
    Component({
        selector: 'ion-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'form', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'size', 'strong', 'target', 'type'],
        outputs: ['ionFocus', 'ionBlur'],
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
        defineCustomElementFn: defineIonButtons,
        inputs: ['collapse']
    }),
    Component({
        selector: 'ion-buttons',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['collapse'],
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
        defineCustomElementFn: defineIonCard,
        inputs: ['button', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type']
    }),
    Component({
        selector: 'ion-card',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['button', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type'],
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
        defineCustomElementFn: defineIonCardContent,
        inputs: ['mode']
    }),
    Component({
        selector: 'ion-card-content',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['mode'],
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
        defineCustomElementFn: defineIonCardHeader,
        inputs: ['color', 'mode', 'translucent']
    }),
    Component({
        selector: 'ion-card-header',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode', 'translucent'],
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
        defineCustomElementFn: defineIonCardSubtitle,
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-card-subtitle',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
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
        defineCustomElementFn: defineIonCardTitle,
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-card-title',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
    })
], IonCardTitle);
export { IonCardTitle };
let IonChip = class IonChip {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonChip = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineIonChip,
        inputs: ['color', 'disabled', 'mode', 'outline']
    }),
    Component({
        selector: 'ion-chip',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'disabled', 'mode', 'outline'],
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
        defineCustomElementFn: defineIonCol,
        inputs: ['offset', 'offsetLg', 'offsetMd', 'offsetSm', 'offsetXl', 'offsetXs', 'pull', 'pullLg', 'pullMd', 'pullSm', 'pullXl', 'pullXs', 'push', 'pushLg', 'pushMd', 'pushSm', 'pushXl', 'pushXs', 'size', 'sizeLg', 'sizeMd', 'sizeSm', 'sizeXl', 'sizeXs']
    }),
    Component({
        selector: 'ion-col',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['offset', 'offsetLg', 'offsetMd', 'offsetSm', 'offsetXl', 'offsetXs', 'pull', 'pullLg', 'pullMd', 'pullSm', 'pullXl', 'pullXs', 'push', 'pushLg', 'pushMd', 'pushSm', 'pushXl', 'pushXs', 'size', 'sizeLg', 'sizeMd', 'sizeSm', 'sizeXl', 'sizeXs'],
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
        defineCustomElementFn: defineIonContent,
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
    })
], IonContent);
export { IonContent };
let IonDatetimeButton = class IonDatetimeButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonDatetimeButton = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineIonDatetimeButton,
        inputs: ['color', 'datetime', 'disabled', 'mode']
    }),
    Component({
        selector: 'ion-datetime-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'datetime', 'disabled', 'mode'],
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
        defineCustomElementFn: defineIonFab,
        inputs: ['activated', 'edge', 'horizontal', 'vertical'],
        methods: ['close']
    }),
    Component({
        selector: 'ion-fab',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['activated', 'edge', 'horizontal', 'vertical'],
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
        defineCustomElementFn: defineIonFabButton,
        inputs: ['activated', 'closeIcon', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'show', 'size', 'target', 'translucent', 'type']
    }),
    Component({
        selector: 'ion-fab-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['activated', 'closeIcon', 'color', 'disabled', 'download', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'show', 'size', 'target', 'translucent', 'type'],
        outputs: ['ionFocus', 'ionBlur'],
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
        defineCustomElementFn: defineIonFabList,
        inputs: ['activated', 'side']
    }),
    Component({
        selector: 'ion-fab-list',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['activated', 'side'],
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
        defineCustomElementFn: defineIonFooter,
        inputs: ['collapse', 'mode', 'translucent']
    }),
    Component({
        selector: 'ion-footer',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['collapse', 'mode', 'translucent'],
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
        defineCustomElementFn: defineIonGrid,
        inputs: ['fixed']
    }),
    Component({
        selector: 'ion-grid',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['fixed'],
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
        defineCustomElementFn: defineIonHeader,
        inputs: ['collapse', 'mode', 'translucent']
    }),
    Component({
        selector: 'ion-header',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['collapse', 'mode', 'translucent'],
    })
], IonHeader);
export { IonHeader };
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
        defineCustomElementFn: defineIonImg,
        inputs: ['alt', 'src']
    }),
    Component({
        selector: 'ion-img',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['alt', 'src'],
        outputs: ['ionImgWillLoad', 'ionImgDidLoad', 'ionError'],
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
        defineCustomElementFn: defineIonInfiniteScroll,
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
        defineCustomElementFn: defineIonInfiniteScrollContent,
        inputs: ['loadingSpinner', 'loadingText']
    }),
    Component({
        selector: 'ion-infinite-scroll-content',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['loadingSpinner', 'loadingText'],
    })
], IonInfiniteScrollContent);
export { IonInfiniteScrollContent };
let IonInputPasswordToggle = class IonInputPasswordToggle {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonInputPasswordToggle = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineIonInputPasswordToggle,
        inputs: ['color', 'hideIcon', 'mode', 'showIcon']
    }),
    Component({
        selector: 'ion-input-password-toggle',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'hideIcon', 'mode', 'showIcon'],
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
        defineCustomElementFn: defineIonItem,
        inputs: ['button', 'color', 'detail', 'detailIcon', 'disabled', 'download', 'href', 'lines', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type']
    }),
    Component({
        selector: 'ion-item',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['button', 'color', 'detail', 'detailIcon', 'disabled', 'download', 'href', 'lines', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'target', 'type'],
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
        defineCustomElementFn: defineIonItemDivider,
        inputs: ['color', 'mode', 'sticky']
    }),
    Component({
        selector: 'ion-item-divider',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode', 'sticky'],
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
    ProxyCmp({
        defineCustomElementFn: defineIonItemGroup
    }),
    Component({
        selector: 'ion-item-group',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
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
        defineCustomElementFn: defineIonItemOption,
        inputs: ['color', 'disabled', 'download', 'expandable', 'href', 'mode', 'rel', 'target', 'type']
    }),
    Component({
        selector: 'ion-item-option',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'disabled', 'download', 'expandable', 'href', 'mode', 'rel', 'target', 'type'],
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
        defineCustomElementFn: defineIonItemOptions,
        inputs: ['side']
    }),
    Component({
        selector: 'ion-item-options',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['side'],
        outputs: ['ionSwipe'],
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
        defineCustomElementFn: defineIonItemSliding,
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
        defineCustomElementFn: defineIonLabel,
        inputs: ['color', 'mode', 'position']
    }),
    Component({
        selector: 'ion-label',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode', 'position'],
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
        defineCustomElementFn: defineIonList,
        inputs: ['inset', 'lines', 'mode'],
        methods: ['closeSlidingItems']
    }),
    Component({
        selector: 'ion-list',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['inset', 'lines', 'mode'],
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
        defineCustomElementFn: defineIonListHeader,
        inputs: ['color', 'lines', 'mode']
    }),
    Component({
        selector: 'ion-list-header',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'lines', 'mode'],
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
        defineCustomElementFn: defineIonLoading,
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
        defineCustomElementFn: defineIonMenu,
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
        defineCustomElementFn: defineIonMenuButton,
        inputs: ['autoHide', 'color', 'disabled', 'menu', 'mode', 'type']
    }),
    Component({
        selector: 'ion-menu-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['autoHide', 'color', 'disabled', 'menu', 'mode', 'type'],
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
        defineCustomElementFn: defineIonMenuToggle,
        inputs: ['autoHide', 'menu']
    }),
    Component({
        selector: 'ion-menu-toggle',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['autoHide', 'menu'],
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
        defineCustomElementFn: defineIonNavLink,
        inputs: ['component', 'componentProps', 'routerAnimation', 'routerDirection']
    }),
    Component({
        selector: 'ion-nav-link',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['component', 'componentProps', 'routerAnimation', 'routerDirection'],
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
        defineCustomElementFn: defineIonNote,
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-note',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
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
        defineCustomElementFn: defineIonPicker,
        inputs: ['mode']
    }),
    Component({
        selector: 'ion-picker',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['mode'],
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
        defineCustomElementFn: defineIonPickerColumn,
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
        defineCustomElementFn: defineIonPickerColumnOption,
        inputs: ['color', 'disabled', 'value']
    }),
    Component({
        selector: 'ion-picker-column-option',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'disabled', 'value'],
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
        defineCustomElementFn: defineIonProgressBar,
        inputs: ['buffer', 'color', 'mode', 'reversed', 'type', 'value']
    }),
    Component({
        selector: 'ion-progress-bar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['buffer', 'color', 'mode', 'reversed', 'type', 'value'],
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
        defineCustomElementFn: defineIonRadio,
        inputs: ['alignment', 'color', 'disabled', 'justify', 'labelPlacement', 'mode', 'name', 'value']
    }),
    Component({
        selector: 'ion-radio',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['alignment', 'color', 'disabled', 'justify', 'labelPlacement', 'mode', 'name', 'value'],
        outputs: ['ionFocus', 'ionBlur'],
    })
], IonRadio);
export { IonRadio };
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
        defineCustomElementFn: defineIonRefresher,
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
        defineCustomElementFn: defineIonRefresherContent,
        inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']
    }),
    Component({
        selector: 'ion-refresher-content',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText'],
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
    ProxyCmp({
        defineCustomElementFn: defineIonReorder
    }),
    Component({
        selector: 'ion-reorder',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
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
        defineCustomElementFn: defineIonReorderGroup,
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
        defineCustomElementFn: defineIonRippleEffect,
        inputs: ['type'],
        methods: ['addRipple']
    }),
    Component({
        selector: 'ion-ripple-effect',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['type'],
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
    ProxyCmp({
        defineCustomElementFn: defineIonRow
    }),
    Component({
        selector: 'ion-row',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
    })
], IonRow);
export { IonRow };
let IonSegmentButton = class IonSegmentButton {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSegmentButton = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineIonSegmentButton,
        inputs: ['contentId', 'disabled', 'layout', 'mode', 'type', 'value']
    }),
    Component({
        selector: 'ion-segment-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['contentId', 'disabled', 'layout', 'mode', 'type', 'value'],
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
    ProxyCmp({
        defineCustomElementFn: defineIonSegmentContent
    }),
    Component({
        selector: 'ion-segment-content',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
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
        defineCustomElementFn: defineIonSegmentView,
        inputs: ['disabled', 'swipeGesture']
    }),
    Component({
        selector: 'ion-segment-view',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['disabled', 'swipeGesture'],
        outputs: ['ionSegmentViewScroll'],
    })
], IonSegmentView);
export { IonSegmentView };
let IonSelectModal = class IonSelectModal {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonSelectModal = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineIonSelectModal,
        inputs: ['cancelText', 'header', 'multiple', 'options']
    }),
    Component({
        selector: 'ion-select-modal',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['cancelText', 'header', 'multiple', 'options'],
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
        defineCustomElementFn: defineIonSelectOption,
        inputs: ['description', 'disabled', 'justify', 'labelPlacement', 'mode', 'value']
    }),
    Component({
        selector: 'ion-select-option',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['description', 'disabled', 'justify', 'labelPlacement', 'mode', 'value'],
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
        defineCustomElementFn: defineIonSkeletonText,
        inputs: ['animated']
    }),
    Component({
        selector: 'ion-skeleton-text',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['animated'],
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
        defineCustomElementFn: defineIonSpinner,
        inputs: ['color', 'duration', 'name', 'paused']
    }),
    Component({
        selector: 'ion-spinner',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'duration', 'name', 'paused'],
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
        defineCustomElementFn: defineIonSplitPane,
        inputs: ['contentId', 'disabled', 'when']
    }),
    Component({
        selector: 'ion-split-pane',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['contentId', 'disabled', 'when'],
        outputs: ['ionSplitPaneVisible'],
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
        defineCustomElementFn: defineIonTab,
        inputs: ['component', 'tab'],
        methods: ['setActive']
    }),
    Component({
        selector: 'ion-tab',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['component', { name: 'tab', required: true }],
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
        defineCustomElementFn: defineIonTabBar,
        inputs: ['color', 'mode', 'selectedTab', 'translucent']
    }),
    Component({
        selector: 'ion-tab-bar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode', 'selectedTab', 'translucent'],
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
        defineCustomElementFn: defineIonTabButton,
        inputs: ['disabled', 'download', 'href', 'layout', 'mode', 'rel', 'selected', 'tab', 'target']
    }),
    Component({
        selector: 'ion-tab-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['disabled', 'download', 'href', 'layout', 'mode', 'rel', 'selected', 'tab', 'target'],
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
        defineCustomElementFn: defineIonText,
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-text',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
    })
], IonText);
export { IonText };
let IonThumbnail = class IonThumbnail {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonThumbnail = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineIonThumbnail
    }),
    Component({
        selector: 'ion-thumbnail',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: [],
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
        defineCustomElementFn: defineIonTitle,
        inputs: ['color', 'size']
    }),
    Component({
        selector: 'ion-title',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'size'],
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
        defineCustomElementFn: defineIonToast,
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
    })
], IonToast);
export { IonToast };
let IonToolbar = class IonToolbar {
    constructor(c, r, z) {
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
    }
};
IonToolbar = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineIonToolbar,
        inputs: ['color', 'mode']
    }),
    Component({
        selector: 'ion-toolbar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: ['color', 'mode'],
    })
], IonToolbar);
export { IonToolbar };
