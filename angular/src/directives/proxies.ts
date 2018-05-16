/* auto-generated angular directive proxies */
import { Directive, ElementRef, EventEmitter } from '@angular/core';

export function proxyInputs(instance: any, el: ElementRef, props: string[]) {
  props.forEach(propName => {
    Object.defineProperty(instance, propName, {
      get: () => el.nativeElement[propName], set: (val: any) => el.nativeElement[propName] = val
    });
  });
}

export function proxyOutputs(instance: any, events: string[]) {
  events.forEach(eventName => instance[eventName] = new EventEmitter());
}

export function proxyMethods(instance: any, ref: ElementRef, methods: string[]) {
  const el = ref.nativeElement;
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


export declare interface App extends StencilComponents.IonApp {}
@Directive({selector: 'ion-app'})
export class App {
}

export declare interface Avatar extends StencilComponents.IonAvatar {}
@Directive({selector: 'ion-avatar'})
export class Avatar {
}

export declare interface BackButton extends StencilComponents.IonBackButton {}
@Directive({selector: 'ion-back-button', inputs: ['color', 'mode', 'defaultHref', 'icon', 'text']})
export class BackButton {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'defaultHref', 'icon', 'text']);
  }
}

export declare interface Badge extends StencilComponents.IonBadge {}
@Directive({selector: 'ion-badge', inputs: ['color', 'mode']})
export class Badge {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface Button extends StencilComponents.IonButton {}
@Directive({selector: 'ion-button', inputs: ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type'], outputs: ['ionFocus', 'ionBlur']})
export class Button {
  ionFocus: EventEmitter<any>;
  ionBlur: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'buttonType', 'disabled', 'expand', 'fill', 'routerDirection', 'href', 'shape', 'size', 'strong', 'type']);
    proxyOutputs(this, ['ionFocus', 'ionBlur']);
  }
}

export declare interface Buttons extends StencilComponents.IonButtons {}
@Directive({selector: 'ion-buttons'})
export class Buttons {
}

export declare interface Card extends StencilComponents.IonCard {}
@Directive({selector: 'ion-card', inputs: ['color', 'mode']})
export class Card {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface CardContent extends StencilComponents.IonCardContent {}
@Directive({selector: 'ion-card-content', inputs: ['color', 'mode']})
export class CardContent {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface CardHeader extends StencilComponents.IonCardHeader {}
@Directive({selector: 'ion-card-header', inputs: ['color', 'mode', 'translucent']})
export class CardHeader {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'translucent']);
  }
}

export declare interface CardSubtitle extends StencilComponents.IonCardSubtitle {}
@Directive({selector: 'ion-card-subtitle', inputs: ['color', 'mode']})
export class CardSubtitle {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface CardTitle extends StencilComponents.IonCardTitle {}
@Directive({selector: 'ion-card-title', inputs: ['color', 'mode']})
export class CardTitle {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface Checkbox extends StencilComponents.IonCheckbox {}
@Directive({selector: 'ion-checkbox', inputs: ['color', 'mode', 'name', 'checked', 'disabled', 'value'], outputs: ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']})
export class Checkbox {
  ionChange: EventEmitter<any>;
  ionFocus: EventEmitter<any>;
  ionBlur: EventEmitter<any>;
  ionStyle: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'name', 'checked', 'disabled', 'value']);
    proxyOutputs(this, ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']);
  }
}

export declare interface Chip extends StencilComponents.IonChip {}
@Directive({selector: 'ion-chip', inputs: ['color', 'mode']})
export class Chip {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface ChipButton extends StencilComponents.IonChipButton {}
@Directive({selector: 'ion-chip-button', inputs: ['color', 'mode', 'disabled', 'fill', 'href']})
export class ChipButton {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'disabled', 'fill', 'href']);
  }
}

export declare interface Col extends StencilComponents.IonCol {}
@Directive({selector: 'ion-col'})
export class Col {
}

export declare interface Content extends StencilComponents.IonContent {}
@Directive({selector: 'ion-content', inputs: ['fullscreen', 'forceOverscroll', 'scrollEnabled', 'scrollEvents']})
export class Content {
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['scrollToTop', 'scrollToBottom', 'scrollByPoint', 'scrollToPoint']);
    proxyInputs(this, r, ['fullscreen', 'forceOverscroll', 'scrollEnabled', 'scrollEvents']);
  }
}

