/* tslint:disable */
/* auto-generated angular directive proxies */

import { fromEvent } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];

export function proxyInputs(instance: any, el: any, props: string[]) {
  props.forEach(propName => {
    Object.defineProperty(instance, propName, {
      get: () => el[propName], set: (val: any) => el[propName] = val
    });
  });
}

export function proxyOutputs(instance: any, el: any, events: string[]) {
  events.forEach(eventName => instance[eventName] = fromEvent(el, eventName));
}

export function proxyMethods(instance: any, el: any, methods: string[]) {
  methods.forEach(methodName => {
    Object.defineProperty(instance, methodName, {
      get: function() {
        return function() {
          const args = arguments;
          return el.componentOnReady().then((el: any) => el[methodName].apply(el, args));
        };
      }
    });
  });
}


export declare interface IonApp extends StencilComponents<'IonApp'> {}
@Component({ selector: 'ion-app', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonApp {
}

export declare interface IonAvatar extends StencilComponents<'IonAvatar'> {}
@Component({ selector: 'ion-avatar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonAvatar {
}

export declare interface IonBackButton extends StencilComponents<'IonBackButton'> {}
@Component({ selector: 'ion-back-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'defaultHref', 'icon', 'text'] })
export class IonBackButton {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'defaultHref', 'icon', 'text']);
  }
}

export declare interface IonBackdrop extends StencilComponents<'IonBackdrop'> {}
@Component({ selector: 'ion-backdrop', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['visible', 'tappable', 'stopPropagation'] })
export class IonBackdrop {
  ionBackdropTap!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['visible', 'tappable', 'stopPropagation']);
    proxyOutputs(this, el, ['ionBackdropTap']);
  }
}

export declare interface IonBadge extends StencilComponents<'IonBadge'> {}
@Component({ selector: 'ion-badge', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonBadge {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface IonButton extends StencilComponents<'IonButton'> {}
@Component({ selector: 'ion-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type'] })
export class IonButton {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type']);
    proxyOutputs(this, el, ['ionFocus', 'ionBlur']);
  }
}

export declare interface IonButtons extends StencilComponents<'IonButtons'> {}
@Component({ selector: 'ion-buttons', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonButtons {
}

export declare interface IonCard extends StencilComponents<'IonCard'> {}
@Component({ selector: 'ion-card', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonCard {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface IonCardContent extends StencilComponents<'IonCardContent'> {}
@Component({ selector: 'ion-card-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode'] })
export class IonCardContent {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode']);
  }
}

export declare interface IonCardHeader extends StencilComponents<'IonCardHeader'> {}
@Component({ selector: 'ion-card-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'translucent'] })
export class IonCardHeader {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'translucent']);
  }
}

export declare interface IonCardSubtitle extends StencilComponents<'IonCardSubtitle'> {}
@Component({ selector: 'ion-card-subtitle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonCardSubtitle {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface IonCardTitle extends StencilComponents<'IonCardTitle'> {}
@Component({ selector: 'ion-card-title', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonCardTitle {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface IonCheckbox extends StencilComponents<'IonCheckbox'> {}
@Component({ selector: 'ion-checkbox', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'name', 'checked', 'disabled', 'value'] })
export class IonCheckbox {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'name', 'checked', 'disabled', 'value']);
    proxyOutputs(this, el, ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']);
  }
}

export declare interface IonChip extends StencilComponents<'IonChip'> {}
@Component({ selector: 'ion-chip', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'outline'] })
export class IonChip {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'outline']);
  }
}

export declare interface IonCol extends StencilComponents<'IonCol'> {}
@Component({ selector: 'ion-col', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl'] })
export class IonCol {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl']);
  }
}

export declare interface IonContent extends StencilComponents<'IonContent'> {}
@Component({ selector: 'ion-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'fullscreen', 'forceOverscroll', 'scrollX', 'scrollY', 'scrollEvents'] })
export class IonContent {
  ionScrollStart!: EventEmitter<CustomEvent>;
  ionScroll!: EventEmitter<CustomEvent>;
  ionScrollEnd!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['getScrollElement', 'scrollToTop', 'scrollToBottom', 'scrollByPoint', 'scrollToPoint']);
    proxyInputs(this, el, ['color', 'fullscreen', 'forceOverscroll', 'scrollX', 'scrollY', 'scrollEvents']);
    proxyOutputs(this, el, ['ionScrollStart', 'ionScroll', 'ionScrollEnd']);
  }
}

export declare interface IonDatetime extends StencilComponents<'IonDatetime'> {}
@Component({ selector: 'ion-datetime', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'name', 'disabled', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value'] })
export class IonDatetime {
  ionCancel!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['open']);
    proxyInputs(this, el, ['mode', 'name', 'disabled', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value']);
    proxyOutputs(this, el, ['ionCancel', 'ionChange', 'ionFocus', 'ionBlur', 'ionStyle']);
  }
}

export declare interface IonFab extends StencilComponents<'IonFab'> {}
@Component({ selector: 'ion-fab', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['horizontal', 'vertical', 'edge', 'activated'] })
export class IonFab {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['close']);
    proxyInputs(this, el, ['horizontal', 'vertical', 'edge', 'activated']);
  }
}

export declare interface IonFabButton extends StencilComponents<'IonFabButton'> {}
@Component({ selector: 'ion-fab-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type'] })
export class IonFabButton {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'color', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type']);
    proxyOutputs(this, el, ['ionFocus', 'ionBlur']);
  }
}

