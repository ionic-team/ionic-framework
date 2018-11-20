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


export declare interface App extends StencilComponents<'IonApp'> {}
@Component({ selector: 'ion-app', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class App {
}

export declare interface Avatar extends StencilComponents<'IonAvatar'> {}
@Component({ selector: 'ion-avatar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class Avatar {
}

export declare interface BackButton extends StencilComponents<'IonBackButton'> {}
@Component({ selector: 'ion-back-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'defaultHref', 'icon', 'text'] })
export class BackButton {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'defaultHref', 'icon', 'text']);
  }
}

export declare interface Backdrop extends StencilComponents<'IonBackdrop'> {}
@Component({ selector: 'ion-backdrop', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['visible', 'tappable', 'stopPropagation'] })
export class Backdrop {
  ionBackdropTap!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['visible', 'tappable', 'stopPropagation']);
    proxyOutputs(this, el, ['ionBackdropTap']);
  }
}

export declare interface Badge extends StencilComponents<'IonBadge'> {}
@Component({ selector: 'ion-badge', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class Badge {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface Button extends StencilComponents<'IonButton'> {}
@Component({ selector: 'ion-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type'] })
export class Button {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type']);
    proxyOutputs(this, el, ['ionFocus', 'ionBlur']);
  }
}

export declare interface Buttons extends StencilComponents<'IonButtons'> {}
@Component({ selector: 'ion-buttons', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class Buttons {
}

export declare interface Card extends StencilComponents<'IonCard'> {}
@Component({ selector: 'ion-card', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class Card {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface CardContent extends StencilComponents<'IonCardContent'> {}
@Component({ selector: 'ion-card-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode'] })
export class CardContent {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode']);
  }
}

export declare interface CardHeader extends StencilComponents<'IonCardHeader'> {}
@Component({ selector: 'ion-card-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'translucent'] })
export class CardHeader {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'translucent']);
  }
}

export declare interface CardSubtitle extends StencilComponents<'IonCardSubtitle'> {}
@Component({ selector: 'ion-card-subtitle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class CardSubtitle {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface CardTitle extends StencilComponents<'IonCardTitle'> {}
@Component({ selector: 'ion-card-title', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class CardTitle {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface Checkbox extends StencilComponents<'IonCheckbox'> {}
@Component({ selector: 'ion-checkbox', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'name', 'checked', 'disabled', 'value'] })
export class Checkbox {
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

export declare interface Chip extends StencilComponents<'IonChip'> {}
@Component({ selector: 'ion-chip', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'outline'] })
export class Chip {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'outline']);
  }
}

export declare interface Col extends StencilComponents<'IonCol'> {}
@Component({ selector: 'ion-col', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl'] })
export class Col {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl']);
  }
}

export declare interface Content extends StencilComponents<'IonContent'> {}
@Component({ selector: 'ion-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'fullscreen', 'forceOverscroll', 'scrollX', 'scrollY', 'scrollEvents'] })
export class Content {
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

export declare interface Datetime extends StencilComponents<'IonDatetime'> {}
@Component({ selector: 'ion-datetime', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'name', 'disabled', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value'] })
export class Datetime {
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

export declare interface Fab extends StencilComponents<'IonFab'> {}
@Component({ selector: 'ion-fab', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['horizontal', 'vertical', 'edge', 'activated'] })
export class Fab {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['close']);
    proxyInputs(this, el, ['horizontal', 'vertical', 'edge', 'activated']);
  }
}

export declare interface FabButton extends StencilComponents<'IonFabButton'> {}
@Component({ selector: 'ion-fab-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type'] })
export class FabButton {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'color', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type']);
    proxyOutputs(this, el, ['ionFocus', 'ionBlur']);
  }
}

export declare interface FabList extends StencilComponents<'IonFabList'> {}
@Component({ selector: 'ion-fab-list', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['activated', 'side'] })
export class FabList {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['activated', 'side']);
  }
}

export declare interface Footer extends StencilComponents<'IonFooter'> {}
@Component({ selector: 'ion-footer', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class Footer {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'translucent']);
  }
}

export declare interface Grid extends StencilComponents<'IonGrid'> {}
@Component({ selector: 'ion-grid', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['fixed'] })
export class Grid {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['fixed']);
  }
}

export declare interface Header extends StencilComponents<'IonHeader'> {}
@Component({ selector: 'ion-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class Header {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'translucent']);
  }
}

export declare interface Icon extends StencilComponents<'IonIcon'> {}
@Component({ selector: 'ion-icon', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['ariaLabel', 'color', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src'] })
export class Icon {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['ariaLabel', 'color', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src']);
  }
}

export declare interface Img extends StencilComponents<'IonImg'> {}
@Component({ selector: 'ion-img', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['alt', 'src'] })
export class Img {
  ionImgDidLoad!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['alt', 'src']);
    proxyOutputs(this, el, ['ionImgDidLoad']);
  }
}

export declare interface InfiniteScroll extends StencilComponents<'IonInfiniteScroll'> {}
@Component({ selector: 'ion-infinite-scroll', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['threshold', 'disabled', 'position'] })
export class InfiniteScroll {
  ionInfinite!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['complete']);
    proxyInputs(this, el, ['threshold', 'disabled', 'position']);
    proxyOutputs(this, el, ['ionInfinite']);
  }
}

export declare interface InfiniteScrollContent extends StencilComponents<'IonInfiniteScrollContent'> {}
@Component({ selector: 'ion-infinite-scroll-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['loadingSpinner', 'loadingText'] })
export class InfiniteScrollContent {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['loadingSpinner', 'loadingText']);
  }
}

export declare interface Input extends StencilComponents<'IonInput'> {}
@Component({ selector: 'ion-input', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'spellcheck', 'step', 'size', 'type', 'value'] })
export class Input {
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

export declare interface Item extends StencilComponents<'IonItem'> {}
@Component({ selector: 'ion-item', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type'] })
export class Item {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type']);
  }
}

export declare interface ItemDivider extends StencilComponents<'IonItemDivider'> {}
@Component({ selector: 'ion-item-divider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class ItemDivider {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface ItemGroup extends StencilComponents<'IonItemGroup'> {}
@Component({ selector: 'ion-item-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class ItemGroup {
}

export declare interface ItemOption extends StencilComponents<'IonItemOption'> {}
@Component({ selector: 'ion-item-option', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'disabled', 'expandable', 'href'] })
export class ItemOption {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'disabled', 'expandable', 'href']);
  }
}

export declare interface ItemOptions extends StencilComponents<'IonItemOptions'> {}
@Component({ selector: 'ion-item-options', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['side'] })
export class ItemOptions {
  ionSwipe!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['fireSwipeEvent']);
    proxyInputs(this, el, ['side']);
    proxyOutputs(this, el, ['ionSwipe']);
  }
}

