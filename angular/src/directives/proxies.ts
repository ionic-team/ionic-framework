/* angular directive proxies */
import { Directive, ElementRef, EventEmitter } from '@angular/core';

function inputs(instance: any, el: ElementRef, props: string[]) {
  props.forEach(propName => {
    Object.defineProperty(instance, propName, {
      get: () => el.nativeElement[propName], set: (val: any) => el.nativeElement[propName] = val
    });
  });
}

function outputs(instance: any, events: string[]) {
  events.forEach(eventName => {
    instance[eventName] = new EventEmitter();
  });
}

function methods(instance: any, ref: ElementRef, methods: string[]) {
  const el = ref.nativeElement;
  methods.forEach(methodName => {
    Object.defineProperty(instance, methodName, {
      get: function() {
        const args = arguments;
        return el.componentOnReady()
          .then((el: any) => el[methodName].apply(el, args));
      }
    });
  });
}

const accept = 'accept', activated = 'activated', active = 'active', addRipple = 'addRipple', allowEmptySelection = 'allowEmptySelection', animated = 'animated', autoHide = 'autoHide', autocapitalize = 'autocapitalize', autocomplete = 'autocomplete', autocorrect = 'autocorrect', autofocus = 'autofocus', badge = 'badge', badgeStyle = 'badgeStyle', btnId = 'btnId', button = 'button', buttonType = 'buttonType', canGoBack = 'canGoBack', cancel = 'cancel', cancelButtonText = 'cancelButtonText', cancelText = 'cancelText', checked = 'checked', clearInput = 'clearInput', clearOnEdit = 'clearOnEdit', close = 'close', closeDuration = 'closeDuration', closeOpened = 'closeOpened', closeSlidingItems = 'closeSlidingItems', color = 'color', cols = 'cols', complete = 'complete', component = 'component', componentProps = 'componentProps', contentId = 'contentId', dayNames = 'dayNames', dayShortNames = 'dayShortNames', dayValues = 'dayValues', debounce = 'debounce', defaultHref = 'defaultHref', delegate = 'delegate', detail = 'detail', disabled = 'disabled', displayFormat = 'displayFormat', doneText = 'doneText', dualKnobs = 'dualKnobs', duration = 'duration', edge = 'edge', expand = 'expand', expandable = 'expandable', fill = 'fill', fireSwipeEvent = 'fireSwipeEvent', forceOverscroll = 'forceOverscroll', fullscreen = 'fullscreen', getActive = 'getActive', getActiveIndex = 'getActiveIndex', getByIndex = 'getByIndex', getOpenAmount = 'getOpenAmount', getOpenItem = 'getOpenItem', getPrevious = 'getPrevious', getPreviousIndex = 'getPreviousIndex', getProgress = 'getProgress', getRouteId = 'getRouteId', getSelected = 'getSelected', getSlidingRatio = 'getSlidingRatio', getTab = 'getTab', getTabId = 'getTabId', getText = 'getText', header = 'header', horizontal = 'horizontal', hourValues = 'hourValues', href = 'href', icon = 'icon', inputmode = 'inputmode', insert = 'insert', insertPages = 'insertPages', interfaceOptions = 'interfaceOptions', ionBlur = 'ionBlur', ionCancel = 'ionCancel', ionChange = 'ionChange', ionClear = 'ionClear', ionClick = 'ionClick', ionClose = 'ionClose', ionDrag = 'ionDrag', ionFocus = 'ionFocus', ionInfinite = 'ionInfinite', ionInput = 'ionInput', ionInputDidLoad = 'ionInputDidLoad', ionInputDidUnload = 'ionInputDidUnload', ionMenuChange = 'ionMenuChange', ionNavDidChange = 'ionNavDidChange', ionNavWillChange = 'ionNavWillChange', ionOpen = 'ionOpen', ionPull = 'ionPull', ionRadioDidLoad = 'ionRadioDidLoad', ionRadioDidUnload = 'ionRadioDidUnload', ionRefresh = 'ionRefresh', ionScroll = 'ionScroll', ionScrollEnd = 'ionScrollEnd', ionScrollStart = 'ionScrollStart', ionSelect = 'ionSelect', ionSelectOptionDidLoad = 'ionSelectOptionDidLoad', ionSelectOptionDidUnload = 'ionSelectOptionDidUnload', ionSlideDidChange = 'ionSlideDidChange', ionSlideDrag = 'ionSlideDrag', ionSlideNextEnd = 'ionSlideNextEnd', ionSlideNextStart = 'ionSlideNextStart', ionSlidePrevEnd = 'ionSlidePrevEnd', ionSlidePrevStart = 'ionSlidePrevStart', ionSlideReachEnd = 'ionSlideReachEnd', ionSlideReachStart = 'ionSlideReachStart', ionSlideTouchEnd = 'ionSlideTouchEnd', ionSlideTouchStart = 'ionSlideTouchStart', ionSlideTransitionEnd = 'ionSlideTransitionEnd', ionSlideTransitionStart = 'ionSlideTransitionStart', ionSlideWillChange = 'ionSlideWillChange', ionSplitPaneVisible = 'ionSplitPaneVisible', ionStart = 'ionStart', ionStyle = 'ionStyle', ionSwipe = 'ionSwipe', isActive = 'isActive', isBeginning = 'isBeginning', isEnd = 'isEnd', isOpen = 'isOpen', isPane = 'isPane', isRightSide = 'isRightSide', isVisible = 'isVisible', label = 'label', length = 'length', loadingSpinner = 'loadingSpinner', loadingText = 'loadingText', lockSwipeToNext = 'lockSwipeToNext', lockSwipeToPrev = 'lockSwipeToPrev', lockSwipes = 'lockSwipes', max = 'max', maxEdgeStart = 'maxEdgeStart', maxlength = 'maxlength', mediaQuery = 'mediaQuery', menu = 'menu', menuId = 'menuId', message = 'message', min = 'min', minlength = 'minlength', minuteValues = 'minuteValues', mode = 'mode', monthNames = 'monthNames', monthShortNames = 'monthShortNames', monthValues = 'monthValues', multiple = 'multiple', name = 'name', okText = 'okText', open = 'open', options = 'options', or = 'or', orientation = 'orientation', pager = 'pager', pattern = 'pattern', paused = 'paused', persistent = 'persistent', pickerFormat = 'pickerFormat', pickerOptions = 'pickerOptions', pin = 'pin', placeholder = 'placeholder', platform = 'platform', pop = 'pop', popTo = 'popTo', popToRoot = 'popToRoot', position = 'position', pullMax = 'pullMax', pullMin = 'pullMin', pullingIcon = 'pullingIcon', pullingText = 'pullingText', push = 'push', ratio = 'ratio', ratioUpper = 'ratioUpper', readonly = 'readonly', refreshingSpinner = 'refreshingSpinner', refreshingText = 'refreshingText', removeIndex = 'removeIndex', required = 'required', results = 'results', root = 'root', rootParams = 'rootParams', round = 'round', routerDirection = 'routerDirection', rows = 'rows', scrollByPoint = 'scrollByPoint', scrollEnabled = 'scrollEnabled', scrollEvents = 'scrollEvents', scrollToBottom = 'scrollToBottom', scrollToPoint = 'scrollToPoint', scrollToTop = 'scrollToTop', scrollable = 'scrollable', select = 'select', selected = 'selected', selectedText = 'selectedText', setActive = 'setActive', setOpen = 'setOpen', setOpenItem = 'setOpenItem', setPages = 'setPages', setRoot = 'setRoot', setRouteId = 'setRouteId', show = 'show', showCancelButton = 'showCancelButton', side = 'side', size = 'size', slideNext = 'slideNext', slidePrev = 'slidePrev', slideTo = 'slideTo', snapbackDuration = 'snapbackDuration', snaps = 'snaps', spellcheck = 'spellcheck', startAutoplay = 'startAutoplay', step = 'step', stopAutoplay = 'stopAutoplay', strong = 'strong', subHeader = 'subHeader', swipeBackEnabled = 'swipeBackEnabled', swipeEnabled = 'swipeEnabled', tabbarHidden = 'tabbarHidden', tabbarHighlight = 'tabbarHighlight', tabbarLayout = 'tabbarLayout', tabbarPlacement = 'tabbarPlacement', tabsHideOnSubPages = 'tabsHideOnSubPages', tapClick = 'tapClick', text = 'text', threshold = 'threshold', toggle = 'toggle', translucent = 'translucent', type = 'type', update = 'update', url = 'url', useRouter = 'useRouter', value = 'value', vertical = 'vertical', waitFor = 'waitFor', when = 'when', width = 'width', wrap = 'wrap', yearValues = 'yearValues';