export declare interface IonFabList extends StencilComponents<'IonFabList'> {}
@Component({ selector: 'ion-fab-list', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['activated', 'side'] })
export class IonFabList {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['activated', 'side']);
  }
}

export declare interface IonFooter extends StencilComponents<'IonFooter'> {}
@Component({ selector: 'ion-footer', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class IonFooter {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'translucent']);
  }
}

export declare interface IonGrid extends StencilComponents<'IonGrid'> {}
@Component({ selector: 'ion-grid', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['fixed'] })
export class IonGrid {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['fixed']);
  }
}

export declare interface IonHeader extends StencilComponents<'IonHeader'> {}
@Component({ selector: 'ion-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class IonHeader {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'translucent']);
  }
}

export declare interface IonIcon extends StencilComponents<'IonIcon'> {}
@Component({ selector: 'ion-icon', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['ariaLabel', 'color', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src'] })
export class IonIcon {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['ariaLabel', 'color', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src']);
  }
}

export declare interface IonImg extends StencilComponents<'IonImg'> {}
@Component({ selector: 'ion-img', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['alt', 'src'] })
export class IonImg {
  ionImgDidLoad!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['alt', 'src']);
    proxyOutputs(this, el, ['ionImgDidLoad']);
  }
}

export declare interface IonInfiniteScroll extends StencilComponents<'IonInfiniteScroll'> {}
@Component({ selector: 'ion-infinite-scroll', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['threshold', 'disabled', 'position'] })
export class IonInfiniteScroll {
  ionInfinite!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['complete']);
    proxyInputs(this, el, ['threshold', 'disabled', 'position']);
    proxyOutputs(this, el, ['ionInfinite']);
  }
}

export declare interface IonInfiniteScrollContent extends StencilComponents<'IonInfiniteScrollContent'> {}
@Component({ selector: 'ion-infinite-scroll-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['loadingSpinner', 'loadingText'] })
export class IonInfiniteScrollContent {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['loadingSpinner', 'loadingText']);
  }
}

export declare interface IonInput extends StencilComponents<'IonInput'> {}
@Component({ selector: 'ion-input', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'spellcheck', 'step', 'size', 'type', 'value'] })
export class IonInput {
  ionInput!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionInputDidLoad!: EventEmitter<CustomEvent>;
  ionInputDidUnload!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['setFocus']);
    proxyInputs(this, el, ['color', 'mode', 'accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'spellcheck', 'step', 'size', 'type', 'value']);
    proxyOutputs(this, el, ['ionInput', 'ionChange', 'ionBlur', 'ionFocus', 'ionInputDidLoad', 'ionInputDidUnload', 'ionStyle']);
  }
}

export declare interface IonItem extends StencilComponents<'IonItem'> {}
@Component({ selector: 'ion-item', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type'] })
export class IonItem {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type']);
  }
}

export declare interface IonItemDivider extends StencilComponents<'IonItemDivider'> {}
@Component({ selector: 'ion-item-divider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'sticky'] })
export class IonItemDivider {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'sticky']);
  }
}

export declare interface IonItemGroup extends StencilComponents<'IonItemGroup'> {}
@Component({ selector: 'ion-item-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonItemGroup {
}

export declare interface IonItemOption extends StencilComponents<'IonItemOption'> {}
@Component({ selector: 'ion-item-option', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'disabled', 'expandable', 'href'] })
export class IonItemOption {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'disabled', 'expandable', 'href']);
  }
}

export declare interface IonItemOptions extends StencilComponents<'IonItemOptions'> {}
@Component({ selector: 'ion-item-options', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['side'] })
export class IonItemOptions {
  ionSwipe!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['fireSwipeEvent']);
    proxyInputs(this, el, ['side']);
    proxyOutputs(this, el, ['ionSwipe']);
  }
}