export declare interface ItemSliding extends StencilComponents<'IonItemSliding'> {}
@Component({ selector: 'ion-item-sliding', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class ItemSliding {
  ionDrag!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['getOpenAmount', 'getSlidingRatio', 'close', 'closeOpened']);
    proxyInputs(this, el, ['disabled']);
    proxyOutputs(this, el, ['ionDrag']);
  }
}

export declare interface Label extends StencilComponents<'IonLabel'> {}
@Component({ selector: 'ion-label', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'position'] })
export class Label {
  ionStyle!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'position']);
    proxyOutputs(this, el, ['ionStyle']);
  }
}

export declare interface List extends StencilComponents<'IonList'> {}
@Component({ selector: 'ion-list', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'lines', 'inset'] })
export class List {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['closeSlidingItems']);
    proxyInputs(this, el, ['mode', 'lines', 'inset']);
  }
}

export declare interface ListHeader extends StencilComponents<'IonListHeader'> {}
@Component({ selector: 'ion-list-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color'] })
export class ListHeader {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'color']);
  }
}

export declare interface Menu extends StencilComponents<'IonMenu'> {}
@Component({ selector: 'ion-menu', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['contentId', 'menuId', 'type', 'disabled', 'side', 'swipeGesture', 'maxEdgeStart'] })
export class Menu {
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

export declare interface MenuButton extends StencilComponents<'IonMenuButton'> {}
@Component({ selector: 'ion-menu-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'menu', 'autoHide'] })
export class MenuButton {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'menu', 'autoHide']);
  }
}

export declare interface MenuToggle extends StencilComponents<'IonMenuToggle'> {}
@Component({ selector: 'ion-menu-toggle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['menu', 'autoHide'] })
export class MenuToggle {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['menu', 'autoHide']);
  }
}