export declare interface App extends StencilComponents.IonApp {}
@Directive({selector: 'ion-app'})
export class App {
}

export declare interface Avatar extends StencilComponents.IonAvatar {}
@Directive({selector: 'ion-avatar'})
export class Avatar {
}

export declare interface BackButton extends StencilComponents.IonBackButton {}
@Directive({selector: 'ion-back-button', inputs: [color, mode, defaultHref, icon, text]})
export class BackButton {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, defaultHref, icon, text]);
  }
}

export declare interface Badge extends StencilComponents.IonBadge {}
@Directive({selector: 'ion-badge', inputs: [color, mode]})
export class Badge {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface Button extends StencilComponents.IonButton {}
@Directive({selector: 'ion-button', inputs: [color, mode, buttonType, disabled, expand, fill, routerDirection, href, round, size, strong, type], outputs: [ionFocus, ionBlur]})
export class Button {
  ionFocus!: EventEmitter<any>;
  ionBlur!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, buttonType, disabled, expand, fill, routerDirection, href, round, size, strong, type]);
    outputs(this, [ionFocus, ionBlur]);
  }
}

export declare interface Buttons extends StencilComponents.IonButtons {}
@Directive({selector: 'ion-buttons'})
export class Buttons {
}

export declare interface Card extends StencilComponents.IonCard {}
@Directive({selector: 'ion-card', inputs: [color, mode]})
export class Card {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface CardContent extends StencilComponents.IonCardContent {}
@Directive({selector: 'ion-card-content', inputs: [color, mode]})
export class CardContent {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface CardHeader extends StencilComponents.IonCardHeader {}
@Directive({selector: 'ion-card-header', inputs: [color, mode, translucent]})
export class CardHeader {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, translucent]);
  }
}