export declare interface Datetime extends StencilComponents.IonDatetime {}
@Directive({selector: 'ion-datetime', inputs: ['disabled', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value'], outputs: ['ionCancel', 'ionStyle']})
export class Datetime {
  ionCancel: EventEmitter<any>;
  ionStyle: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['disabled', 'min', 'max', 'displayFormat', 'pickerFormat', 'cancelText', 'doneText', 'yearValues', 'monthValues', 'dayValues', 'hourValues', 'minuteValues', 'monthNames', 'monthShortNames', 'dayNames', 'dayShortNames', 'pickerOptions', 'placeholder', 'value']);
    proxyOutputs(this, ['ionCancel', 'ionStyle']);
  }
}

export declare interface Fab extends StencilComponents.IonFab {}
@Directive({selector: 'ion-fab', inputs: ['horizontal', 'vertical', 'edge', 'activated']})
export class Fab {
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['close']);
    proxyInputs(this, r, ['horizontal', 'vertical', 'edge', 'activated']);
  }
}

export declare interface FabButton extends StencilComponents.IonFabButton {}
@Directive({selector: 'ion-fab-button', inputs: ['color', 'mode', 'activated', 'disabled', 'href', 'translucent', 'show']})
export class FabButton {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'activated', 'disabled', 'href', 'translucent', 'show']);
  }
}

export declare interface FabList extends StencilComponents.IonFabList {}
@Directive({selector: 'ion-fab-list', inputs: ['activated', 'side']})
export class FabList {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['activated', 'side']);
  }
}

export declare interface Footer extends StencilComponents.IonFooter {}
@Directive({selector: 'ion-footer', inputs: ['translucent']})
export class Footer {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['translucent']);
  }
}

export declare interface Grid extends StencilComponents.IonGrid {}
@Directive({selector: 'ion-grid'})
export class Grid {
}

export declare interface Header extends StencilComponents.IonHeader {}
@Directive({selector: 'ion-header', inputs: ['translucent']})
export class Header {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['translucent']);
  }
}

export declare interface HideWhen extends StencilComponents.IonHideWhen {}
@Directive({selector: 'ion-hide-when', inputs: ['orientation', 'mediaQuery', 'size', 'platform', 'or']})
export class HideWhen {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['orientation', 'mediaQuery', 'size', 'platform', 'or']);
  }
}

export declare interface Img extends StencilComponents.IonImg {}
@Directive({selector: 'ion-img', inputs: ['alt', 'src'], outputs: ['ionImgDidLoad']})
export class Img {
  ionImgDidLoad: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['alt', 'src']);
    proxyOutputs(this, ['ionImgDidLoad']);
  }
}

export declare interface InfiniteScroll extends StencilComponents.IonInfiniteScroll {}
@Directive({selector: 'ion-infinite-scroll', inputs: ['threshold', 'disabled', 'position'], outputs: ['ionInfinite']})
export class InfiniteScroll {
  ionInfinite: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['complete', 'waitFor']);
    proxyInputs(this, r, ['threshold', 'disabled', 'position']);
    proxyOutputs(this, ['ionInfinite']);
  }
}

export declare interface InfiniteScrollContent extends StencilComponents.IonInfiniteScrollContent {}
@Directive({selector: 'ion-infinite-scroll-content', inputs: ['loadingSpinner', 'loadingText']})
export class InfiniteScrollContent {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['loadingSpinner', 'loadingText']);
  }
}

