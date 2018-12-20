/* tslint:disable */
/* auto-generated angular directive proxies */

import { fromEvent } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];

class BaseCmp {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
function proxyInputs(Cmp: any, inputs: string[]) {
  const Prototype = Cmp.prototype;
  inputs.forEach(item => {
    Object.defineProperty(Prototype, item, {
      get: function() { return this.el[item] },
      set: function(val: any) { this.el[item] = val },
    });
  });
}

function proxyOutputs(Cmp: any, events: string[]) {
  const Prototype = Cmp.prototype;
  events.forEach(item => {
    Object.defineProperty(Prototype, item, {
      get: function() {
        if (!this.events) {
          this.events = new Map();
        }
        let sub = this.events.get(item);
        if (!sub) {
          this.events.set(item, sub = fromEvent(this.el, eventName));
        }
        return sub;
      },
    });
  });
}

function proxyMethods(Cmp: any, methods: string[]) {
  const Prototype = Cmp.prototype;
  methods.forEach(methodName => {
    Prototype[methodName] = function() {
      const args = arguments;
      return this.el.componentOnReady().then((el: any) => el[methodName].apply(el, args));
    };
  });
}


export declare interface IonApp extends StencilComponents<'IonApp'> {}
@Component({ selector: 'ion-app', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonApp extends BaseCmp {
}

export declare interface IonAvatar extends StencilComponents<'IonAvatar'> {}
@Component({ selector: 'ion-avatar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonAvatar extends BaseCmp {
}

export declare interface IonBackButton extends StencilComponents<'IonBackButton'> {}
@Component({ selector: 'ion-back-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'defaultHref', 'icon', 'text'] })
export class IonBackButton extends BaseCmp {
}
proxyInputs(IonBackButton, ['color', 'mode', 'defaultHref', 'icon', 'text']);

export declare interface IonBackdrop extends StencilComponents<'IonBackdrop'> {}
@Component({ selector: 'ion-backdrop', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['visible', 'tappable', 'stopPropagation'] })
export class IonBackdrop extends BaseCmp {
  ionBackdropTap!: EventEmitter<CustomEvent>;
}
proxyInputs(IonBackdrop, ['visible', 'tappable', 'stopPropagation']);
proxyOutputs(IonBackdrop, ['ionBackdropTap']);

export declare interface IonBadge extends StencilComponents<'IonBadge'> {}
@Component({ selector: 'ion-badge', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonBadge extends BaseCmp {
}
proxyInputs(IonBadge, ['color', 'mode']);

export declare interface IonButton extends StencilComponents<'IonButton'> {}
@Component({ selector: 'ion-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type'] })
export class IonButton extends BaseCmp {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
}
proxyInputs(IonButton, ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type']);
proxyOutputs(IonButton, ['ionFocus', 'ionBlur']);

export declare interface IonButtons extends StencilComponents<'IonButtons'> {}
@Component({ selector: 'ion-buttons', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonButtons extends BaseCmp {
}

export declare interface IonCard extends StencilComponents<'IonCard'> {}
@Component({ selector: 'ion-card', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonCard extends BaseCmp {
}
proxyInputs(IonCard, ['color', 'mode']);

export declare interface IonCardContent extends StencilComponents<'IonCardContent'> {}
@Component({ selector: 'ion-card-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode'] })
export class IonCardContent extends BaseCmp {
}
proxyInputs(IonCardContent, ['mode']);

export declare interface IonCardHeader extends StencilComponents<'IonCardHeader'> {}
@Component({ selector: 'ion-card-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'translucent'] })
export class IonCardHeader extends BaseCmp {
}
proxyInputs(IonCardHeader, ['color', 'mode', 'translucent']);

export declare interface IonCardSubtitle extends StencilComponents<'IonCardSubtitle'> {}
@Component({ selector: 'ion-card-subtitle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonCardSubtitle extends BaseCmp {
}
proxyInputs(IonCardSubtitle, ['color', 'mode']);

export declare interface IonCardTitle extends StencilComponents<'IonCardTitle'> {}
@Component({ selector: 'ion-card-title', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonCardTitle extends BaseCmp {
}
proxyInputs(IonCardTitle, ['color', 'mode']);

export declare interface IonCheckbox extends StencilComponents<'IonCheckbox'> {}
@Component({ selector: 'ion-checkbox', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'name', 'checked', 'disabled', 'value'] })
export class IonCheckbox extends BaseCmp {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
}
proxyInputs(IonCheckbox, ['color', 'mode', 'name', 'checked', 'disabled', 'value']);
proxyOutputs(IonCheckbox, ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']);

export declare interface IonChip extends StencilComponents<'IonChip'> {}
@Component({ selector: 'ion-chip', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'outline'] })
export class IonChip extends BaseCmp {
}
proxyInputs(IonChip, ['color', 'mode', 'outline']);

export declare interface IonCol extends StencilComponents<'IonCol'> {}
@Component({ selector: 'ion-col', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl'] })
export class IonCol extends BaseCmp {
}
proxyInputs(IonCol, ['offset', 'offsetXs', 'offsetSm', 'offsetMd', 'offsetLg', 'offsetXl', 'pull', 'pullXs', 'pullSm', 'pullMd', 'pullLg', 'pullXl', 'push', 'pushXs', 'pushSm', 'pushMd', 'pushLg', 'pushXl', 'size', 'sizeXs', 'sizeSm', 'sizeMd', 'sizeLg', 'sizeXl']);

export declare interface IonContent extends StencilComponents<'IonContent'> {}
@Component({ selector: 'ion-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'fullscreen', 'forceOverscroll', 'scrollX', 'scrollY', 'scrollEvents'] })
export class IonContent extends BaseCmp {
  ionScrollStart!: EventEmitter<CustomEvent>;
  ionScroll!: EventEmitter<CustomEvent>;
  ionScrollEnd!: EventEmitter<CustomEvent>;
}
proxyMethods(IonContent, ['getScrollElement', 'scrollToTop', 'scrollToBottom', 'scrollByPoint', 'scrollToPoint']);
proxyInputs(IonContent, ['color', 'fullscreen', 'forceOverscroll', 'scrollX', 'scrollY', 'scrollEvents']);
proxyOutputs(IonContent, ['ionScrollStart', 'ionScroll', 'ionScrollEnd']);

export declare interface IonDatetime extends StencilComponents<'IonDatetime'> {}
@Component({ selector: 'ion-datetime', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'name', 'disabled', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value'] })
export class IonDatetime extends BaseCmp {
  ionCancel!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
}
proxyMethods(IonDatetime, ['open']);
proxyInputs(IonDatetime, ['mode', 'name', 'disabled', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value']);
proxyOutputs(IonDatetime, ['ionCancel', 'ionChange', 'ionFocus', 'ionBlur', 'ionStyle']);

export declare interface IonFab extends StencilComponents<'IonFab'> {}
@Component({ selector: 'ion-fab', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['horizontal', 'vertical', 'edge', 'activated'] })
export class IonFab extends BaseCmp {
}
proxyMethods(IonFab, ['close']);
proxyInputs(IonFab, ['horizontal', 'vertical', 'edge', 'activated']);

export declare interface IonFabButton extends StencilComponents<'IonFabButton'> {}
@Component({ selector: 'ion-fab-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type', 'size'] })
export class IonFabButton extends BaseCmp {
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
}
proxyInputs(IonFabButton, ['mode', 'color', 'activated', 'disabled', 'href', 'routerDirection', 'show', 'translucent', 'type', 'size']);
proxyOutputs(IonFabButton, ['ionFocus', 'ionBlur']);

export declare interface IonFabList extends StencilComponents<'IonFabList'> {}
@Component({ selector: 'ion-fab-list', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['activated', 'side'] })
export class IonFabList extends BaseCmp {
}
proxyInputs(IonFabList, ['activated', 'side']);

export declare interface IonFooter extends StencilComponents<'IonFooter'> {}
@Component({ selector: 'ion-footer', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class IonFooter extends BaseCmp {
}
proxyInputs(IonFooter, ['mode', 'translucent']);

export declare interface IonGrid extends StencilComponents<'IonGrid'> {}
@Component({ selector: 'ion-grid', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['fixed'] })
export class IonGrid extends BaseCmp {
}
proxyInputs(IonGrid, ['fixed']);

export declare interface IonHeader extends StencilComponents<'IonHeader'> {}
@Component({ selector: 'ion-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'translucent'] })
export class IonHeader extends BaseCmp {
}
proxyInputs(IonHeader, ['mode', 'translucent']);

export declare interface IonIcon extends StencilComponents<'IonIcon'> {}
@Component({ selector: 'ion-icon', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['ariaLabel', 'color', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src'] })
export class IonIcon extends BaseCmp {
}
proxyInputs(IonIcon, ['ariaLabel', 'color', 'icon', 'ios', 'lazy', 'md', 'mode', 'name', 'size', 'src']);

export declare interface IonImg extends StencilComponents<'IonImg'> {}
@Component({ selector: 'ion-img', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['alt', 'src'] })
export class IonImg extends BaseCmp {
  ionImgDidLoad!: EventEmitter<CustomEvent>;
}
proxyInputs(IonImg, ['alt', 'src']);
proxyOutputs(IonImg, ['ionImgDidLoad']);

export declare interface IonInfiniteScroll extends StencilComponents<'IonInfiniteScroll'> {}
@Component({ selector: 'ion-infinite-scroll', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['threshold', 'disabled', 'position'] })
export class IonInfiniteScroll extends BaseCmp {
  ionInfinite!: EventEmitter<CustomEvent>;
}
proxyMethods(IonInfiniteScroll, ['complete']);
proxyInputs(IonInfiniteScroll, ['threshold', 'disabled', 'position']);
proxyOutputs(IonInfiniteScroll, ['ionInfinite']);

export declare interface IonInfiniteScrollContent extends StencilComponents<'IonInfiniteScrollContent'> {}
@Component({ selector: 'ion-infinite-scroll-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['loadingSpinner', 'loadingText'] })
export class IonInfiniteScrollContent extends BaseCmp {
}
proxyInputs(IonInfiniteScrollContent, ['loadingSpinner', 'loadingText']);

export declare interface IonInput extends StencilComponents<'IonInput'> {}
@Component({ selector: 'ion-input', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'spellcheck', 'step', 'size', 'type', 'value'] })
export class IonInput extends BaseCmp {
  ionInput!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionInputDidLoad!: EventEmitter<CustomEvent>;
  ionInputDidUnload!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
}
proxyMethods(IonInput, ['setFocus']);
proxyInputs(IonInput, ['color', 'mode', 'accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'spellcheck', 'step', 'size', 'type', 'value']);
proxyOutputs(IonInput, ['ionInput', 'ionChange', 'ionBlur', 'ionFocus', 'ionInputDidLoad', 'ionInputDidUnload', 'ionStyle']);

export declare interface IonItem extends StencilComponents<'IonItem'> {}
@Component({ selector: 'ion-item', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type'] })
export class IonItem extends BaseCmp {
}
proxyInputs(IonItem, ['color', 'mode', 'button', 'detail', 'detailIcon', 'disabled', 'href', 'lines', 'routerDirection', 'type']);

export declare interface IonItemDivider extends StencilComponents<'IonItemDivider'> {}
@Component({ selector: 'ion-item-divider', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'sticky'] })
export class IonItemDivider extends BaseCmp {
}
proxyInputs(IonItemDivider, ['color', 'mode', 'sticky']);

export declare interface IonItemGroup extends StencilComponents<'IonItemGroup'> {}
@Component({ selector: 'ion-item-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonItemGroup extends BaseCmp {
}

export declare interface IonItemOption extends StencilComponents<'IonItemOption'> {}
@Component({ selector: 'ion-item-option', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'disabled', 'expandable', 'href'] })
export class IonItemOption extends BaseCmp {
}
proxyInputs(IonItemOption, ['color', 'mode', 'disabled', 'expandable', 'href']);

export declare interface IonItemOptions extends StencilComponents<'IonItemOptions'> {}
@Component({ selector: 'ion-item-options', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['side'] })
export class IonItemOptions extends BaseCmp {
  ionSwipe!: EventEmitter<CustomEvent>;
}
proxyMethods(IonItemOptions, ['fireSwipeEvent']);
proxyInputs(IonItemOptions, ['side']);
proxyOutputs(IonItemOptions, ['ionSwipe']);

export declare interface IonItemSliding extends StencilComponents<'IonItemSliding'> {}
@Component({ selector: 'ion-item-sliding', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class IonItemSliding extends BaseCmp {
  ionDrag!: EventEmitter<CustomEvent>;
}
proxyMethods(IonItemSliding, ['getOpenAmount', 'getSlidingRatio', 'close', 'closeOpened']);
proxyInputs(IonItemSliding, ['disabled']);
proxyOutputs(IonItemSliding, ['ionDrag']);

export declare interface IonLabel extends StencilComponents<'IonLabel'> {}
@Component({ selector: 'ion-label', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'position'] })
export class IonLabel extends BaseCmp {
  ionStyle!: EventEmitter<CustomEvent>;
}
proxyInputs(IonLabel, ['color', 'mode', 'position']);
proxyOutputs(IonLabel, ['ionStyle']);

export declare interface IonList extends StencilComponents<'IonList'> {}
@Component({ selector: 'ion-list', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'lines', 'inset'] })
export class IonList extends BaseCmp {
}
proxyMethods(IonList, ['closeSlidingItems']);
proxyInputs(IonList, ['mode', 'lines', 'inset']);

export declare interface IonListHeader extends StencilComponents<'IonListHeader'> {}
@Component({ selector: 'ion-list-header', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color'] })
export class IonListHeader extends BaseCmp {
}
proxyInputs(IonListHeader, ['mode', 'color']);

export declare interface IonMenu extends StencilComponents<'IonMenu'> {}
@Component({ selector: 'ion-menu', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['contentId', 'menuId', 'type', 'disabled', 'side', 'swipeGesture', 'maxEdgeStart'] })
export class IonMenu extends BaseCmp {
  ionWillOpen!: EventEmitter<CustomEvent>;
  ionWillClose!: EventEmitter<CustomEvent>;
  ionDidOpen!: EventEmitter<CustomEvent>;
  ionDidClose!: EventEmitter<CustomEvent>;
  ionMenuChange!: EventEmitter<CustomEvent>;
}
proxyMethods(IonMenu, ['isOpen', 'isActive', 'open', 'close', 'toggle', 'setOpen']);
proxyInputs(IonMenu, ['contentId', 'menuId', 'type', 'disabled', 'side', 'swipeGesture', 'maxEdgeStart']);
proxyOutputs(IonMenu, ['ionWillOpen', 'ionWillClose', 'ionDidOpen', 'ionDidClose', 'ionMenuChange']);

export declare interface IonMenuButton extends StencilComponents<'IonMenuButton'> {}
@Component({ selector: 'ion-menu-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'menu', 'autoHide'] })
export class IonMenuButton extends BaseCmp {
}
proxyInputs(IonMenuButton, ['color', 'mode', 'menu', 'autoHide']);

export declare interface IonMenuToggle extends StencilComponents<'IonMenuToggle'> {}
@Component({ selector: 'ion-menu-toggle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['menu', 'autoHide'] })
export class IonMenuToggle extends BaseCmp {
}
proxyInputs(IonMenuToggle, ['menu', 'autoHide']);

export declare interface IonNav extends StencilComponents<'IonNav'> {}
@Component({ selector: 'ion-nav', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['delegate', 'swipeGesture', 'animated', 'animation', 'rootParams', 'root'] })
export class IonNav extends BaseCmp {
  ionNavWillLoad!: EventEmitter<CustomEvent>;
  ionNavWillChange!: EventEmitter<CustomEvent>;
  ionNavDidChange!: EventEmitter<CustomEvent>;
}
proxyMethods(IonNav, ['push', 'insert', 'insertPages', 'pop', 'popTo', 'popToRoot', 'removeIndex', 'setRoot', 'setPages', 'setRouteId', 'getRouteId', 'getActive', 'getByIndex', 'canGoBack', 'getPrevious']);
proxyInputs(IonNav, ['delegate', 'swipeGesture', 'animated', 'animation', 'rootParams', 'root']);
proxyOutputs(IonNav, ['ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']);

export declare interface IonNavPop extends StencilComponents<'IonNavPop'> {}
@Component({ selector: 'ion-nav-pop', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonNavPop extends BaseCmp {
}

export declare interface IonNavPush extends StencilComponents<'IonNavPush'> {}
@Component({ selector: 'ion-nav-push', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class IonNavPush extends BaseCmp {
}
proxyInputs(IonNavPush, ['component', 'componentProps']);

export declare interface IonNavSetRoot extends StencilComponents<'IonNavSetRoot'> {}
@Component({ selector: 'ion-nav-set-root', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['component', 'componentProps'] })
export class IonNavSetRoot extends BaseCmp {
}
proxyInputs(IonNavSetRoot, ['component', 'componentProps']);

export declare interface IonNote extends StencilComponents<'IonNote'> {}
@Component({ selector: 'ion-note', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonNote extends BaseCmp {
}
proxyInputs(IonNote, ['color', 'mode']);

export declare interface IonProgressBar extends StencilComponents<'IonProgressBar'> {}
@Component({ selector: 'ion-progress-bar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'type', 'reversed', 'value', 'buffer', 'color'] })
export class IonProgressBar extends BaseCmp {
}
proxyInputs(IonProgressBar, ['mode', 'type', 'reversed', 'value', 'buffer', 'color']);

export declare interface IonRadio extends StencilComponents<'IonRadio'> {}
@Component({ selector: 'ion-radio', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'name', 'disabled', 'checked', 'value'] })
export class IonRadio extends BaseCmp {
  ionRadioDidLoad!: EventEmitter<CustomEvent>;
  ionRadioDidUnload!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
  ionSelect!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
}
proxyInputs(IonRadio, ['color', 'mode', 'name', 'disabled', 'checked', 'value']);
proxyOutputs(IonRadio, ['ionRadioDidLoad', 'ionRadioDidUnload', 'ionStyle', 'ionSelect', 'ionFocus', 'ionBlur']);

export declare interface IonRadioGroup extends StencilComponents<'IonRadioGroup'> {}
@Component({ selector: 'ion-radio-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['allowEmptySelection', 'name', 'value'] })
export class IonRadioGroup extends BaseCmp {
  ionChange!: EventEmitter<CustomEvent>;
}
proxyInputs(IonRadioGroup, ['allowEmptySelection', 'name', 'value']);
proxyOutputs(IonRadioGroup, ['ionChange']);

export declare interface IonRange extends StencilComponents<'IonRange'> {}
@Component({ selector: 'ion-range', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value'] })
export class IonRange extends BaseCmp {
  ionChange!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
}
proxyInputs(IonRange, ['color', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value']);
proxyOutputs(IonRange, ['ionChange', 'ionStyle', 'ionFocus', 'ionBlur']);

export declare interface IonRefresher extends StencilComponents<'IonRefresher'> {}
@Component({ selector: 'ion-refresher', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled'] })
export class IonRefresher extends BaseCmp {
  ionRefresh!: EventEmitter<CustomEvent>;
  ionPull!: EventEmitter<CustomEvent>;
  ionStart!: EventEmitter<CustomEvent>;
}
proxyMethods(IonRefresher, ['complete', 'cancel', 'getProgress']);
proxyInputs(IonRefresher, ['pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled']);
proxyOutputs(IonRefresher, ['ionRefresh', 'ionPull', 'ionStart']);

export declare interface IonRefresherContent extends StencilComponents<'IonRefresherContent'> {}
@Component({ selector: 'ion-refresher-content', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText'] })
export class IonRefresherContent extends BaseCmp {
}
proxyInputs(IonRefresherContent, ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']);

export declare interface IonReorder extends StencilComponents<'IonReorder'> {}
@Component({ selector: 'ion-reorder', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonReorder extends BaseCmp {
}

export declare interface IonReorderGroup extends StencilComponents<'IonReorderGroup'> {}
@Component({ selector: 'ion-reorder-group', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class IonReorderGroup extends BaseCmp {
  ionItemReorder!: EventEmitter<CustomEvent>;
}
proxyMethods(IonReorderGroup, ['complete']);
proxyInputs(IonReorderGroup, ['disabled']);
proxyOutputs(IonReorderGroup, ['ionItemReorder']);

export declare interface IonRippleEffect extends StencilComponents<'IonRippleEffect'> {}
@Component({ selector: 'ion-ripple-effect', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['type'] })
export class IonRippleEffect extends BaseCmp {
}
proxyMethods(IonRippleEffect, ['addRipple']);
proxyInputs(IonRippleEffect, ['type']);

export declare interface IonRow extends StencilComponents<'IonRow'> {}
@Component({ selector: 'ion-row', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonRow extends BaseCmp {
}

export declare interface IonSearchbar extends StencilComponents<'IonSearchbar'> {}
@Component({ selector: 'ion-searchbar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'debounce', 'placeholder', 'searchIcon', 'showCancelButton', 'spellcheck', 'type', 'value'] })
export class IonSearchbar extends BaseCmp {
  ionInput!: EventEmitter<CustomEvent>;
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionClear!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
}
proxyMethods(IonSearchbar, ['setFocus']);
proxyInputs(IonSearchbar, ['color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonIcon', 'cancelButtonText', 'clearIcon', 'debounce', 'placeholder', 'searchIcon', 'showCancelButton', 'spellcheck', 'type', 'value']);
proxyOutputs(IonSearchbar, ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus']);

export declare interface IonSegment extends StencilComponents<'IonSegment'> {}
@Component({ selector: 'ion-segment', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode', 'disabled', 'scrollable', 'value'] })
export class IonSegment extends BaseCmp {
  ionChange!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
}
proxyInputs(IonSegment, ['color', 'mode', 'disabled', 'scrollable', 'value']);
proxyOutputs(IonSegment, ['ionChange', 'ionStyle']);

export declare interface IonSegmentButton extends StencilComponents<'IonSegmentButton'> {}
@Component({ selector: 'ion-segment-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'checked', 'disabled', 'layout', 'value'] })
export class IonSegmentButton extends BaseCmp {
  ionSelect!: EventEmitter<CustomEvent>;
}
proxyInputs(IonSegmentButton, ['mode', 'checked', 'disabled', 'layout', 'value']);
proxyOutputs(IonSegmentButton, ['ionSelect']);

export declare interface IonSelect extends StencilComponents<'IonSelect'> {}
@Component({ selector: 'ion-select', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value'] })
export class IonSelect extends BaseCmp {
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
}
proxyMethods(IonSelect, ['open']);
proxyInputs(IonSelect, ['mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value']);
proxyOutputs(IonSelect, ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur', 'ionStyle']);

export declare interface IonSelectOption extends StencilComponents<'IonSelectOption'> {}
@Component({ selector: 'ion-select-option', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['disabled', 'selected', 'value'] })
export class IonSelectOption extends BaseCmp {
  ionSelectOptionDidLoad!: EventEmitter<CustomEvent>;
  ionSelectOptionDidUnload!: EventEmitter<CustomEvent>;
}
proxyInputs(IonSelectOption, ['disabled', 'selected', 'value']);
proxyOutputs(IonSelectOption, ['ionSelectOptionDidLoad', 'ionSelectOptionDidUnload']);

export declare interface IonSelectPopover extends StencilComponents<'IonSelectPopover'> {}
@Component({ selector: 'ion-select-popover', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['header', 'subHeader', 'message', 'options'] })
export class IonSelectPopover extends BaseCmp {
}
proxyInputs(IonSelectPopover, ['header', 'subHeader', 'message', 'options']);

export declare interface IonSkeletonText extends StencilComponents<'IonSkeletonText'> {}
@Component({ selector: 'ion-skeleton-text', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['width'] })
export class IonSkeletonText extends BaseCmp {
}
proxyInputs(IonSkeletonText, ['width']);

export declare interface IonSlide extends StencilComponents<'IonSlide'> {}
@Component({ selector: 'ion-slide', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonSlide extends BaseCmp {
  ionSlideChanged!: EventEmitter<CustomEvent>;
}
proxyOutputs(IonSlide, ['ionSlideChanged']);

export declare interface IonSlides extends StencilComponents<'IonSlides'> {}
@Component({ selector: 'ion-slides', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'options', 'pager', 'scrollbar'] })
export class IonSlides extends BaseCmp {
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
}
proxyMethods(IonSlides, ['update', 'slideTo', 'slideNext', 'slidePrev', 'getActiveIndex', 'getPreviousIndex', 'length', 'isEnd', 'isBeginning', 'startAutoplay', 'stopAutoplay', 'lockSwipeToNext', 'lockSwipeToPrev', 'lockSwipes']);
proxyInputs(IonSlides, ['mode', 'options', 'pager', 'scrollbar']);
proxyOutputs(IonSlides, ['ionSlidesDidLoad', 'ionSlideTap', 'ionSlideDoubleTap', 'ionSlideWillChange', 'ionSlideDidChange', 'ionSlideNextStart', 'ionSlidePrevStart', 'ionSlideNextEnd', 'ionSlidePrevEnd', 'ionSlideTransitionStart', 'ionSlideTransitionEnd', 'ionSlideDrag', 'ionSlideReachStart', 'ionSlideReachEnd', 'ionSlideTouchStart', 'ionSlideTouchEnd']);

export declare interface IonSpinner extends StencilComponents<'IonSpinner'> {}
@Component({ selector: 'ion-spinner', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'duration', 'name', 'paused'] })
export class IonSpinner extends BaseCmp {
}
proxyInputs(IonSpinner, ['color', 'duration', 'name', 'paused']);

export declare interface IonSplitPane extends StencilComponents<'IonSplitPane'> {}
@Component({ selector: 'ion-split-pane', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['contentId', 'disabled', 'when'] })
export class IonSplitPane extends BaseCmp {
  ionChange!: EventEmitter<CustomEvent>;
  ionSplitPaneVisible!: EventEmitter<CustomEvent>;
}
proxyInputs(IonSplitPane, ['contentId', 'disabled', 'when']);
proxyOutputs(IonSplitPane, ['ionChange', 'ionSplitPaneVisible']);

export declare interface IonTabBar extends StencilComponents<'IonTabBar'> {}
@Component({ selector: 'ion-tab-bar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'selectedTab', 'translucent'] })
export class IonTabBar extends BaseCmp {
  ionTabBarChanged!: EventEmitter<CustomEvent>;
}
proxyInputs(IonTabBar, ['mode', 'color', 'selectedTab', 'translucent']);
proxyOutputs(IonTabBar, ['ionTabBarChanged']);

export declare interface IonTabButton extends StencilComponents<'IonTabButton'> {}
@Component({ selector: 'ion-tab-button', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'layout', 'href', 'tab', 'disabled'] })
export class IonTabButton extends BaseCmp {
  ionTabButtonClick!: EventEmitter<CustomEvent>;
}
proxyInputs(IonTabButton, ['mode', 'layout', 'href', 'tab', 'disabled']);
proxyOutputs(IonTabButton, ['ionTabButtonClick']);

export declare interface IonText extends StencilComponents<'IonText'> {}
@Component({ selector: 'ion-text', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonText extends BaseCmp {
}
proxyInputs(IonText, ['color', 'mode']);

export declare interface IonTextarea extends StencilComponents<'IonTextarea'> {}
@Component({ selector: 'ion-textarea', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'autocapitalize', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value'] })
export class IonTextarea extends BaseCmp {
  ionChange!: EventEmitter<CustomEvent>;
  ionInput!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
}
proxyMethods(IonTextarea, ['setFocus']);
proxyInputs(IonTextarea, ['mode', 'color', 'autocapitalize', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value']);
proxyOutputs(IonTextarea, ['ionChange', 'ionInput', 'ionStyle', 'ionBlur', 'ionFocus']);

export declare interface IonThumbnail extends StencilComponents<'IonThumbnail'> {}
@Component({ selector: 'ion-thumbnail', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>' })
export class IonThumbnail extends BaseCmp {
}

export declare interface IonTitle extends StencilComponents<'IonTitle'> {}
@Component({ selector: 'ion-title', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color'] })
export class IonTitle extends BaseCmp {
}
proxyInputs(IonTitle, ['color']);

export declare interface IonToggle extends StencilComponents<'IonToggle'> {}
@Component({ selector: 'ion-toggle', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['mode', 'color', 'name', 'checked', 'disabled', 'value'] })
export class IonToggle extends BaseCmp {
  ionChange!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  ionStyle!: EventEmitter<CustomEvent>;
}
proxyInputs(IonToggle, ['mode', 'color', 'name', 'checked', 'disabled', 'value']);
proxyOutputs(IonToggle, ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']);

export declare interface IonToolbar extends StencilComponents<'IonToolbar'> {}
@Component({ selector: 'ion-toolbar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: '<ng-content></ng-content>', inputs: ['color', 'mode'] })
export class IonToolbar extends BaseCmp {
}
proxyInputs(IonToolbar, ['color', 'mode']);