export declare interface CardSubtitle extends StencilComponents.IonCardSubtitle {}
@Directive({selector: 'ion-card-subtitle', inputs: [color, mode]})
export class CardSubtitle {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface CardTitle extends StencilComponents.IonCardTitle {}
@Directive({selector: 'ion-card-title', inputs: [color, mode]})
export class CardTitle {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface Checkbox extends StencilComponents.IonCheckbox {}
@Directive({selector: 'ion-checkbox', inputs: [color, mode, name, checked, disabled, value], outputs: [ionChange, ionFocus, ionBlur, ionStyle]})
export class Checkbox {
  ionChange!: EventEmitter<any>;
  ionFocus!: EventEmitter<any>;
  ionBlur!: EventEmitter<any>;
  ionStyle!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, name, checked, disabled, value]);
    outputs(this, [ionChange, ionFocus, ionBlur, ionStyle]);
  }
}

export declare interface Chip extends StencilComponents.IonChip {}
@Directive({selector: 'ion-chip', inputs: [color, mode]})
export class Chip {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface ChipButton extends StencilComponents.IonChipButton {}
@Directive({selector: 'ion-chip-button', inputs: [color, mode, disabled, fill, href]})
export class ChipButton {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, disabled, fill, href]);
  }
}

export declare interface Col extends StencilComponents.IonCol {}
@Directive({selector: 'ion-col'})
export class Col {
}

export declare interface Content extends StencilComponents.IonContent {}
@Directive({selector: 'ion-content', inputs: [fullscreen, forceOverscroll, scrollEnabled, scrollEvents]})
export class Content {
  constructor(r: ElementRef) {
    methods(this, r, [scrollToTop, scrollToBottom, scrollByPoint, scrollToPoint]);
    inputs(this, r, [fullscreen, forceOverscroll, scrollEnabled, scrollEvents]);
  }
}

export declare interface Datetime extends StencilComponents.IonDatetime {}
@Directive({selector: 'ion-datetime', inputs: [disabled, min, max, displayFormat, pickerFormat, cancelText, doneText, yearValues, monthValues, dayValues, hourValues, minuteValues, monthNames, monthShortNames, dayNames, dayShortNames, pickerOptions, placeholder, value], outputs: [ionCancel, ionStyle]})
export class Datetime {
  ionCancel!: EventEmitter<any>;
  ionStyle!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [disabled, min, max, displayFormat, pickerFormat, cancelText, doneText, yearValues, monthValues, dayValues, hourValues, minuteValues, monthNames, monthShortNames, dayNames, dayShortNames, pickerOptions, placeholder, value]);
    outputs(this, [ionCancel, ionStyle]);
  }
}

export declare interface Fab extends StencilComponents.IonFab {}
@Directive({selector: 'ion-fab', inputs: [horizontal, vertical, edge, activated]})
export class Fab {
  constructor(r: ElementRef) {
    methods(this, r, [close]);
    inputs(this, r, [horizontal, vertical, edge, activated]);
  }
}