export declare interface IonItemSliding extends StencilComponents<'IonItemSliding'> {}
@Component({ selector: 'ion-item-sliding', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class IonItemSliding {
  ionDrag!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['getOpenAmount', 'getSlidingRatio', 'close', 'closeOpened']);
    proxyInputs(this, el, ['disabled']);
    proxyOutputs(this, el, ['ionDrag']);
  }
}

export declare interface IonLabel extends StencilComponents<'IonLabel'> {}
@Component({ selector: 'ion-label', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'position'] })
export class IonLabel {
  ionStyle!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'position']);
    proxyOutputs(this, el, ['ionStyle']);
  }
}

export declare interface IonList extends StencilComponents<'IonList'> {}
@Component({ selector: 'ion-list', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'lines', 'inset'] })
export class IonList {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['closeSlidingItems']);
    proxyInputs(this, el, ['mode', 'lines', 'inset']);
  }
}

export declare interface IonListHeader extends StencilComponents<'IonListHeader'> {}
@Component({ selector: 'ion-list-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color'] })
export class IonListHeader {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'color']);
  }
}

export declare interface IonMenu extends StencilComponents<'IonMenu'> {}
@Component({ selector: 'ion-menu', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['contentId', 'menuId', 'type', 'disabled', 'side', 'swipeGesture', 'maxEdgeStart'] })
export class IonMenu {
  ionWillOpen!: EventEmitter<CustomEvent>;
  ionWillClose!: EventEmitter<CustomEvent>;
  ionDidOpen!: EventEmitter<CustomEvent>;
  ionDidClose!: EventEmitter<CustomEvent>;
  ionMenuChange!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['isOpen', 'isActive', 'open', 'close', 'toggle', 'setOpen']);
    proxyInputs(this, el, ['contentId', 'menuId', 'type', 'disabled', 'side', 'swipeGesture', 'maxEdgeStart']);
    proxyOutputs(this, el, ['ionWillOpen', 'ionWillClose', 'ionDidOpen', 'ionDidClose', 'ionMenuChange']);
  }
}

export declare interface IonMenuButton extends StencilComponents<'IonMenuButton'> {}
@Component({ selector: 'ion-menu-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'menu', 'autoHide'] })
export class IonMenuButton {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'menu', 'autoHide']);
  }
}

export declare interface IonMenuToggle extends StencilComponents<'IonMenuToggle'> {}
@Component({ selector: 'ion-menu-toggle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['menu', 'autoHide'] })
export class IonMenuToggle {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['menu', 'autoHide']);
  }
}

export declare interface IonNav extends StencilComponents<'IonNav'> {}
@Component({ selector: 'ion-nav', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['delegate', 'swipeGesture', 'animated', 'animation', 'rootParams', 'root'] })
export class IonNav {
  ionNavWillLoad!: EventEmitter<CustomEvent>;
  ionNavWillChange!: EventEmitter<CustomEvent>;
  ionNavDidChange!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['push', 'insert', 'insertPages', 'pop', 'popTo', 'popToRoot', 'removeIndex', 'setRoot', 'setPages', 'setRouteId', 'getRouteId', 'getActive', 'getByIndex', 'canGoBack', 'getPrevious']);
    proxyInputs(this, el, ['delegate', 'swipeGesture', 'animated', 'animation', 'rootParams', 'root']);
    proxyOutputs(this, el, ['ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']);
  }
}

export declare interface IonNavPop extends StencilComponents<'IonNavPop'> {}
@Component({ selector: 'ion-nav-pop', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonNavPop {
}

export declare interface IonNavPush extends StencilComponents<'IonNavPush'> {}
@Component({ selector: 'ion-nav-push', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class IonNavPush {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['component', 'componentProps']);
  }
}

export declare interface IonNavSetRoot extends StencilComponents<'IonNavSetRoot'> {}
@Component({ selector: 'ion-nav-set-root', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class IonNavSetRoot {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['component', 'componentProps']);
  }
}

export declare interface IonNote extends StencilComponents<'IonNote'> {}
@Component({ selector: 'ion-note', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonNote {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface IonProgressBar extends StencilComponents<'IonProgressBar'> {}
@Component({ selector: 'ion-progress-bar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'type', 'reversed', 'value', 'buffer', 'color'] })
export class IonProgressBar {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'type', 'reversed', 'value', 'buffer', 'color']);
  }
}

export declare interface IonRadio extends StencilComponents<'IonRadio'> {}
@Component({ selector: 'ion-radio', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'name', 'disabled', 'checked', 'value'] })
export class IonRadio {
  ionRadioDidLoad!: EventEmitter<CustomEvent>;
  ionRadioDidUnload!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
  ionSelect!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'name', 'disabled', 'checked', 'value']);
    proxyOutputs(this, el, ['ionRadioDidLoad', 'ionRadioDidUnload', 'ionStyle', 'ionSelect', 'ionFocus', 'ionBlur']);
  }
}