export declare interface Input extends StencilComponents.IonInput {}
@Directive({selector: 'ion-input', inputs: ['accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'results', 'spellcheck', 'step', 'size', 'type', 'value'], outputs: ['ionInput', 'ionChange', 'ionStyle', 'ionBlur', 'ionFocus', 'ionInputDidLoad', 'ionInputDidUnload']})
export class Input {
  ionInput: EventEmitter<any>;
  ionChange: EventEmitter<any>;
  ionStyle: EventEmitter<any>;
  ionBlur: EventEmitter<any>;
  ionFocus: EventEmitter<any>;
  ionInputDidLoad: EventEmitter<any>;
  ionInputDidUnload: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['accept', 'autocapitalize', 'autocomplete', 'autocorrect', 'autofocus', 'clearInput', 'clearOnEdit', 'debounce', 'disabled', 'inputmode', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'name', 'pattern', 'placeholder', 'readonly', 'required', 'results', 'spellcheck', 'step', 'size', 'type', 'value']);
    proxyOutputs(this, ['ionInput', 'ionChange', 'ionStyle', 'ionBlur', 'ionFocus', 'ionInputDidLoad', 'ionInputDidUnload']);
  }
}

export declare interface Item extends StencilComponents.IonItem {}
@Directive({selector: 'ion-item', inputs: ['color', 'mode', 'button', 'detail', 'disabled', 'href', 'lines', 'routerDirection']})
export class Item {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'button', 'detail', 'disabled', 'href', 'lines', 'routerDirection']);
  }
}

export declare interface ItemDivider extends StencilComponents.IonItemDivider {}
@Directive({selector: 'ion-item-divider', inputs: ['color', 'mode']})
export class ItemDivider {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface ItemGroup extends StencilComponents.IonItemGroup {}
@Directive({selector: 'ion-item-group'})
export class ItemGroup {
}

export declare interface ItemOption extends StencilComponents.IonItemOption {}
@Directive({selector: 'ion-item-option', inputs: ['color', 'mode', 'disabled', 'expandable', 'href']})
export class ItemOption {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'disabled', 'expandable', 'href']);
  }
}

export declare interface ItemOptions extends StencilComponents.IonItemOptions {}
@Directive({selector: 'ion-item-options', inputs: ['side'], outputs: ['ionSwipe']})
export class ItemOptions {
  ionSwipe: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['isEndSide', 'width', 'fireSwipeEvent']);
    proxyInputs(this, r, ['side']);
    proxyOutputs(this, ['ionSwipe']);
  }
}

export declare interface ItemSliding extends StencilComponents.IonItemSliding {}
@Directive({selector: 'ion-item-sliding', outputs: ['ionDrag']})
export class ItemSliding {
  ionDrag: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['getOpenAmount', 'getSlidingRatio', 'close', 'closeOpened']);
    proxyOutputs(this, ['ionDrag']);
  }
}

export declare interface Label extends StencilComponents.IonLabel {}
@Directive({selector: 'ion-label', inputs: ['color', 'mode', 'position'], outputs: ['ionStyle']})
export class Label {
  ionStyle: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['getText']);
    proxyInputs(this, r, ['color', 'mode', 'position']);
    proxyOutputs(this, ['ionStyle']);
  }
}

export declare interface List extends StencilComponents.IonList {}
@Directive({selector: 'ion-list', inputs: ['lines']})
export class List {
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['getOpenItem', 'setOpenItem', 'closeSlidingItems']);
    proxyInputs(this, r, ['lines']);
  }
}

export declare interface ListHeader extends StencilComponents.IonListHeader {}
@Directive({selector: 'ion-list-header', inputs: ['color', 'mode']})
export class ListHeader {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface Menu extends StencilComponents.IonMenu {}
@Directive({selector: 'ion-menu', inputs: ['contentId', 'menuId', 'type', 'disabled', 'side', 'swipeEnabled', 'persistent', 'maxEdgeStart'], outputs: ['ionOpen', 'ionClose', 'ionMenuChange']})
export class Menu {
  ionOpen: EventEmitter<any>;
  ionClose: EventEmitter<any>;
  ionMenuChange: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['isOpen', 'open', 'close', 'toggle', 'setOpen', 'isActive']);
    proxyInputs(this, r, ['contentId', 'menuId', 'type', 'disabled', 'side', 'swipeEnabled', 'persistent', 'maxEdgeStart']);
    proxyOutputs(this, ['ionOpen', 'ionClose', 'ionMenuChange']);
  }
}

export declare interface MenuButton extends StencilComponents.IonMenuButton {}
@Directive({selector: 'ion-menu-button', inputs: ['menu', 'autoHide']})
export class MenuButton {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['menu', 'autoHide']);
  }
}