export declare interface FabButton extends StencilComponents.IonFabButton {}
@Directive({selector: 'ion-fab-button', inputs: [color, mode, activated, disabled, href, translucent, show]})
export class FabButton {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, activated, disabled, href, translucent, show]);
  }
}

export declare interface FabList extends StencilComponents.IonFabList {}
@Directive({selector: 'ion-fab-list', inputs: [activated, side]})
export class FabList {
  constructor(r: ElementRef) {
    inputs(this, r, [activated, side]);
  }
}

export declare interface Footer extends StencilComponents.IonFooter {}
@Directive({selector: 'ion-footer', inputs: [translucent]})
export class Footer {
  constructor(r: ElementRef) {
    inputs(this, r, [translucent]);
  }
}

export declare interface Grid extends StencilComponents.IonGrid {}
@Directive({selector: 'ion-grid'})
export class Grid {
}

export declare interface Header extends StencilComponents.IonHeader {}
@Directive({selector: 'ion-header', inputs: [translucent]})
export class Header {
  constructor(r: ElementRef) {
    inputs(this, r, [translucent]);
  }
}

export declare interface HideWhen extends StencilComponents.IonHideWhen {}
@Directive({selector: 'ion-hide-when', inputs: [orientation, mediaQuery, size, mode, platform, or]})
export class HideWhen {
  constructor(r: ElementRef) {
    inputs(this, r, [orientation, mediaQuery, size, mode, platform, or]);
  }
}

export declare interface InfiniteScroll extends StencilComponents.IonInfiniteScroll {}
@Directive({selector: 'ion-infinite-scroll', inputs: [threshold, disabled, position], outputs: [ionInfinite]})
export class InfiniteScroll {
  ionInfinite!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [complete, waitFor]);
    inputs(this, r, [threshold, disabled, position]);
    outputs(this, [ionInfinite]);
  }
}

export declare interface InfiniteScrollContent extends StencilComponents.IonInfiniteScrollContent {}
@Directive({selector: 'ion-infinite-scroll-content', inputs: [loadingSpinner, loadingText]})
export class InfiniteScrollContent {
  constructor(r: ElementRef) {
    inputs(this, r, [loadingSpinner, loadingText]);
  }
}

export declare interface Input extends StencilComponents.IonInput {}
@Directive({selector: 'ion-input', inputs: [accept, autocapitalize, autocomplete, autocorrect, autofocus, checked, clearInput, clearOnEdit, debounce, disabled, inputmode, max, maxlength, min, minlength, multiple, name, pattern, placeholder, readonly, required, results, spellcheck, step, size, type, value], outputs: [ionInput, ionStyle, ionBlur, ionFocus, ionInputDidLoad, ionInputDidUnload]})
export class Input {
  ionInput!: EventEmitter<any>;
  ionStyle!: EventEmitter<any>;
  ionBlur!: EventEmitter<any>;
  ionFocus!: EventEmitter<any>;
  ionInputDidLoad!: EventEmitter<any>;
  ionInputDidUnload!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [accept, autocapitalize, autocomplete, autocorrect, autofocus, checked, clearInput, clearOnEdit, debounce, disabled, inputmode, max, maxlength, min, minlength, multiple, name, pattern, placeholder, readonly, required, results, spellcheck, step, size, type, value]);
    outputs(this, [ionInput, ionStyle, ionBlur, ionFocus, ionInputDidLoad, ionInputDidUnload]);
  }
}

export declare interface Item extends StencilComponents.IonItem {}
@Directive({selector: 'ion-item', inputs: [color, mode, detail, disabled, href, button, routerDirection]})
export class Item {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, detail, disabled, href, button, routerDirection]);
  }
}

export declare interface ItemDivider extends StencilComponents.IonItemDivider {}
@Directive({selector: 'ion-item-divider', inputs: [color, mode]})
export class ItemDivider {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface ItemGroup extends StencilComponents.IonItemGroup {}
@Directive({selector: 'ion-item-group'})
export class ItemGroup {
}

export declare interface ItemOption extends StencilComponents.IonItemOption {}
@Directive({selector: 'ion-item-option', inputs: [color, mode, disabled, expandable, href]})
export class ItemOption {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, disabled, expandable, href]);
  }
}

export declare interface ItemOptions extends StencilComponents.IonItemOptions {}
@Directive({selector: 'ion-item-options', inputs: [side], outputs: [ionSwipe]})
export class ItemOptions {
  ionSwipe!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [isRightSide, width, fireSwipeEvent]);
    inputs(this, r, [side]);
    outputs(this, [ionSwipe]);
  }
}