export declare interface IonRadioGroup extends StencilComponents<'IonRadioGroup'> {}
@Component({ selector: 'ion-radio-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['allowEmptySelection', 'name', 'value'] })
export class IonRadioGroup {
  ionChange!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['allowEmptySelection', 'name', 'value']);
    proxyOutputs(this, el, ['ionChange']);
  }
}

export declare interface IonRange extends StencilComponents<'IonRange'> {}
@Component({ selector: 'ion-range', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value'] })
export class IonRange {
  ionChange!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value']);
    proxyOutputs(this, el, ['ionChange', 'ionStyle', 'ionFocus', 'ionBlur']);
  }
}

export declare interface IonRefresher extends StencilComponents<'IonRefresher'> {}
@Component({ selector: 'ion-refresher', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled'] })
export class IonRefresher {
  ionRefresh!: EventEmitter<CustomEvent>;
  ionPull!: EventEmitter<CustomEvent>;
  ionStart!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['complete', 'cancel', 'getProgress']);
    proxyInputs(this, el, ['pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled']);
    proxyOutputs(this, el, ['ionRefresh', 'ionPull', 'ionStart']);
  }
}

export declare interface IonRefresherContent extends StencilComponents<'IonRefresherContent'> {}
@Component({ selector: 'ion-refresher-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText'] })
export class IonRefresherContent {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']);
  }
}

export declare interface IonReorder extends StencilComponents<'IonReorder'> {}
@Component({ selector: 'ion-reorder', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonReorder {
}

export declare interface IonReorderGroup extends StencilComponents<'IonReorderGroup'> {}
@Component({ selector: 'ion-reorder-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class IonReorderGroup {
  ionItemReorder!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['complete']);
    proxyInputs(this, el, ['disabled']);
    proxyOutputs(this, el, ['ionItemReorder']);
  }
}

export declare interface IonRippleEffect extends StencilComponents<'IonRippleEffect'> {}
@Component({ selector: 'ion-ripple-effect', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['type'] })
export class IonRippleEffect {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['addRipple']);
    proxyInputs(this, el, ['type']);
  }
}

export declare interface IonRow extends StencilComponents<'IonRow'> {}
@Component({ selector: 'ion-row', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonRow {
}

export declare interface IonSearchbar extends StencilComponents<'IonSearchbar'> {}
@Component({ selector: 'ion-searchbar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'debounce', 'placeholder', 'searchIcon', 'showCancelButton', 'spellcheck', 'type', 'value'] })
export class IonSearchbar {
  ionInput!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionClear!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['setFocus']);
    proxyInputs(this, el, ['color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'debounce', 'placeholder', 'searchIcon', 'showCancelButton', 'spellcheck', 'type', 'value']);
    proxyOutputs(this, el, ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus']);
  }
}

export declare interface IonSegment extends StencilComponents<'IonSegment'> {}
@Component({ selector: 'ion-segment', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'disabled', 'scrollable', 'value'] })
export class IonSegment {
  ionChange!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'disabled', 'scrollable', 'value']);
    proxyOutputs(this, el, ['ionChange', 'ionStyle']);
  }
}

export declare interface IonSegmentButton extends StencilComponents<'IonSegmentButton'> {}
@Component({ selector: 'ion-segment-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'checked', 'disabled', 'layout', 'value'] })
export class IonSegmentButton {
  ionSelect!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'checked', 'disabled', 'layout', 'value']);
    proxyOutputs(this, el, ['ionSelect']);
  }
}

export declare interface IonSelect extends StencilComponents<'IonSelect'> {}
@Component({ selector: 'ion-select', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value'] })
export class IonSelect {
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['open']);
    proxyInputs(this, el, ['mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value']);
    proxyOutputs(this, el, ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur', 'ionStyle']);
  }
}

export declare interface IonSelectOption extends StencilComponents<'IonSelectOption'> {}
@Component({ selector: 'ion-select-option', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled', 'selected', 'value'] })
export class IonSelectOption {
  ionSelectOptionDidLoad!: EventEmitter<CustomEvent>;
  ionSelectOptionDidUnload!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['disabled', 'selected', 'value']);
    proxyOutputs(this, el, ['ionSelectOptionDidLoad', 'ionSelectOptionDidUnload']);
  }
}

export declare interface IonSelectPopover extends StencilComponents<'IonSelectPopover'> {}
@Component({ selector: 'ion-select-popover', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['header', 'subHeader', 'message', 'options'] })
export class IonSelectPopover {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['header', 'subHeader', 'message', 'options']);
  }
}