export declare interface MenuToggle extends StencilComponents.IonMenuToggle {}
@Directive({selector: 'ion-menu-toggle', inputs: ['menu', 'autoHide']})
export class MenuToggle {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['menu', 'autoHide']);
  }
}

export declare interface Nav extends StencilComponents.IonNav {}
@Directive({selector: 'ion-nav', inputs: ['swipeBackEnabled', 'animated', 'delegate', 'rootParams', 'root'], outputs: ['ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']})
export class Nav {
  ionNavWillLoad: EventEmitter<any>;
  ionNavWillChange: EventEmitter<any>;
  ionNavDidChange: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['push', 'insert', 'insertPages', 'pop', 'popTo', 'popToRoot', 'removeIndex', 'setRoot', 'setPages', 'setRouteId', 'getRouteId', 'canGoBack', 'getActive', 'getByIndex', 'getPrevious', 'length']);
    proxyInputs(this, r, ['swipeBackEnabled', 'animated', 'delegate', 'rootParams', 'root']);
    proxyOutputs(this, ['ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']);
  }
}

export declare interface NavPop extends StencilComponents.IonNavPop {}
@Directive({selector: 'ion-nav-pop'})
export class NavPop {
}

export declare interface NavPush extends StencilComponents.IonNavPush {}
@Directive({selector: 'ion-nav-push', inputs: ['component', 'componentProps']})
export class NavPush {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['component', 'componentProps']);
  }
}

export declare interface NavSetRoot extends StencilComponents.IonNavSetRoot {}
@Directive({selector: 'ion-nav-set-root', inputs: ['component', 'componentProps']})
export class NavSetRoot {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['component', 'componentProps']);
  }
}

export declare interface Note extends StencilComponents.IonNote {}
@Directive({selector: 'ion-note', inputs: ['color', 'mode']})
export class Note {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface Radio extends StencilComponents.IonRadio {}
@Directive({selector: 'ion-radio', inputs: ['color', 'mode', 'name', 'disabled', 'checked', 'value'], outputs: ['ionRadioDidLoad', 'ionRadioDidUnload', 'ionStyle', 'ionSelect', 'ionFocus', 'ionBlur']})
export class Radio {
  ionRadioDidLoad: EventEmitter<any>;
  ionRadioDidUnload: EventEmitter<any>;
  ionStyle: EventEmitter<any>;
  ionSelect: EventEmitter<any>;
  ionFocus: EventEmitter<any>;
  ionBlur: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'name', 'disabled', 'checked', 'value']);
    proxyOutputs(this, ['ionRadioDidLoad', 'ionRadioDidUnload', 'ionStyle', 'ionSelect', 'ionFocus', 'ionBlur']);
  }
}

export declare interface RadioGroup extends StencilComponents.IonRadioGroup {}
@Directive({selector: 'ion-radio-group', inputs: ['allowEmptySelection', 'name', 'disabled', 'value'], outputs: ['ionChange']})
export class RadioGroup {
  ionChange: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['allowEmptySelection', 'name', 'disabled', 'value']);
    proxyOutputs(this, ['ionChange']);
  }
}

export declare interface Range extends StencilComponents.IonRange {}
@Directive({selector: 'ion-range', inputs: ['color', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value'], outputs: ['ionChange', 'ionStyle', 'ionFocus', 'ionBlur']})
export class Range {
  ionChange: EventEmitter<any>;
  ionStyle: EventEmitter<any>;
  ionFocus: EventEmitter<any>;
  ionBlur: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'debounce', 'name', 'dualKnobs', 'min', 'max', 'pin', 'snaps', 'step', 'disabled', 'value']);
    proxyOutputs(this, ['ionChange', 'ionStyle', 'ionFocus', 'ionBlur']);
  }
}

export declare interface Refresher extends StencilComponents.IonRefresher {}
@Directive({selector: 'ion-refresher', inputs: ['pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled'], outputs: ['ionRefresh', 'ionPull', 'ionStart']})
export class Refresher {
  ionRefresh: EventEmitter<any>;
  ionPull: EventEmitter<any>;
  ionStart: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['complete', 'cancel', 'getProgress']);
    proxyInputs(this, r, ['pullMin', 'pullMax', 'closeDuration', 'snapbackDuration', 'disabled']);
    proxyOutputs(this, ['ionRefresh', 'ionPull', 'ionStart']);
  }
}