export declare interface ItemSliding extends StencilComponents.IonItemSliding {}
@Directive({selector: 'ion-item-sliding', outputs: [ionDrag]})
export class ItemSliding {
  ionDrag!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [getOpenAmount, getSlidingRatio, close, closeOpened]);
    outputs(this, [ionDrag]);
  }
}

export declare interface Label extends StencilComponents.IonLabel {}
@Directive({selector: 'ion-label', inputs: [color, mode, position], outputs: [ionStyle]})
export class Label {
  ionStyle!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [getText]);
    inputs(this, r, [color, mode, position]);
    outputs(this, [ionStyle]);
  }
}

export declare interface List extends StencilComponents.IonList {}
@Directive({selector: 'ion-list'})
export class List {
  constructor(r: ElementRef) {
    methods(this, r, [getOpenItem, setOpenItem, closeSlidingItems]);
  }
}

export declare interface ListHeader extends StencilComponents.IonListHeader {}
@Directive({selector: 'ion-list-header', inputs: [color, mode]})
export class ListHeader {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface Menu extends StencilComponents.IonMenu {}
@Directive({selector: 'ion-menu', inputs: [contentId, menuId, type, disabled, side, swipeEnabled, persistent, maxEdgeStart], outputs: [ionOpen, ionClose, ionMenuChange]})
export class Menu {
  ionOpen!: EventEmitter<any>;
  ionClose!: EventEmitter<any>;
  ionMenuChange!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [isOpen, open, close, toggle, setOpen, isActive]);
    inputs(this, r, [contentId, menuId, type, disabled, side, swipeEnabled, persistent, maxEdgeStart]);
    outputs(this, [ionOpen, ionClose, ionMenuChange]);
  }
}

export declare interface MenuButton extends StencilComponents.IonMenuButton {}
@Directive({selector: 'ion-menu-button', inputs: [menu, autoHide]})
export class MenuButton {
  constructor(r: ElementRef) {
    inputs(this, r, [menu, autoHide]);
  }
}

export declare interface MenuToggle extends StencilComponents.IonMenuToggle {}
@Directive({selector: 'ion-menu-toggle', inputs: [menu, autoHide]})
export class MenuToggle {
  constructor(r: ElementRef) {
    inputs(this, r, [menu, autoHide]);
  }
}

export declare interface Nav extends StencilComponents.IonNav {}
@Directive({selector: 'ion-nav', inputs: [swipeBackEnabled, animated, delegate, rootParams, root], outputs: [ionNavWillChange, ionNavDidChange]})
export class Nav {
  ionNavWillChange!: EventEmitter<any>;
  ionNavDidChange!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [push, insert, insertPages, pop, popTo, popToRoot, removeIndex, setRoot, setPages, setRouteId, getRouteId, canGoBack, getActive, getByIndex, getPrevious, length]);
    inputs(this, r, [swipeBackEnabled, animated, delegate, rootParams, root]);
    outputs(this, [ionNavWillChange, ionNavDidChange]);
  }
}

export declare interface NavPop extends StencilComponents.IonNavPop {}
@Directive({selector: 'ion-nav-pop'})
export class NavPop {
}

export declare interface NavPush extends StencilComponents.IonNavPush {}
@Directive({selector: 'ion-nav-push', inputs: [component, componentProps, url]})
export class NavPush {
  constructor(r: ElementRef) {
    inputs(this, r, [component, componentProps, url]);
  }
}

export declare interface NavSetRoot extends StencilComponents.IonNavSetRoot {}
@Directive({selector: 'ion-nav-set-root', inputs: [component, componentProps, url]})
export class NavSetRoot {
  constructor(r: ElementRef) {
    inputs(this, r, [component, componentProps, url]);
  }
}

export declare interface Note extends StencilComponents.IonNote {}
@Directive({selector: 'ion-note', inputs: [color, mode]})
export class Note {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface Radio extends StencilComponents.IonRadio {}
@Directive({selector: 'ion-radio', inputs: [color, mode, name, disabled, checked, value], outputs: [ionRadioDidLoad, ionRadioDidUnload, ionStyle, ionSelect, ionFocus, ionBlur]})
export class Radio {
  ionRadioDidLoad!: EventEmitter<any>;
  ionRadioDidUnload!: EventEmitter<any>;
  ionStyle!: EventEmitter<any>;
  ionSelect!: EventEmitter<any>;
  ionFocus!: EventEmitter<any>;
  ionBlur!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, name, disabled, checked, value]);
    outputs(this, [ionRadioDidLoad, ionRadioDidUnload, ionStyle, ionSelect, ionFocus, ionBlur]);
  }
}

