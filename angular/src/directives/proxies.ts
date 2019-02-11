/* tslint:disable */
/* auto-generated angular directive proxies */
import { Component, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { proxyInputs, proxyMethods, proxyOutputs } from './proxies-utils';

type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];

export declare interface IonApp extends StencilComponents<'IonApp'> {}
@Component({ selector: 'ion-app', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonApp {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonAvatar extends StencilComponents<'IonAvatar'> {}
@Component({ selector: 'ion-avatar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir'] })
export class IonAvatar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonAvatar, ['dir']);

export declare interface IonBackButton extends StencilComponents<'IonBackButton'> {}
@Component({ selector: 'ion-back-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'defaultHref', 'icon', 'text'] })
export class IonBackButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonBackButton, ['color', 'dir', 'mode', 'defaultHref', 'icon', 'text']);

export declare interface IonBackdrop extends StencilComponents<'IonBackdrop'> {}
@Component({ selector: 'ion-backdrop', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['visible', 'tappable', 'stopPropagation'] })
export class IonBackdrop {
  ionBackdropTap!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionBackdropTap']);
  }
}
proxyInputs(IonBackdrop, ['visible', 'tappable', 'stopPropagation']);

export declare interface IonBadge extends StencilComponents<'IonBadge'> {}
@Component({ selector: 'ion-badge', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode'] })
export class IonBadge {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonBadge, ['color', 'dir', 'mode']);

export declare interface IonButton extends StencilComponents<'IonButton'> {}
@Component({ selector: 'ion-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type'] })
export class IonButton {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonButton, ['color', 'dir', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type']);

export declare interface IonButtons extends StencilComponents<'IonButtons'> {}
@Component({ selector: 'ion-buttons', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir'] })
export class IonButtons {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonButtons, ['dir']);

export declare interface IonCard extends StencilComponents<'IonCard'> {}
@Component({ selector: 'ion-card', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode'] })
export class IonCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCard, ['color', 'dir', 'mode']);

export declare interface IonCardContent extends StencilComponents<'IonCardContent'> {}
@Component({ selector: 'ion-card-content', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'mode'] })
export class IonCardContent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCardContent, ['dir', 'mode']);

export declare interface IonCardHeader extends StencilComponents<'IonCardHeader'> {}
@Component({ selector: 'ion-card-header', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'translucent'] })
export class IonCardHeader {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCardHeader, ['color', 'dir', 'mode', 'translucent']);

export declare interface IonCardSubtitle extends StencilComponents<'IonCardSubtitle'> {}
@Component({ selector: 'ion-card-subtitle', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode'] })
export class IonCardSubtitle {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCardSubtitle, ['color', 'dir', 'mode']);

export declare interface IonCardTitle extends StencilComponents<'IonCardTitle'> {}
@Component({ selector: 'ion-card-title', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode'] })
export class IonCardTitle {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCardTitle, ['color', 'dir', 'mode']);

export declare interface IonCheckbox extends StencilComponents<'IonCheckbox'> {}
@Component({ selector: 'ion-checkbox', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'name', 'checked', 'disabled', 'value'] })
export class IonCheckbox {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonCheckbox, ['color', 'dir', 'mode', 'name', 'checked', 'disabled', 'value']);

export declare interface IonChip extends StencilComponents<'IonChip'> {}
@Component({ selector: 'ion-chip', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'outline'] })
export class IonChip {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonChip, ['color', 'dir', 'mode', 'outline']);

export declare interface IonCol extends StencilComponents<'IonCol'> {}
@Component({ selector: 'ion-col', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl'] })
export class IonCol {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCol, ['dir', 'offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl']);

export declare interface IonContent extends StencilComponents<'IonContent'> {}
@Component({ selector: 'ion-content', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'fullscreen', 'forceOverscroll', 'scrollX', 'scrollY', 'scrollEvents'] })
export class IonContent {
  ionScrollStart!: EventEmitter<CustomEvent>;
  ionScroll!: EventEmitter<CustomEvent>;
  ionScrollEnd!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionScrollStart', 'ionScroll', 'ionScrollEnd']);
  }
}
proxyMethods(IonContent, ['getScrollElement', 'scrollToTop', 'scrollToBottom', 'scrollByPoint', 'scrollToPoint']);
proxyInputs(IonContent, ['color', 'dir', 'fullscreen', 'forceOverscroll', 'scrollX', 'scrollY', 'scrollEvents']);

export declare interface IonDatetime extends StencilComponents<'IonDatetime'> {}
@Component({ selector: 'ion-datetime', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'name', 'dir', 'disabled', 'readonly', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value'] })
export class IonDatetime {
  ionCancel!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionCancel', 'ionChange', 'ionFocus', 'ionBlur']);
  }
}
proxyMethods(IonDatetime, ['open']);
proxyInputs(IonDatetime, ['mode', 'name', 'dir', 'disabled', 'readonly', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value']);

export declare interface IonFab extends StencilComponents<'IonFab'> {}
@Component({ selector: 'ion-fab', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['horizontal', 'vertical', 'dir', 'edge', 'activated'] })
export class IonFab {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyMethods(IonFab, ['close']);
proxyInputs(IonFab, ['horizontal', 'vertical', 'dir', 'edge', 'activated']);

export declare interface IonFabButton extends StencilComponents<'IonFabButton'> {}
@Component({ selector: 'ion-fab-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type', 'size'] })
export class IonFabButton {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonFabButton, ['color', 'dir', 'mode', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type', 'size']);

export declare interface IonFabList extends StencilComponents<'IonFabList'> {}
@Component({ selector: 'ion-fab-list', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['activated', 'dir', 'side'] })
export class IonFabList {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonFabList, ['activated', 'dir', 'side']);

export declare interface IonFooter extends StencilComponents<'IonFooter'> {}
@Component({ selector: 'ion-footer', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class IonFooter {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonFooter, ['mode', 'translucent']);

export declare interface IonGrid extends StencilComponents<'IonGrid'> {}
@Component({ selector: 'ion-grid', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'fixed'] })
export class IonGrid {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonGrid, ['dir', 'fixed']);

export declare interface IonHeader extends StencilComponents<'IonHeader'> {}
@Component({ selector: 'ion-header', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class IonHeader {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonHeader, ['mode', 'translucent']);

export declare interface IonIcon extends StencilComponents<'IonIcon'> {}
@Component({ selector: 'ion-icon', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['ariaLabel', 'color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src'] })
export class IonIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonIcon, ['ariaLabel', 'color', 'flipRtl', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src']);

export declare interface IonImg extends StencilComponents<'IonImg'> {}
@Component({ selector: 'ion-img', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['alt', 'dir', 'src'] })
export class IonImg {
  ionImgDidLoad!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionImgDidLoad']);
  }
}
proxyInputs(IonImg, ['alt', 'dir', 'src']);

export declare interface IonInfiniteScroll extends StencilComponents<'IonInfiniteScroll'> {}
@Component({ selector: 'ion-infinite-scroll', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'threshold', 'disabled', 'position'] })
export class IonInfiniteScroll {
  ionInfinite!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionInfinite']);
  }
}
proxyMethods(IonInfiniteScroll, ['complete']);
proxyInputs(IonInfiniteScroll, ['dir', 'threshold', 'disabled', 'position']);

export declare interface IonInfiniteScrollContent extends StencilComponents<'IonInfiniteScrollContent'> {}
@Component({ selector: 'ion-infinite-scroll-content', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'loadingSpinner', 'loadingText'] })
export class IonInfiniteScrollContent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonInfiniteScrollContent, ['dir', 'loadingSpinner', 'loadingText']);

export declare interface IonInput extends StencilComponents<'IonInput'> {}
@Component({ selector: 'ion-input', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'spellcheck', 'step', 'size', 'type', 'value'] })
export class IonInput {
  ionInput!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionBlur', 'ionFocus']);
  }
}
proxyMethods(IonInput, ['setFocus', 'getInputElement']);
proxyInputs(IonInput, ['color', 'dir', 'mode', 'accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'spellcheck', 'step', 'size', 'type', 'value']);

export declare interface IonItem extends StencilComponents<'IonItem'> {}
@Component({ selector: 'ion-item', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type'] })
export class IonItem {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonItem, ['color', 'dir', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type']);

export declare interface IonItemDivider extends StencilComponents<'IonItemDivider'> {}
@Component({ selector: 'ion-item-divider', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'sticky'] })
export class IonItemDivider {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonItemDivider, ['color', 'dir', 'mode', 'sticky']);

export declare interface IonItemGroup extends StencilComponents<'IonItemGroup'> {}
@Component({ selector: 'ion-item-group', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonItemGroup {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonItemOption extends StencilComponents<'IonItemOption'> {}
@Component({ selector: 'ion-item-option', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'disabled', 'expandable', 'href'] })
export class IonItemOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonItemOption, ['color', 'dir', 'mode', 'disabled', 'expandable', 'href']);

export declare interface IonItemOptions extends StencilComponents<'IonItemOptions'> {}
@Component({ selector: 'ion-item-options', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'side'] })
export class IonItemOptions {
  ionSwipe!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionSwipe']);
  }
}
proxyInputs(IonItemOptions, ['dir', 'side']);

export declare interface IonItemSliding extends StencilComponents<'IonItemSliding'> {}
@Component({ selector: 'ion-item-sliding', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'disabled'] })
export class IonItemSliding {
  ionDrag!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionDrag']);
  }
}
proxyMethods(IonItemSliding, ['getOpenAmount', 'getSlidingRatio', 'close', 'closeOpened']);
proxyInputs(IonItemSliding, ['dir', 'disabled']);

export declare interface IonLabel extends StencilComponents<'IonLabel'> {}
@Component({ selector: 'ion-label', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'position'] })
export class IonLabel {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonLabel, ['color', 'dir', 'mode', 'position']);

export declare interface IonList extends StencilComponents<'IonList'> {}
@Component({ selector: 'ion-list', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'mode', 'lines', 'inset'] })
export class IonList {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyMethods(IonList, ['closeSlidingItems']);
proxyInputs(IonList, ['dir', 'mode', 'lines', 'inset']);

export declare interface IonListHeader extends StencilComponents<'IonListHeader'> {}
@Component({ selector: 'ion-list-header', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode'] })
export class IonListHeader {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonListHeader, ['color', 'dir', 'mode']);

export declare interface IonMenu extends StencilComponents<'IonMenu'> {}
@Component({ selector: 'ion-menu', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['contentId', 'dir', 'menuId', 'type', 'disabled', 'side', 'swipeGesture', 'maxEdgeStart'] })
export class IonMenu {
  ionWillOpen!: EventEmitter<CustomEvent>;
  ionWillClose!: EventEmitter<CustomEvent>;
  ionDidOpen!: EventEmitter<CustomEvent>;
  ionDidClose!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionWillOpen', 'ionWillClose', 'ionDidOpen', 'ionDidClose']);
  }
}
proxyMethods(IonMenu, ['isOpen', 'isActive', 'open', 'close', 'toggle', 'setOpen']);
proxyInputs(IonMenu, ['contentId', 'dir', 'menuId', 'type', 'disabled', 'side', 'swipeGesture', 'maxEdgeStart']);

export declare interface IonMenuButton extends StencilComponents<'IonMenuButton'> {}
@Component({ selector: 'ion-menu-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'menu', 'autoHide'] })
export class IonMenuButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonMenuButton, ['color', 'dir', 'mode', 'menu', 'autoHide']);

export declare interface IonMenuToggle extends StencilComponents<'IonMenuToggle'> {}
@Component({ selector: 'ion-menu-toggle', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['menu', 'autoHide'] })
export class IonMenuToggle {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonMenuToggle, ['menu', 'autoHide']);

export declare interface IonNav extends StencilComponents<'IonNav'> {}
@Component({ selector: 'ion-nav', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['swipeGesture', 'animated', 'animation', 'rootParams', 'root'] })
export class IonNav {
  ionNavWillChange!: EventEmitter<CustomEvent>;
  ionNavDidChange!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionNavWillChange', 'ionNavDidChange']);
  }
}
proxyMethods(IonNav, ['push', 'insert', 'insertPages', 'pop', 'popTo', 'popToRoot', 'removeIndex', 'setRoot', 'setPages', 'getActive', 'getByIndex', 'canGoBack', 'getPrevious']);
proxyInputs(IonNav, ['swipeGesture', 'animated', 'animation', 'rootParams', 'root']);

export declare interface IonNavPop extends StencilComponents<'IonNavPop'> {}
@Component({ selector: 'ion-nav-pop', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonNavPop {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonNavPush extends StencilComponents<'IonNavPush'> {}
@Component({ selector: 'ion-nav-push', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class IonNavPush {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonNavPush, ['component', 'componentProps']);

export declare interface IonNavSetRoot extends StencilComponents<'IonNavSetRoot'> {}
@Component({ selector: 'ion-nav-set-root', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class IonNavSetRoot {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonNavSetRoot, ['component', 'componentProps']);

export declare interface IonNote extends StencilComponents<'IonNote'> {}
@Component({ selector: 'ion-note', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode'] })
export class IonNote {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonNote, ['color', 'dir', 'mode']);

export declare interface IonProgressBar extends StencilComponents<'IonProgressBar'> {}
@Component({ selector: 'ion-progress-bar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'mode', 'type', 'reversed', 'value', 'buffer', 'color'] })
export class IonProgressBar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonProgressBar, ['dir', 'mode', 'type', 'reversed', 'value', 'buffer', 'color']);

export declare interface IonRadio extends StencilComponents<'IonRadio'> {}
@Component({ selector: 'ion-radio', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'name', 'disabled', 'checked', 'value'] })
export class IonRadio {
  ionSelect!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionSelect', 'ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonRadio, ['color', 'dir', 'mode', 'name', 'disabled', 'checked', 'value']);

export declare interface IonRadioGroup extends StencilComponents<'IonRadioGroup'> {}
@Component({ selector: 'ion-radio-group', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['allowEmptySelection', 'dir', 'name', 'value'] })
export class IonRadioGroup {
  ionChange!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange']);
  }
}
proxyInputs(IonRadioGroup, ['allowEmptySelection', 'dir', 'name', 'value']);

export declare interface IonRange extends StencilComponents<'IonRange'> {}
@Component({ selector: 'ion-range', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value'] })
export class IonRange {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonRange, ['color', 'dir', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value']);

export declare interface IonRefresher extends StencilComponents<'IonRefresher'> {}
@Component({ selector: 'ion-refresher', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled'] })
export class IonRefresher {
  ionRefresh!: EventEmitter<CustomEvent>;
  ionPull!: EventEmitter<CustomEvent>;
  ionStart!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionRefresh', 'ionPull', 'ionStart']);
  }
}
proxyMethods(IonRefresher, ['complete', 'cancel', 'getProgress']);
proxyInputs(IonRefresher, ['dir', 'pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled']);

export declare interface IonRefresherContent extends StencilComponents<'IonRefresherContent'> {}
@Component({ selector: 'ion-refresher-content', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText'] })
export class IonRefresherContent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonRefresherContent, ['dir', 'pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']);

export declare interface IonReorder extends StencilComponents<'IonReorder'> {}
@Component({ selector: 'ion-reorder', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir'] })
export class IonReorder {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonReorder, ['dir']);

export declare interface IonReorderGroup extends StencilComponents<'IonReorderGroup'> {}
@Component({ selector: 'ion-reorder-group', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class IonReorderGroup {
  ionItemReorder!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionItemReorder']);
  }
}
proxyMethods(IonReorderGroup, ['complete']);
proxyInputs(IonReorderGroup, ['disabled']);

export declare interface IonRippleEffect extends StencilComponents<'IonRippleEffect'> {}
@Component({ selector: 'ion-ripple-effect', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['type'] })
export class IonRippleEffect {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyMethods(IonRippleEffect, ['addRipple']);
proxyInputs(IonRippleEffect, ['type']);

export declare interface IonRow extends StencilComponents<'IonRow'> {}
@Component({ selector: 'ion-row', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir'] })
export class IonRow {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonRow, ['dir']);

export declare interface IonSearchbar extends StencilComponents<'IonSearchbar'> {}
@Component({ selector: 'ion-searchbar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'debounce', 'placeholder', 'searchIcon', 'showCancelButton', 'spellcheck', 'type', 'value'] })
export class IonSearchbar {
  ionInput!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionClear!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus']);
  }
}
proxyMethods(IonSearchbar, ['setFocus', 'getInputElement']);
proxyInputs(IonSearchbar, ['dir', 'color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'debounce', 'placeholder', 'searchIcon', 'showCancelButton', 'spellcheck', 'type', 'value']);

export declare interface IonSegment extends StencilComponents<'IonSegment'> {}
@Component({ selector: 'ion-segment', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'disabled', 'scrollable', 'value'] })
export class IonSegment {
  ionChange!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionStyle']);
  }
}
proxyInputs(IonSegment, ['color', 'dir', 'mode', 'disabled', 'scrollable', 'value']);

export declare interface IonSegmentButton extends StencilComponents<'IonSegmentButton'> {}
@Component({ selector: 'ion-segment-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'mode', 'checked', 'disabled', 'layout', 'value'] })
export class IonSegmentButton {
  ionSelect!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionSelect']);
  }
}
proxyInputs(IonSegmentButton, ['dir', 'mode', 'checked', 'disabled', 'layout', 'value']);

export declare interface IonSelect extends StencilComponents<'IonSelect'> {}
@Component({ selector: 'ion-select', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value'] })
export class IonSelect {
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur']);
  }
}
proxyMethods(IonSelect, ['open']);
proxyInputs(IonSelect, ['dir', 'mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value']);

export declare interface IonSelectOption extends StencilComponents<'IonSelectOption'> {}
@Component({ selector: 'ion-select-option', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['disabled', 'selected', 'value'] })
export class IonSelectOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonSelectOption, ['disabled', 'selected', 'value']);

export declare interface IonSkeletonText extends StencilComponents<'IonSkeletonText'> {}
@Component({ selector: 'ion-skeleton-text', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'width'] })
export class IonSkeletonText {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonSkeletonText, ['dir', 'width']);

export declare interface IonSlide extends StencilComponents<'IonSlide'> {}
@Component({ selector: 'ion-slide', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir'] })
export class IonSlide {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonSlide, ['dir']);

export declare interface IonSlides extends StencilComponents<'IonSlides'> {}
@Component({ selector: 'ion-slides', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'mode', 'options', 'pager', 'scrollbar'] })
export class IonSlides {
  ionSlidesDidLoad!: EventEmitter<CustomEvent>;
  ionSlideTap!: EventEmitter<CustomEvent>;
  ionSlideDoubleTap!: EventEmitter<CustomEvent>;
  ionSlideWillChange!: EventEmitter<CustomEvent>;
  ionSlideDidChange!: EventEmitter<CustomEvent>;
  ionSlideNextStart!: EventEmitter<CustomEvent>;
  ionSlidePrevStart!: EventEmitter<CustomEvent>;
  ionSlideNextEnd!: EventEmitter<CustomEvent>;
  ionSlidePrevEnd!: EventEmitter<CustomEvent>;
  ionSlideTransitionStart!: EventEmitter<CustomEvent>;
  ionSlideTransitionEnd!: EventEmitter<CustomEvent>;
  ionSlideDrag!: EventEmitter<CustomEvent>;
  ionSlideReachStart!: EventEmitter<CustomEvent>;
  ionSlideReachEnd!: EventEmitter<CustomEvent>;
  ionSlideTouchStart!: EventEmitter<CustomEvent>;
  ionSlideTouchEnd!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionSlidesDidLoad', 'ionSlideTap', 'ionSlideDoubleTap', 'ionSlideWillChange', 'ionSlideDidChange', 'ionSlideNextStart', 'ionSlidePrevStart', 'ionSlideNextEnd', 'ionSlidePrevEnd', 'ionSlideTransitionStart', 'ionSlideTransitionEnd', 'ionSlideDrag', 'ionSlideReachStart', 'ionSlideReachEnd', 'ionSlideTouchStart', 'ionSlideTouchEnd']);
  }
}
proxyMethods(IonSlides, ['update', 'updateAutoHeight', 'slideTo', 'slideNext', 'slidePrev', 'getActiveIndex', 'getPreviousIndex', 'length', 'isEnd', 'isBeginning', 'startAutoplay', 'stopAutoplay', 'lockSwipeToNext', 'lockSwipeToPrev', 'lockSwipes']);
proxyInputs(IonSlides, ['dir', 'mode', 'options', 'pager', 'scrollbar']);

export declare interface IonSpinner extends StencilComponents<'IonSpinner'> {}
@Component({ selector: 'ion-spinner', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'duration', 'name', 'paused'] })
export class IonSpinner {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonSpinner, ['color', 'dir', 'duration', 'name', 'paused']);

export declare interface IonSplitPane extends StencilComponents<'IonSplitPane'> {}
@Component({ selector: 'ion-split-pane', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir', 'contentId', 'disabled', 'when'] })
export class IonSplitPane {
  ionSplitPaneVisible!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionSplitPaneVisible']);
  }
}
proxyInputs(IonSplitPane, ['dir', 'contentId', 'disabled', 'when']);

export declare interface IonTabBar extends StencilComponents<'IonTabBar'> {}
@Component({ selector: 'ion-tab-bar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'dir', 'color', 'selectedTab', 'translucent'] })
export class IonTabBar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonTabBar, ['mode', 'dir', 'color', 'selectedTab', 'translucent']);

export declare interface IonTabButton extends StencilComponents<'IonTabButton'> {}
@Component({ selector: 'ion-tab-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['selected', 'dir', 'mode', 'layout', 'href', 'tab', 'disabled'] })
export class IonTabButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonTabButton, ['selected', 'dir', 'mode', 'layout', 'href', 'tab', 'disabled']);

export declare interface IonText extends StencilComponents<'IonText'> {}
@Component({ selector: 'ion-text', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode'] })
export class IonText {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonText, ['color', 'dir', 'mode']);

export declare interface IonTextarea extends StencilComponents<'IonTextarea'> {}
@Component({ selector: 'ion-textarea', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'autocapitalize', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value'] })
export class IonTextarea {
  ionChange!: EventEmitter<CustomEvent>;
  ionInput!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionInput', 'ionBlur', 'ionFocus']);
  }
}
proxyMethods(IonTextarea, ['setFocus', 'getInputElement']);
proxyInputs(IonTextarea, ['color', 'dir', 'mode', 'autocapitalize', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value']);

export declare interface IonThumbnail extends StencilComponents<'IonThumbnail'> {}
@Component({ selector: 'ion-thumbnail', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['dir'] })
export class IonThumbnail {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonThumbnail, ['dir']);

export declare interface IonTitle extends StencilComponents<'IonTitle'> {}
@Component({ selector: 'ion-title', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir'] })
export class IonTitle {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonTitle, ['color', 'dir']);

export declare interface IonToggle extends StencilComponents<'IonToggle'> {}
@Component({ selector: 'ion-toggle', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode', 'name', 'checked', 'disabled', 'value'] })
export class IonToggle {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonToggle, ['color', 'dir', 'mode', 'name', 'checked', 'disabled', 'value']);

export declare interface IonToolbar extends StencilComponents<'IonToolbar'> {}
@Component({ selector: 'ion-toolbar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'dir', 'mode'] })
export class IonToolbar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonToolbar, ['color', 'dir', 'mode']);