export declare interface RefresherContent extends StencilComponents.IonRefresherContent {}
@Directive({selector: 'ion-refresher-content', inputs: ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']})
export class RefresherContent {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['pullingIcon', 'pullingText', 'refreshingSpinner', 'refreshingText']);
  }
}

export declare interface Reorder extends StencilComponents.IonReorder {}
@Directive({selector: 'ion-reorder'})
export class Reorder {
}

export declare interface ReorderGroup extends StencilComponents.IonReorderGroup {}
@Directive({selector: 'ion-reorder-group', inputs: ['disabled']})
export class ReorderGroup {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['disabled']);
  }
}

export declare interface RippleEffect extends StencilComponents.IonRippleEffect {}
@Directive({selector: 'ion-ripple-effect', inputs: ['tapClick']})
export class RippleEffect {
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['addRipple']);
    proxyInputs(this, r, ['tapClick']);
  }
}

export declare interface Row extends StencilComponents.IonRow {}
@Directive({selector: 'ion-row'})
export class Row {
}

export declare interface Scroll extends StencilComponents.IonScroll {}
@Directive({selector: 'ion-scroll', inputs: ['mode', 'forceOverscroll', 'scrollEvents'], outputs: ['ionScrollStart', 'ionScroll', 'ionScrollEnd']})
export class Scroll {
  ionScrollStart: EventEmitter<any>;
  ionScroll: EventEmitter<any>;
  ionScrollEnd: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['scrollToTop', 'scrollToBottom', 'scrollByPoint', 'scrollToPoint']);
    proxyInputs(this, r, ['mode', 'forceOverscroll', 'scrollEvents']);
    proxyOutputs(this, ['ionScrollStart', 'ionScroll', 'ionScrollEnd']);
  }
}

export declare interface Searchbar extends StencilComponents.IonSearchbar {}
@Directive({selector: 'ion-searchbar', inputs: ['color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonText', 'debounce', 'placeholder', 'showCancelButton', 'spellcheck', 'type', 'value'], outputs: ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus']})
export class Searchbar {
  ionInput: EventEmitter<any>;
  ionChange: EventEmitter<any>;
  ionCancel: EventEmitter<any>;
  ionClear: EventEmitter<any>;
  ionBlur: EventEmitter<any>;
  ionFocus: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'animated', 'autocomplete', 'autocorrect', 'cancelButtonText', 'debounce', 'placeholder', 'showCancelButton', 'spellcheck', 'type', 'value']);
    proxyOutputs(this, ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus']);
  }
}

export declare interface Segment extends StencilComponents.IonSegment {}
@Directive({selector: 'ion-segment', inputs: ['color', 'mode', 'disabled', 'value'], outputs: ['ionChange']})
export class Segment {
  ionChange: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'disabled', 'value']);
    proxyOutputs(this, ['ionChange']);
  }
}

export declare interface SegmentButton extends StencilComponents.IonSegmentButton {}
@Directive({selector: 'ion-segment-button', inputs: ['color', 'mode', 'checked', 'disabled', 'href', 'value'], outputs: ['ionSelect']})
export class SegmentButton {
  ionSelect: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'checked', 'disabled', 'href', 'value']);
    proxyOutputs(this, ['ionSelect']);
  }
}

export declare interface Select extends StencilComponents.IonSelect {}
@Directive({selector: 'ion-select', inputs: ['disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value'], outputs: ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur', 'ionStyle']})
export class Select {
  ionChange: EventEmitter<any>;
  ionCancel: EventEmitter<any>;
  ionFocus: EventEmitter<any>;
  ionBlur: EventEmitter<any>;
  ionStyle: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'value']);
    proxyOutputs(this, ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur', 'ionStyle']);
  }
}