export declare interface RadioGroup extends StencilComponents.IonRadioGroup {}
@Directive({selector: 'ion-radio-group', inputs: [allowEmptySelection, disabled, name, value], outputs: [ionChange]})
export class RadioGroup {
  ionChange!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [allowEmptySelection, disabled, name, value]);
    outputs(this, [ionChange]);
  }
}

export declare interface Range extends StencilComponents.IonRange {}
@Directive({selector: 'ion-range', inputs: [color, mode, debounce, disabled, dualKnobs, max, min, pin, snaps, step, value], outputs: [ionChange, ionStyle, ionFocus, ionBlur]})
export class Range {
  ionChange!: EventEmitter<any>;
  ionStyle!: EventEmitter<any>;
  ionFocus!: EventEmitter<any>;
  ionBlur!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [ratio, ratioUpper]);
    inputs(this, r, [color, mode, debounce, disabled, dualKnobs, max, min, pin, snaps, step, value]);
    outputs(this, [ionChange, ionStyle, ionFocus, ionBlur]);
  }
}

export declare interface Refresher extends StencilComponents.IonRefresher {}
@Directive({selector: 'ion-refresher', inputs: [pullMin, pullMax, closeDuration, snapbackDuration, disabled], outputs: [ionRefresh, ionPull, ionStart]})
export class Refresher {
  ionRefresh!: EventEmitter<any>;
  ionPull!: EventEmitter<any>;
  ionStart!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [complete, cancel, getProgress]);
    inputs(this, r, [pullMin, pullMax, closeDuration, snapbackDuration, disabled]);
    outputs(this, [ionRefresh, ionPull, ionStart]);
  }
}

export declare interface RefresherContent extends StencilComponents.IonRefresherContent {}
@Directive({selector: 'ion-refresher-content', inputs: [pullingIcon, pullingText, refreshingSpinner, refreshingText]})
export class RefresherContent {
  constructor(r: ElementRef) {
    inputs(this, r, [pullingIcon, pullingText, refreshingSpinner, refreshingText]);
  }
}

export declare interface Reorder extends StencilComponents.IonReorder {}
@Directive({selector: 'ion-reorder'})
export class Reorder {
}

export declare interface ReorderGroup extends StencilComponents.IonReorderGroup {}
@Directive({selector: 'ion-reorder-group', inputs: [disabled]})
export class ReorderGroup {
  constructor(r: ElementRef) {
    inputs(this, r, [disabled]);
  }
}

export declare interface RippleEffect extends StencilComponents.IonRippleEffect {}
@Directive({selector: 'ion-ripple-effect', inputs: [tapClick]})
export class RippleEffect {
  constructor(r: ElementRef) {
    methods(this, r, [addRipple]);
    inputs(this, r, [tapClick]);
  }
}

export declare interface Row extends StencilComponents.IonRow {}
@Directive({selector: 'ion-row'})
export class Row {
}

export declare interface Scroll extends StencilComponents.IonScroll {}
@Directive({selector: 'ion-scroll', inputs: [mode, forceOverscroll, scrollEvents], outputs: [ionScrollStart, ionScroll, ionScrollEnd]})
export class Scroll {
  ionScrollStart!: EventEmitter<any>;
  ionScroll!: EventEmitter<any>;
  ionScrollEnd!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [scrollToTop, scrollToBottom, scrollByPoint, scrollToPoint]);
    inputs(this, r, [mode, forceOverscroll, scrollEvents]);
    outputs(this, [ionScrollStart, ionScroll, ionScrollEnd]);
  }
}

export declare interface Searchbar extends StencilComponents.IonSearchbar {}
@Directive({selector: 'ion-searchbar', inputs: [color, mode, animated, autocomplete, autocorrect, cancelButtonText, debounce, placeholder, showCancelButton, spellcheck, type, value], outputs: [ionInput, ionCancel, ionClear, ionBlur, ionFocus]})
export class Searchbar {
  ionInput!: EventEmitter<any>;
  ionCancel!: EventEmitter<any>;
  ionClear!: EventEmitter<any>;
  ionBlur!: EventEmitter<any>;
  ionFocus!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, animated, autocomplete, autocorrect, cancelButtonText, debounce, placeholder, showCancelButton, spellcheck, type, value]);
    outputs(this, [ionInput, ionCancel, ionClear, ionBlur, ionFocus]);
  }
}