export declare interface IonSkeletonText extends StencilComponents<'IonSkeletonText'> {}
@Component({ selector: 'ion-skeleton-text', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['width'] })
export class IonSkeletonText {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['width']);
  }
}

export declare interface IonSlide extends StencilComponents<'IonSlide'> {}
@Component({ selector: 'ion-slide', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonSlide {
  ionSlideChanged!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyOutputs(this, el, ['ionSlideChanged']);
  }
}

export declare interface IonSlides extends StencilComponents<'IonSlides'> {}
@Component({ selector: 'ion-slides', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'options', 'pager', 'scrollbar'] })
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

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['update', 'slideTo', 'slideNext', 'slidePrev', 'getActiveIndex', 'getPreviousIndex', 'length', 'isEnd', 'isBeginning', 'startAutoplay', 'stopAutoplay', 'lockSwipeToNext', 'lockSwipeToPrev', 'lockSwipes']);
    proxyInputs(this, el, ['mode', 'options', 'pager', 'scrollbar']);
    proxyOutputs(this, el, ['ionSlidesDidLoad', 'ionSlideTap', 'ionSlideDoubleTap', 'ionSlideWillChange', 'ionSlideDidChange', 'ionSlideNextStart', 'ionSlidePrevStart', 'ionSlideNextEnd', 'ionSlidePrevEnd', 'ionSlideTransitionStart', 'ionSlideTransitionEnd', 'ionSlideDrag', 'ionSlideReachStart', 'ionSlideReachEnd', 'ionSlideTouchStart', 'ionSlideTouchEnd']);
  }
}

export declare interface IonSpinner extends StencilComponents<'IonSpinner'> {}
@Component({ selector: 'ion-spinner', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'duration', 'name', 'paused'] })
export class IonSpinner {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'duration', 'name', 'paused']);
  }
}

export declare interface IonSplitPane extends StencilComponents<'IonSplitPane'> {}
@Component({ selector: 'ion-split-pane', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['contentId', 'disabled', 'when'] })
export class IonSplitPane {
  ionChange!: EventEmitter<CustomEvent>;
  ionSplitPaneVisible!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['contentId', 'disabled', 'when']);
    proxyOutputs(this, el, ['ionChange', 'ionSplitPaneVisible']);
  }
}

export declare interface IonTabBar extends StencilComponents<'IonTabBar'> {}
@Component({ selector: 'ion-tab-bar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'selectedTab', 'translucent'] })
export class IonTabBar {
  ionTabBarChanged!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'color', 'selectedTab', 'translucent']);
    proxyOutputs(this, el, ['ionTabBarChanged']);
  }
}

export declare interface IonTabButton extends StencilComponents<'IonTabButton'> {}
@Component({ selector: 'ion-tab-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'layout', 'href', 'tab', 'disabled'] })
export class IonTabButton {
  ionTabButtonClick!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'layout', 'href', 'tab', 'disabled']);
    proxyOutputs(this, el, ['ionTabButtonClick']);
  }
}

export declare interface IonText extends StencilComponents<'IonText'> {}
@Component({ selector: 'ion-text', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonText {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface IonTextarea extends StencilComponents<'IonTextarea'> {}
@Component({ selector: 'ion-textarea', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'autocapitalize', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value'] })
export class IonTextarea {
  ionChange!: EventEmitter<CustomEvent>;
  ionInput!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['setFocus']);
    proxyInputs(this, el, ['mode', 'color', 'autocapitalize', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value']);
    proxyOutputs(this, el, ['ionChange', 'ionInput', 'ionStyle', 'ionBlur', 'ionFocus']);
  }
}

export declare interface IonThumbnail extends StencilComponents<'IonThumbnail'> {}
@Component({ selector: 'ion-thumbnail', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonThumbnail {
}

export declare interface IonTitle extends StencilComponents<'IonTitle'> {}
@Component({ selector: 'ion-title', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color'] })
export class IonTitle {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color']);
  }
}

export declare interface IonToggle extends StencilComponents<'IonToggle'> {}
@Component({ selector: 'ion-toggle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'name', 'checked', 'disabled', 'value'] })
export class IonToggle {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'color', 'name', 'checked', 'disabled', 'value']);
    proxyOutputs(this, el, ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']);
  }
}

export declare interface IonToolbar extends StencilComponents<'IonToolbar'> {}
@Component({ selector: 'ion-toolbar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonToolbar {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}