export declare interface SelectOption extends StencilComponents.IonSelectOption {}
@Directive({selector: 'ion-select-option', inputs: ['disabled', 'selected', 'value'], outputs: ['ionSelectOptionDidLoad', 'ionSelectOptionDidUnload']})
export class SelectOption {
  ionSelectOptionDidLoad: EventEmitter<any>;
  ionSelectOptionDidUnload: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['disabled', 'selected', 'value']);
    proxyOutputs(this, ['ionSelectOptionDidLoad', 'ionSelectOptionDidUnload']);
  }
}

export declare interface SelectPopover extends StencilComponents.IonSelectPopover {}
@Directive({selector: 'ion-select-popover', inputs: ['header', 'subHeader', 'message', 'options']})
export class SelectPopover {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['header', 'subHeader', 'message', 'options']);
  }
}

export declare interface ShowWhen extends StencilComponents.IonShowWhen {}
@Directive({selector: 'ion-show-when', inputs: ['orientation', 'mediaQuery', 'size', 'platform', 'or']})
export class ShowWhen {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['orientation', 'mediaQuery', 'size', 'platform', 'or']);
  }
}

export declare interface SkeletonText extends StencilComponents.IonSkeletonText {}
@Directive({selector: 'ion-skeleton-text', inputs: ['width']})
export class SkeletonText {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['width']);
  }
}

export declare interface Slide extends StencilComponents.IonSlide {}
@Directive({selector: 'ion-slide'})
export class Slide {
}

export declare interface Slides extends StencilComponents.IonSlides {}
@Directive({selector: 'ion-slides', inputs: ['options', 'pager'], outputs: ['ionSlideWillChange', 'ionSlideDidChange', 'ionSlideNextStart', 'ionSlidePrevStart', 'ionSlideNextEnd', 'ionSlidePrevEnd', 'ionSlideTransitionStart', 'ionSlideTransitionEnd', 'ionSlideDrag', 'ionSlideReachStart', 'ionSlideReachEnd', 'ionSlideTouchStart', 'ionSlideTouchEnd']})
export class Slides {
  ionSlideWillChange: EventEmitter<any>;
  ionSlideDidChange: EventEmitter<any>;
  ionSlideNextStart: EventEmitter<any>;
  ionSlidePrevStart: EventEmitter<any>;
  ionSlideNextEnd: EventEmitter<any>;
  ionSlidePrevEnd: EventEmitter<any>;
  ionSlideTransitionStart: EventEmitter<any>;
  ionSlideTransitionEnd: EventEmitter<any>;
  ionSlideDrag: EventEmitter<any>;
  ionSlideReachStart: EventEmitter<any>;
  ionSlideReachEnd: EventEmitter<any>;
  ionSlideTouchStart: EventEmitter<any>;
  ionSlideTouchEnd: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['update', 'slideTo', 'slideNext', 'slidePrev', 'getActiveIndex', 'getPreviousIndex', 'length', 'isEnd', 'isBeginning', 'startAutoplay', 'stopAutoplay', 'lockSwipeToNext', 'lockSwipeToPrev', 'lockSwipes']);
    proxyInputs(this, r, ['options', 'pager']);
    proxyOutputs(this, ['ionSlideWillChange', 'ionSlideDidChange', 'ionSlideNextStart', 'ionSlidePrevStart', 'ionSlideNextEnd', 'ionSlidePrevEnd', 'ionSlideTransitionStart', 'ionSlideTransitionEnd', 'ionSlideDrag', 'ionSlideReachStart', 'ionSlideReachEnd', 'ionSlideTouchStart', 'ionSlideTouchEnd']);
  }
}

export declare interface Spinner extends StencilComponents.IonSpinner {}
@Directive({selector: 'ion-spinner', inputs: ['color', 'mode', 'duration', 'name', 'paused']})
export class Spinner {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'duration', 'name', 'paused']);
  }
}

export declare interface SplitPane extends StencilComponents.IonSplitPane {}
@Directive({selector: 'ion-split-pane', inputs: ['disabled', 'when'], outputs: ['ionChange', 'ionSplitPaneVisible']})
export class SplitPane {
  ionChange: EventEmitter<any>;
  ionSplitPaneVisible: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['isVisible', 'isPane']);
    proxyInputs(this, r, ['disabled', 'when']);
    proxyOutputs(this, ['ionChange', 'ionSplitPaneVisible']);
  }
}