export declare interface Segment extends StencilComponents.IonSegment {}
@Directive({selector: 'ion-segment', inputs: [color, mode, disabled, value], outputs: [ionChange]})
export class Segment {
  ionChange!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, disabled, value]);
    outputs(this, [ionChange]);
  }
}

export declare interface SegmentButton extends StencilComponents.IonSegmentButton {}
@Directive({selector: 'ion-segment-button', inputs: [activated, color, mode, checked, disabled, href, value], outputs: [ionClick]})
export class SegmentButton {
  ionClick!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [activated, color, mode, checked, disabled, href, value]);
    outputs(this, [ionClick]);
  }
}

export declare interface Select extends StencilComponents.IonSelect {}
@Directive({selector: 'ion-select', inputs: [disabled, cancelText, okText, placeholder, name, selectedText, multiple, 'interface', interfaceOptions, value], outputs: [ionChange, ionCancel, ionFocus, ionBlur, ionStyle]})
export class Select {
  ionChange!: EventEmitter<any>;
  ionCancel!: EventEmitter<any>;
  ionFocus!: EventEmitter<any>;
  ionBlur!: EventEmitter<any>;
  ionStyle!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [disabled, cancelText, okText, placeholder, name, selectedText, multiple, 'interface', interfaceOptions, value]);
    outputs(this, [ionChange, ionCancel, ionFocus, ionBlur, ionStyle]);
  }
}

export declare interface SelectOption extends StencilComponents.IonSelectOption {}
@Directive({selector: 'ion-select-option', inputs: [disabled, selected, value], outputs: [ionSelectOptionDidLoad, ionSelectOptionDidUnload]})
export class SelectOption {
  ionSelectOptionDidLoad!: EventEmitter<any>;
  ionSelectOptionDidUnload!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [disabled, selected, value]);
    outputs(this, [ionSelectOptionDidLoad, ionSelectOptionDidUnload]);
  }
}

export declare interface SelectPopover extends StencilComponents.IonSelectPopover {}
@Directive({selector: 'ion-select-popover', inputs: [header, subHeader, message, options]})
export class SelectPopover {
  constructor(r: ElementRef) {
    inputs(this, r, [header, subHeader, message, options]);
  }
}

export declare interface ShowWhen extends StencilComponents.IonShowWhen {}
@Directive({selector: 'ion-show-when', inputs: [orientation, mediaQuery, size, mode, platform, or]})
export class ShowWhen {
  constructor(r: ElementRef) {
    inputs(this, r, [orientation, mediaQuery, size, mode, platform, or]);
  }
}

export declare interface SkeletonText extends StencilComponents.IonSkeletonText {}
@Directive({selector: 'ion-skeleton-text', inputs: [width]})
export class SkeletonText {
  constructor(r: ElementRef) {
    inputs(this, r, [width]);
  }
}

export declare interface Slide extends StencilComponents.IonSlide {}
@Directive({selector: 'ion-slide'})
export class Slide {
}

export declare interface Slides extends StencilComponents.IonSlides {}
@Directive({selector: 'ion-slides', inputs: [options, pager], outputs: [ionSlideWillChange, ionSlideDidChange, ionSlideNextStart, ionSlidePrevStart, ionSlideNextEnd, ionSlidePrevEnd, ionSlideTransitionStart, ionSlideTransitionEnd, ionSlideDrag, ionSlideReachStart, ionSlideReachEnd, ionSlideTouchStart, ionSlideTouchEnd]})
export class Slides {
  ionSlideWillChange!: EventEmitter<any>;
  ionSlideDidChange!: EventEmitter<any>;
  ionSlideNextStart!: EventEmitter<any>;
  ionSlidePrevStart!: EventEmitter<any>;
  ionSlideNextEnd!: EventEmitter<any>;
  ionSlidePrevEnd!: EventEmitter<any>;
  ionSlideTransitionStart!: EventEmitter<any>;
  ionSlideTransitionEnd!: EventEmitter<any>;
  ionSlideDrag!: EventEmitter<any>;
  ionSlideReachStart!: EventEmitter<any>;
  ionSlideReachEnd!: EventEmitter<any>;
  ionSlideTouchStart!: EventEmitter<any>;
  ionSlideTouchEnd!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [update, slideTo, slideNext, slidePrev, getActiveIndex, getPreviousIndex, length, isEnd, isBeginning, startAutoplay, stopAutoplay, lockSwipeToNext, lockSwipeToPrev, lockSwipes]);
    inputs(this, r, [options, pager]);
    outputs(this, [ionSlideWillChange, ionSlideDidChange, ionSlideNextStart, ionSlidePrevStart, ionSlideNextEnd, ionSlidePrevEnd, ionSlideTransitionStart, ionSlideTransitionEnd, ionSlideDrag, ionSlideReachStart, ionSlideReachEnd, ionSlideTouchStart, ionSlideTouchEnd]);
  }
}

