/* tslint:disable */
/* auto-generated angular directive proxies */

import { fromEvent } from 'rxjs';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter } from '@angular/core';

type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];

export function proxyInputs(Cmp: any, inputs: string[]) {
  const Prototype = Cmp.prototype;
  inputs.forEach(item => {
    Object.defineProperty(Prototype, item, {
      get() { return this.el[item]; },
      set(val: any) { this.el[item] = val; },
    });
  });
}

export function proxyOutputs(instance: any, el: any, events: string[]) {
  events.forEach(eventName => instance[eventName] = fromEvent(el, eventName));
}

export function proxyMethods(Cmp: any, methods: string[]) {
  const Prototype = Cmp.prototype;
  methods.forEach(methodName => {
    Prototype[methodName] = function() {
      const args = arguments;
      return this.el.componentOnReady().then((el: any) => el[methodName].apply(el, args));
    };
  });
}


export declare interface IonApp extends StencilComponents<'IonApp'> {}
@Component({ selector: 'ion-app', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonApp {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonAvatar extends StencilComponents<'IonAvatar'> {}
@Component({ selector: 'ion-avatar', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonAvatar {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonBackButton extends StencilComponents<'IonBackButton'> {}
@Component({ selector: 'ion-back-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'defaultHref', 'icon', 'text'] })
export class IonBackButton {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonBackButton, ['color', 'mode', 'defaultHref', 'icon', 'text']);

export declare interface IonBackdrop extends StencilComponents<'IonBackdrop'> {}
@Component({ selector: 'ion-backdrop', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['visible', 'tappable', 'stopPropagation'] })
export class IonBackdrop {
  ionBackdropTap!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionBackdropTap']);
  }
}
proxyInputs(IonBackdrop, ['visible', 'tappable', 'stopPropagation']);

export declare interface IonBadge extends StencilComponents<'IonBadge'> {}
@Component({ selector: 'ion-badge', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonBadge {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonBadge, ['color', 'mode']);

export declare interface IonButton extends StencilComponents<'IonButton'> {}
@Component({ selector: 'ion-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type'] })
export class IonButton {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonButton, ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type']);

export declare interface IonButtons extends StencilComponents<'IonButtons'> {}
@Component({ selector: 'ion-buttons', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonButtons {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonCard extends StencilComponents<'IonCard'> {}
@Component({ selector: 'ion-card', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonCard {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCard, ['color', 'mode']);

export declare interface IonCardContent extends StencilComponents<'IonCardContent'> {}
@Component({ selector: 'ion-card-content', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode'] })
export class IonCardContent {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCardContent, ['mode']);

export declare interface IonCardHeader extends StencilComponents<'IonCardHeader'> {}
@Component({ selector: 'ion-card-header', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'translucent'] })
export class IonCardHeader {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCardHeader, ['color', 'mode', 'translucent']);

export declare interface IonCardSubtitle extends StencilComponents<'IonCardSubtitle'> {}
@Component({ selector: 'ion-card-subtitle', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonCardSubtitle {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCardSubtitle, ['color', 'mode']);

export declare interface IonCardTitle extends StencilComponents<'IonCardTitle'> {}
@Component({ selector: 'ion-card-title', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonCardTitle {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCardTitle, ['color', 'mode']);

export declare interface IonCheckbox extends StencilComponents<'IonCheckbox'> {}
@Component({ selector: 'ion-checkbox', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'name', 'checked', 'disabled', 'value'] })
export class IonCheckbox {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonCheckbox, ['color', 'mode', 'name', 'checked', 'disabled', 'value']);

export declare interface IonChip extends StencilComponents<'IonChip'> {}
@Component({ selector: 'ion-chip', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'outline'] })
export class IonChip {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonChip, ['color', 'mode', 'outline']);

export declare interface IonCol extends StencilComponents<'IonCol'> {}
@Component({ selector: 'ion-col', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl'] })
export class IonCol {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonCol, ['offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl']);

export declare interface IonContent extends StencilComponents<'IonContent'> {}
@Component({ selector: 'ion-content', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'fullscreen', 'forceOverscroll', 'scrollX', 'scrollY', 'scrollEvents'] })
export class IonContent {
  ionScrollStart!: EventEmitter<CustomEvent>;
  ionScroll!: EventEmitter<CustomEvent>;
  ionScrollEnd!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionScrollStart', 'ionScroll', 'ionScrollEnd']);
  }
}
proxyMethods(IonContent, ['getScrollElement', 'scrollToTop', 'scrollToBottom', 'scrollByPoint', 'scrollToPoint']);
proxyInputs(IonContent, ['color', 'fullscreen', 'forceOverscroll', 'scrollX', 'scrollY', 'scrollEvents']);

export declare interface IonDatetime extends StencilComponents<'IonDatetime'> {}
@Component({ selector: 'ion-datetime', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'name', 'disabled', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value'] })
export class IonDatetime {
  ionCancel!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionCancel', 'ionChange', 'ionFocus', 'ionBlur']);
  }
}
proxyMethods(IonDatetime, ['open']);
proxyInputs(IonDatetime, ['mode', 'name', 'disabled', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value']);

export declare interface IonFab extends StencilComponents<'IonFab'> {}
@Component({ selector: 'ion-fab', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['horizontal', 'vertical', 'edge', 'activated'] })
export class IonFab {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyMethods(IonFab, ['close']);
proxyInputs(IonFab, ['horizontal', 'vertical', 'edge', 'activated']);

export declare interface IonFabButton extends StencilComponents<'IonFabButton'> {}
@Component({ selector: 'ion-fab-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type', 'size'] })
export class IonFabButton {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonFabButton, ['mode', 'color', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type', 'size']);

export declare interface IonFabList extends StencilComponents<'IonFabList'> {}
@Component({ selector: 'ion-fab-list', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['activated', 'side'] })
export class IonFabList {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonFabList, ['activated', 'side']);

export declare interface IonFooter extends StencilComponents<'IonFooter'> {}
@Component({ selector: 'ion-footer', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class IonFooter {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonFooter, ['mode', 'translucent']);

export declare interface IonGrid extends StencilComponents<'IonGrid'> {}
@Component({ selector: 'ion-grid', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['fixed'] })
export class IonGrid {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonGrid, ['fixed']);

export declare interface IonHeader extends StencilComponents<'IonHeader'> {}
@Component({ selector: 'ion-header', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class IonHeader {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonHeader, ['mode', 'translucent']);

export declare interface IonIcon extends StencilComponents<'IonIcon'> {}
@Component({ selector: 'ion-icon', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['ariaLabel', 'color', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src'] })
export class IonIcon {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonIcon, ['ariaLabel', 'color', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src']);

export declare interface IonImg extends StencilComponents<'IonImg'> {}
@Component({ selector: 'ion-img', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['alt', 'src'] })
export class IonImg {
  ionImgDidLoad!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionImgDidLoad']);
  }
}
proxyInputs(IonImg, ['alt', 'src']);

export declare interface IonInfiniteScroll extends StencilComponents<'IonInfiniteScroll'> {}
@Component({ selector: 'ion-infinite-scroll', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['threshold', 'disabled', 'position'] })
export class IonInfiniteScroll {
  ionInfinite!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionInfinite']);
  }
}
proxyMethods(IonInfiniteScroll, ['complete']);
proxyInputs(IonInfiniteScroll, ['threshold', 'disabled', 'position']);

export declare interface IonInfiniteScrollContent extends StencilComponents<'IonInfiniteScrollContent'> {}
@Component({ selector: 'ion-infinite-scroll-content', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['loadingSpinner', 'loadingText'] })
export class IonInfiniteScrollContent {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonInfiniteScrollContent, ['loadingSpinner', 'loadingText']);

export declare interface IonInput extends StencilComponents<'IonInput'> {}
@Component({ selector: 'ion-input', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'spellcheck', 'step', 'size', 'type', 'value'] })
export class IonInput {
  ionInput!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionBlur', 'ionFocus']);
  }
}
proxyMethods(IonInput, ['setFocus']);
proxyInputs(IonInput, ['color', 'mode', 'accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'spellcheck', 'step', 'size', 'type', 'value']);

export declare interface IonItem extends StencilComponents<'IonItem'> {}
@Component({ selector: 'ion-item', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type'] })
export class IonItem {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonItem, ['color', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type']);

export declare interface IonItemDivider extends StencilComponents<'IonItemDivider'> {}
@Component({ selector: 'ion-item-divider', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'sticky'] })
export class IonItemDivider {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonItemDivider, ['color', 'mode', 'sticky']);

export declare interface IonItemGroup extends StencilComponents<'IonItemGroup'> {}
@Component({ selector: 'ion-item-group', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonItemGroup {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonItemOption extends StencilComponents<'IonItemOption'> {}
@Component({ selector: 'ion-item-option', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'disabled', 'expandable', 'href'] })
export class IonItemOption {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonItemOption, ['color', 'mode', 'disabled', 'expandable', 'href']);

export declare interface IonItemOptions extends StencilComponents<'IonItemOptions'> {}
@Component({ selector: 'ion-item-options', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['side'] })
export class IonItemOptions {
  ionSwipe!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionSwipe']);
  }
}
proxyInputs(IonItemOptions, ['side']);

export declare interface IonItemSliding extends StencilComponents<'IonItemSliding'> {}
@Component({ selector: 'ion-item-sliding', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class IonItemSliding {
  ionDrag!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionDrag']);
  }
}
proxyMethods(IonItemSliding, ['getOpenAmount', 'getSlidingRatio', 'close', 'closeOpened']);
proxyInputs(IonItemSliding, ['disabled']);

export declare interface IonLabel extends StencilComponents<'IonLabel'> {}
@Component({ selector: 'ion-label', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'position'] })
export class IonLabel {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonLabel, ['color', 'mode', 'position']);

export declare interface IonList extends StencilComponents<'IonList'> {}
@Component({ selector: 'ion-list', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'lines', 'inset'] })
export class IonList {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyMethods(IonList, ['closeSlidingItems']);
proxyInputs(IonList, ['mode', 'lines', 'inset']);

export declare interface IonListHeader extends StencilComponents<'IonListHeader'> {}
@Component({ selector: 'ion-list-header', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'color'] })
export class IonListHeader {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonListHeader, ['mode', 'color']);

export declare interface IonMenu extends StencilComponents<'IonMenu'> {}
@Component({ selector: 'ion-menu', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['contentId', 'menuId', 'type', 'disabled', 'side', 'swipeGesture', 'maxEdgeStart'] })
export class IonMenu {
  ionWillOpen!: EventEmitter<CustomEvent>;
  ionWillClose!: EventEmitter<CustomEvent>;
  ionDidOpen!: EventEmitter<CustomEvent>;
  ionDidClose!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionWillOpen', 'ionWillClose', 'ionDidOpen', 'ionDidClose']);
  }
}
proxyMethods(IonMenu, ['isOpen', 'isActive', 'open', 'close', 'toggle', 'setOpen']);
proxyInputs(IonMenu, ['contentId', 'menuId', 'type', 'disabled', 'side', 'swipeGesture', 'maxEdgeStart']);

export declare interface IonMenuButton extends StencilComponents<'IonMenuButton'> {}
@Component({ selector: 'ion-menu-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'menu', 'autoHide'] })
export class IonMenuButton {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonMenuButton, ['color', 'mode', 'menu', 'autoHide']);

export declare interface IonMenuToggle extends StencilComponents<'IonMenuToggle'> {}
@Component({ selector: 'ion-menu-toggle', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['menu', 'autoHide'] })
export class IonMenuToggle {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonMenuToggle, ['menu', 'autoHide']);

export declare interface IonNav extends StencilComponents<'IonNav'> {}
@Component({ selector: 'ion-nav', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['swipeGesture', 'animated', 'animation', 'rootParams', 'root'] })
export class IonNav {
  ionNavWillLoad!: EventEmitter<CustomEvent>;
  ionNavWillChange!: EventEmitter<CustomEvent>;
  ionNavDidChange!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']);
  }
}
proxyMethods(IonNav, ['push', 'insert', 'insertPages', 'pop', 'popTo', 'popToRoot', 'removeIndex', 'setRoot', 'setPages', 'getActive', 'getByIndex', 'canGoBack', 'getPrevious']);
proxyInputs(IonNav, ['swipeGesture', 'animated', 'animation', 'rootParams', 'root']);

export declare interface IonNavPop extends StencilComponents<'IonNavPop'> {}
@Component({ selector: 'ion-nav-pop', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonNavPop {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonNavPush extends StencilComponents<'IonNavPush'> {}
@Component({ selector: 'ion-nav-push', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class IonNavPush {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonNavPush, ['component', 'componentProps']);

export declare interface IonNavSetRoot extends StencilComponents<'IonNavSetRoot'> {}
@Component({ selector: 'ion-nav-set-root', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class IonNavSetRoot {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonNavSetRoot, ['component', 'componentProps']);

export declare interface IonNote extends StencilComponents<'IonNote'> {}
@Component({ selector: 'ion-note', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonNote {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonNote, ['color', 'mode']);

export declare interface IonProgressBar extends StencilComponents<'IonProgressBar'> {}
@Component({ selector: 'ion-progress-bar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'type', 'reversed', 'value', 'buffer', 'color'] })
export class IonProgressBar {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonProgressBar, ['mode', 'type', 'reversed', 'value', 'buffer', 'color']);

export declare interface IonRadio extends StencilComponents<'IonRadio'> {}
@Component({ selector: 'ion-radio', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'name', 'disabled', 'checked', 'value'] })
export class IonRadio {
  ionSelect!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionSelect', 'ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonRadio, ['color', 'mode', 'name', 'disabled', 'checked', 'value']);

export declare interface IonRadioGroup extends StencilComponents<'IonRadioGroup'> {}
@Component({ selector: 'ion-radio-group', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['allowEmptySelection', 'name', 'value'] })
export class IonRadioGroup {
  ionChange!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange']);
  }
}
proxyInputs(IonRadioGroup, ['allowEmptySelection', 'name', 'value']);

export declare interface IonRange extends StencilComponents<'IonRange'> {}
@Component({ selector: 'ion-range', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value'] })
export class IonRange {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonRange, ['color', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value']);

export declare interface IonRefresher extends StencilComponents<'IonRefresher'> {}
@Component({ selector: 'ion-refresher', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled'] })
export class IonRefresher {
  ionRefresh!: EventEmitter<CustomEvent>;
  ionPull!: EventEmitter<CustomEvent>;
  ionStart!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionRefresh', 'ionPull', 'ionStart']);
  }
}
proxyMethods(IonRefresher, ['complete', 'cancel', 'getProgress']);
proxyInputs(IonRefresher, ['pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled']);

export declare interface IonRefresherContent extends StencilComponents<'IonRefresherContent'> {}
@Component({ selector: 'ion-refresher-content', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText'] })
export class IonRefresherContent {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonRefresherContent, ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']);

export declare interface IonReorder extends StencilComponents<'IonReorder'> {}
@Component({ selector: 'ion-reorder', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonReorder {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonReorderGroup extends StencilComponents<'IonReorderGroup'> {}
@Component({ selector: 'ion-reorder-group', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class IonReorderGroup {
  ionItemReorder!: EventEmitter<CustomEvent>;
  el: HTMLElement
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
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyMethods(IonRippleEffect, ['addRipple']);
proxyInputs(IonRippleEffect, ['type']);

export declare interface IonRow extends StencilComponents<'IonRow'> {}
@Component({ selector: 'ion-row', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonRow {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonSearchbar extends StencilComponents<'IonSearchbar'> {}
@Component({ selector: 'ion-searchbar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'debounce', 'placeholder', 'searchIcon', 'showCancelButton', 'spellcheck', 'type', 'value'] })
export class IonSearchbar {
  ionInput!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionClear!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus']);
  }
}
proxyMethods(IonSearchbar, ['setFocus']);
proxyInputs(IonSearchbar, ['color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'debounce', 'placeholder', 'searchIcon', 'showCancelButton', 'spellcheck', 'type', 'value']);

export declare interface IonSegment extends StencilComponents<'IonSegment'> {}
@Component({ selector: 'ion-segment', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'disabled', 'scrollable', 'value'] })
export class IonSegment {
  ionChange!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionStyle']);
  }
}
proxyInputs(IonSegment, ['color', 'mode', 'disabled', 'scrollable', 'value']);

export declare interface IonSegmentButton extends StencilComponents<'IonSegmentButton'> {}
@Component({ selector: 'ion-segment-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'checked', 'disabled', 'layout', 'value'] })
export class IonSegmentButton {
  ionSelect!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionSelect']);
  }
}
proxyInputs(IonSegmentButton, ['mode', 'checked', 'disabled', 'layout', 'value']);

export declare interface IonSelect extends StencilComponents<'IonSelect'> {}
@Component({ selector: 'ion-select', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value'] })
export class IonSelect {
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur']);
  }
}
proxyMethods(IonSelect, ['open']);
proxyInputs(IonSelect, ['mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value']);

export declare interface IonSelectOption extends StencilComponents<'IonSelectOption'> {}
@Component({ selector: 'ion-select-option', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['disabled', 'selected', 'value'] })
export class IonSelectOption {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonSelectOption, ['disabled', 'selected', 'value']);

export declare interface IonSkeletonText extends StencilComponents<'IonSkeletonText'> {}
@Component({ selector: 'ion-skeleton-text', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['width'] })
export class IonSkeletonText {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonSkeletonText, ['width']);

export declare interface IonSlide extends StencilComponents<'IonSlide'> {}
@Component({ selector: 'ion-slide', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonSlide {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonSlides extends StencilComponents<'IonSlides'> {}
@Component({ selector: 'ion-slides', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'options', 'pager', 'scrollbar'] })
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
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionSlidesDidLoad', 'ionSlideTap', 'ionSlideDoubleTap', 'ionSlideWillChange', 'ionSlideDidChange', 'ionSlideNextStart', 'ionSlidePrevStart', 'ionSlideNextEnd', 'ionSlidePrevEnd', 'ionSlideTransitionStart', 'ionSlideTransitionEnd', 'ionSlideDrag', 'ionSlideReachStart', 'ionSlideReachEnd', 'ionSlideTouchStart', 'ionSlideTouchEnd']);
  }
}
proxyMethods(IonSlides, ['update', 'slideTo', 'slideNext', 'slidePrev', 'getActiveIndex', 'getPreviousIndex', 'length', 'isEnd', 'isBeginning', 'startAutoplay', 'stopAutoplay', 'lockSwipeToNext', 'lockSwipeToPrev', 'lockSwipes']);
proxyInputs(IonSlides, ['mode', 'options', 'pager', 'scrollbar']);

export declare interface IonSpinner extends StencilComponents<'IonSpinner'> {}
@Component({ selector: 'ion-spinner', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'duration', 'name', 'paused'] })
export class IonSpinner {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonSpinner, ['color', 'duration', 'name', 'paused']);

export declare interface IonSplitPane extends StencilComponents<'IonSplitPane'> {}
@Component({ selector: 'ion-split-pane', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['contentId', 'disabled', 'when'] })
export class IonSplitPane {
  ionChange!: EventEmitter<CustomEvent>;
  ionSplitPaneVisible!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionSplitPaneVisible']);
  }
}
proxyInputs(IonSplitPane, ['contentId', 'disabled', 'when']);

export declare interface IonTabBar extends StencilComponents<'IonTabBar'> {}
@Component({ selector: 'ion-tab-bar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'selectedTab', 'translucent'] })
export class IonTabBar {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonTabBar, ['mode', 'color', 'selectedTab', 'translucent']);

export declare interface IonTabButton extends StencilComponents<'IonTabButton'> {}
@Component({ selector: 'ion-tab-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['selected', 'mode', 'layout', 'href', 'tab', 'disabled'] })
export class IonTabButton {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonTabButton, ['selected', 'mode', 'layout', 'href', 'tab', 'disabled']);

export declare interface IonText extends StencilComponents<'IonText'> {}
@Component({ selector: 'ion-text', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonText {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonText, ['color', 'mode']);

export declare interface IonTextarea extends StencilComponents<'IonTextarea'> {}
@Component({ selector: 'ion-textarea', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'autocapitalize', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value'] })
export class IonTextarea {
  ionChange!: EventEmitter<CustomEvent>;
  ionInput!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionInput', 'ionBlur', 'ionFocus']);
  }
}
proxyMethods(IonTextarea, ['setFocus']);
proxyInputs(IonTextarea, ['mode', 'color', 'autocapitalize', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value']);

export declare interface IonThumbnail extends StencilComponents<'IonThumbnail'> {}
@Component({ selector: 'ion-thumbnail', changeDetection: 0, template: '<ng-content></ng-content>' })
export class IonThumbnail {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface IonTitle extends StencilComponents<'IonTitle'> {}
@Component({ selector: 'ion-title', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color'] })
export class IonTitle {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonTitle, ['color']);

export declare interface IonToggle extends StencilComponents<'IonToggle'> {}
@Component({ selector: 'ion-toggle', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'name', 'checked', 'disabled', 'value'] })
export class IonToggle {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionFocus', 'ionBlur']);
  }
}
proxyInputs(IonToggle, ['mode', 'color', 'name', 'checked', 'disabled', 'value']);

export declare interface IonToolbar extends StencilComponents<'IonToolbar'> {}
@Component({ selector: 'ion-toolbar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonToolbar {
  el: HTMLElement
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(IonToolbar, ['color', 'mode']);