export declare interface Tab extends StencilComponents.IonTab {}
@Directive({selector: 'ion-tab', inputs: ['active', 'btnId', 'delegate', 'label', 'href', 'icon', 'badge', 'badgeColor', 'component', 'name', 'disabled', 'selected', 'show', 'tabsHideOnSubPages'], outputs: ['ionSelect']})
export class Tab {
  ionSelect: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['getTabId', 'setActive']);
    proxyInputs(this, r, ['active', 'btnId', 'delegate', 'label', 'href', 'icon', 'badge', 'badgeColor', 'component', 'name', 'disabled', 'selected', 'show', 'tabsHideOnSubPages']);
    proxyOutputs(this, ['ionSelect']);
  }
}

export declare interface Tabs extends StencilComponents.IonTabs {}
@Directive({selector: 'ion-tabs', inputs: ['color', 'name', 'tabbarHidden', 'tabbarLayout', 'tabbarPlacement', 'tabbarHighlight', 'translucent', 'scrollable', 'useRouter'], outputs: ['ionChange', 'ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']})
export class Tabs {
  ionChange: EventEmitter<any>;
  ionNavWillLoad: EventEmitter<any>;
  ionNavWillChange: EventEmitter<any>;
  ionNavDidChange: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyMethods(this, r, ['select', 'setRouteId', 'getRouteId', 'getTab', 'getSelected']);
    proxyInputs(this, r, ['color', 'name', 'tabbarHidden', 'tabbarLayout', 'tabbarPlacement', 'tabbarHighlight', 'translucent', 'scrollable', 'useRouter']);
    proxyOutputs(this, ['ionChange', 'ionNavWillLoad', 'ionNavWillChange', 'ionNavDidChange']);
  }
}

export declare interface Text extends StencilComponents.IonText {}
@Directive({selector: 'ion-text', inputs: ['color', 'mode']})
export class Text {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode']);
  }
}

export declare interface Textarea extends StencilComponents.IonTextarea {}
@Directive({selector: 'ion-textarea', inputs: ['autocapitalize', 'autocomplete', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value'], outputs: ['ionChange', 'ionInput', 'ionStyle', 'ionBlur', 'ionFocus']})
export class Textarea {
  ionChange: EventEmitter<any>;
  ionInput: EventEmitter<any>;
  ionStyle: EventEmitter<any>;
  ionBlur: EventEmitter<any>;
  ionFocus: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['autocapitalize', 'autocomplete', 'autofocus', 'clearOnEdit', 'debounce', 'disabled', 'maxlength', 'minlength', 'name', 'placeholder', 'readonly', 'required', 'spellcheck', 'cols', 'rows', 'wrap', 'value']);
    proxyOutputs(this, ['ionChange', 'ionInput', 'ionStyle', 'ionBlur', 'ionFocus']);
  }
}

export declare interface Thumbnail extends StencilComponents.IonThumbnail {}
@Directive({selector: 'ion-thumbnail'})
export class Thumbnail {
}

export declare interface Toggle extends StencilComponents.IonToggle {}
@Directive({selector: 'ion-toggle', inputs: ['color', 'mode', 'name', 'checked', 'disabled', 'value'], outputs: ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']})
export class Toggle {
  ionChange: EventEmitter<any>;
  ionFocus: EventEmitter<any>;
  ionBlur: EventEmitter<any>;
  ionStyle: EventEmitter<any>;
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'name', 'checked', 'disabled', 'value']);
    proxyOutputs(this, ['ionChange', 'ionFocus', 'ionBlur', 'ionStyle']);
  }
}

export declare interface Toolbar extends StencilComponents.IonToolbar {}
@Directive({selector: 'ion-toolbar', inputs: ['color', 'mode', 'translucent']})
export class Toolbar {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['color', 'mode', 'translucent']);
  }
}

export declare interface ToolbarTitle extends StencilComponents.IonTitle {}
@Directive({selector: 'ion-title', inputs: ['mode', 'color']})
export class ToolbarTitle {
  constructor(r: ElementRef) {
    proxyInputs(this, r, ['mode', 'color']);
  }
}