export declare interface Spinner extends StencilComponents.IonSpinner {}
@Directive({selector: 'ion-spinner', inputs: [color, mode, duration, name, paused]})
export class Spinner {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, duration, name, paused]);
  }
}

export declare interface SplitPane extends StencilComponents.IonSplitPane {}
@Directive({selector: 'ion-split-pane', inputs: [disabled, when], outputs: [ionChange, ionSplitPaneVisible]})
export class SplitPane {
  ionChange!: EventEmitter<any>;
  ionSplitPaneVisible!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [isVisible, isPane]);
    inputs(this, r, [disabled, when]);
    outputs(this, [ionChange, ionSplitPaneVisible]);
  }
}

export declare interface Tab extends StencilComponents.IonTab {}
@Directive({selector: 'ion-tab', inputs: [active, btnId, delegate, label, href, icon, badge, badgeStyle, component, name, disabled, selected, show, tabsHideOnSubPages], outputs: [ionSelect]})
export class Tab {
  ionSelect!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [getTabId, setActive]);
    inputs(this, r, [active, btnId, delegate, label, href, icon, badge, badgeStyle, component, name, disabled, selected, show, tabsHideOnSubPages]);
    outputs(this, [ionSelect]);
  }
}

export declare interface Tabs extends StencilComponents.IonTabs {}
@Directive({selector: 'ion-tabs', inputs: [color, name, tabbarHidden, tabbarLayout, tabbarPlacement, tabbarHighlight, translucent, scrollable, useRouter], outputs: [ionChange, ionNavWillChange, ionNavDidChange]})
export class Tabs {
  ionChange!: EventEmitter<any>;
  ionNavWillChange!: EventEmitter<any>;
  ionNavDidChange!: EventEmitter<any>;
  constructor(r: ElementRef) {
    methods(this, r, [select, setRouteId, getRouteId, getTab, getSelected]);
    inputs(this, r, [color, name, tabbarHidden, tabbarLayout, tabbarPlacement, tabbarHighlight, translucent, scrollable, useRouter]);
    outputs(this, [ionChange, ionNavWillChange, ionNavDidChange]);
  }
}

export declare interface Text extends StencilComponents.IonText {}
@Directive({selector: 'ion-text', inputs: [color, mode]})
export class Text {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode]);
  }
}

export declare interface Textarea extends StencilComponents.IonTextarea {}
@Directive({selector: 'ion-textarea', inputs: [autocapitalize, autocomplete, autofocus, clearOnEdit, debounce, disabled, maxlength, minlength, name, placeholder, readonly, required, spellcheck, cols, rows, wrap, value], outputs: [ionInput, ionStyle, ionBlur, ionFocus]})
export class Textarea {
  ionInput!: EventEmitter<any>;
  ionStyle!: EventEmitter<any>;
  ionBlur!: EventEmitter<any>;
  ionFocus!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [autocapitalize, autocomplete, autofocus, clearOnEdit, debounce, disabled, maxlength, minlength, name, placeholder, readonly, required, spellcheck, cols, rows, wrap, value]);
    outputs(this, [ionInput, ionStyle, ionBlur, ionFocus]);
  }
}

export declare interface Thumbnail extends StencilComponents.IonThumbnail {}
@Directive({selector: 'ion-thumbnail'})
export class Thumbnail {
}

export declare interface Toggle extends StencilComponents.IonToggle {}
@Directive({selector: 'ion-toggle', inputs: [color, mode, name, checked, disabled, value], outputs: [ionChange, ionFocus, ionBlur, ionStyle]})
export class Toggle {
  ionChange!: EventEmitter<any>;
  ionFocus!: EventEmitter<any>;
  ionBlur!: EventEmitter<any>;
  ionStyle!: EventEmitter<any>;
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, name, checked, disabled, value]);
    outputs(this, [ionChange, ionFocus, ionBlur, ionStyle]);
  }
}

export declare interface Toolbar extends StencilComponents.IonToolbar {}
@Directive({selector: 'ion-toolbar', inputs: [color, mode, translucent]})
export class Toolbar {
  constructor(r: ElementRef) {
    inputs(this, r, [color, mode, translucent]);
  }
}

export declare interface ToolbarTitle extends StencilComponents.IonTitle {}
@Directive({selector: 'ion-title'})
export class ToolbarTitle {
}