export declare interface Nav extends StencilComponents<'IonNav'> {}
@Component({ selector: 'ion-nav', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['delegate', 'swipeGesture', 'animated', 'animation', 'rootParams', 'root'] })
export class Nav {
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

export declare interface NavPop extends StencilComponents<'IonNavPop'> {}
@Component({ selector: 'ion-nav-pop', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class NavPop {
}

export declare interface NavPush extends StencilComponents<'IonNavPush'> {}
@Component({ selector: 'ion-nav-push', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class NavPush {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['component', 'componentProps']);
  }
}

export declare interface NavSetRoot extends StencilComponents<'IonNavSetRoot'> {}
@Component({ selector: 'ion-nav-set-root', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class NavSetRoot {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['component', 'componentProps']);
  }
}

export declare interface Note extends StencilComponents<'IonNote'> {}
@Component({ selector: 'ion-note', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class Note {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface Radio extends StencilComponents<'IonRadio'> {}
@Component({ selector: 'ion-radio', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'name', 'disabled', 'checked', 'value'] })
export class Radio {
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

export declare interface RadioGroup extends StencilComponents<'IonRadioGroup'> {}
@Component({ selector: 'ion-radio-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['allowEmptySelection', 'name', 'value'] })
export class RadioGroup {
  ionChange!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['allowEmptySelection', 'name', 'value']);
    proxyOutputs(this, el, ['ionChange']);
  }
}

export declare interface Range extends StencilComponents<'IonRange'> {}
@Component({ selector: 'ion-range', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value'] })
export class Range {
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

export declare interface Refresher extends StencilComponents<'IonRefresher'> {}
@Component({ selector: 'ion-refresher', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled'] })
export class Refresher {
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

export declare interface RefresherContent extends StencilComponents<'IonRefresherContent'> {}
@Component({ selector: 'ion-refresher-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText'] })
export class RefresherContent {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']);
  }
}

export declare interface Reorder extends StencilComponents<'IonReorder'> {}
@Component({ selector: 'ion-reorder', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class Reorder {
}

export declare interface ReorderGroup extends StencilComponents<'IonReorderGroup'> {}
@Component({ selector: 'ion-reorder-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class ReorderGroup {
  ionItemReorder!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['complete']);
    proxyInputs(this, el, ['disabled']);
    proxyOutputs(this, el, ['ionItemReorder']);
  }
}

export declare interface RippleEffect extends StencilComponents<'IonRippleEffect'> {}
@Component({ selector: 'ion-ripple-effect', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class RippleEffect {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['addRipple']);
  }
}

export declare interface Row extends StencilComponents<'IonRow'> {}
@Component({ selector: 'ion-row', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class Row {
}

export declare interface Searchbar extends StencilComponents<'IonSearchbar'> {}
@Component({ selector: 'ion-searchbar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'debounce', 'placeholder', 'searchIcon', 'showCancelButton', 'spellcheck', 'type', 'value'] })
export class Searchbar {
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

export declare interface Segment extends StencilComponents<'IonSegment'> {}
@Component({ selector: 'ion-segment', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'disabled', 'scrollable', 'value'] })
export class Segment {
  ionChange!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'disabled', 'scrollable', 'value']);
    proxyOutputs(this, el, ['ionChange', 'ionStyle']);
  }
}

export declare interface SegmentButton extends StencilComponents<'IonSegmentButton'> {}
@Component({ selector: 'ion-segment-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'checked', 'disabled', 'layout', 'value'] })
export class SegmentButton {
  ionSelect!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode', 'checked', 'disabled', 'layout', 'value']);
    proxyOutputs(this, el, ['ionSelect']);
  }
}

export declare interface Select extends StencilComponents<'IonSelect'> {}
@Component({ selector: 'ion-select', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value'] })
export class Select {
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

export declare interface SelectOption extends StencilComponents<'IonSelectOption'> {}
@Component({ selector: 'ion-select-option', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled', 'selected', 'value'] })
export class SelectOption {
  ionSelectOptionDidLoad!: EventEmitter<CustomEvent>;
  ionSelectOptionDidUnload!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['disabled', 'selected', 'value']);
    proxyOutputs(this, el, ['ionSelectOptionDidLoad', 'ionSelectOptionDidUnload']);
  }
}

export declare interface SelectPopover extends StencilComponents<'IonSelectPopover'> {}
@Component({ selector: 'ion-select-popover', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['header', 'subHeader', 'message', 'options'] })
export class SelectPopover {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['header', 'subHeader', 'message', 'options']);
  }
}

export declare interface SkeletonText extends StencilComponents<'IonSkeletonText'> {}
@Component({ selector: 'ion-skeleton-text', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['width'] })
export class SkeletonText {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['width']);
  }
}

export declare interface Slide extends StencilComponents<'IonSlide'> {}
@Component({ selector: 'ion-slide', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class Slide {
  ionSlideChanged!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyOutputs(this, el, ['ionSlideChanged']);
  }
}

export declare interface Slides extends StencilComponents<'IonSlides'> {}
@Component({ selector: 'ion-slides', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'options', 'pager', 'scrollbar'] })
export class Slides {
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

export declare interface Spinner extends StencilComponents<'IonSpinner'> {}
@Component({ selector: 'ion-spinner', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'duration', 'name', 'paused'] })
export class Spinner {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'duration', 'name', 'paused']);
  }
}

export declare interface SplitPane extends StencilComponents<'IonSplitPane'> {}
@Component({ selector: 'ion-split-pane', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled', 'when'] })
export class SplitPane {
  ionChange!: EventEmitter<CustomEvent>;
  ionSplitPaneVisible!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['disabled', 'when']);
    proxyOutputs(this, el, ['ionChange', 'ionSplitPaneVisible']);
  }
}

export declare interface Tab extends StencilComponents<'IonTab'> {}
@Component({ selector: 'ion-tab', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['active', 'delegate', 'tab', 'component'] })
export class Tab {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['setActive']);
    proxyInputs(this, el, ['active', 'delegate', 'tab', 'component']);
  }
}

export declare interface TabBar extends StencilComponents<'IonTabBar'> {}
@Component({ selector: 'ion-tab-bar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'layout', 'selectedTab', 'translucent'] })
export class TabBar {
  ionTabBarChanged!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'color', 'layout', 'selectedTab', 'translucent']);
    proxyOutputs(this, el, ['ionTabBarChanged']);
  }
}

export declare interface TabButton extends StencilComponents<'IonTabButton'> {}
@Component({ selector: 'ion-tab-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'layout', 'href', 'tab', 'disabled'] })
export class TabButton {
  ionTabButtonClick!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['mode', 'color', 'layout', 'href', 'tab', 'disabled']);
    proxyOutputs(this, el, ['ionTabButtonClick']);
  }
}

export declare interface Tabs extends StencilComponents<'IonTabs'> {}
@Component({ selector: 'ion-tabs', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['useRouter'] })
export class Tabs {
  ionChange!: EventEmitter<CustomEvent>;
  ionNavWillLoad!: EventEmitter<CustomEvent>;
  ionNavWillChange!: EventEmitter<CustomEvent>;
  ionNavDidChange!: EventEmitter<CustomEvent>;

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyMethods(this, el, ['select', 'setRouteId', 'getRouteId', 'getTab', 'getSelected']);
    proxyInputs(this, el, ['useRouter']);
    proxyOutputs(this, el, ['ionChange', 'ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']);
  }
}

export declare interface Text extends StencilComponents<'IonText'> {}
@Component({ selector: 'ion-text', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class Text {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface Textarea extends StencilComponents<'IonTextarea'> {}
@Component({ selector: 'ion-textarea', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'autocapitalize', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value'] })
export class Textarea {
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

export declare interface Thumbnail extends StencilComponents<'IonThumbnail'> {}
@Component({ selector: 'ion-thumbnail', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class Thumbnail {
}

export declare interface Toggle extends StencilComponents<'IonToggle'> {}
@Component({ selector: 'ion-toggle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'name', 'checked', 'disabled', 'value'] })
export class Toggle {
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

export declare interface Toolbar extends StencilComponents<'IonToolbar'> {}
@Component({ selector: 'ion-toolbar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class Toolbar {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color', 'mode']);
  }
}

export declare interface ToolbarTitle extends StencilComponents<'IonTitle'> {}
@Component({ selector: 'ion-title', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color'] })
export class ToolbarTitle {

  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;
    proxyInputs(this, el, ['color']);
  }
}
