import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  Renderer,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Content, ContentDimensions } from '../content/content';
import { copyInputAttributes, hasPointerMoved, pointerCoord }  from '../../util/dom';
import { DomController } from '../../platform/dom-controller';
import { Form, IonicFormInput } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { assert, isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { Platform } from '../../platform/platform';


/**
 * @name Input
 * @description
 *
 * `ion-input` is meant for text type inputs only, such as `text`,
 * `password`, `email`, `number`, `search`, `tel`, and `url`. Ionic
 * still uses an actual `<input type="text">` HTML element within the
 * component, however, with Ionic wrapping the native HTML input
 * element it's better able to handle the user experience and
 * interactivity.
 *
 * Similarly, `<ion-textarea>` should be used in place of `<textarea>`.
 *
 * An `ion-input` is **not** used for non-text type inputs, such as a
 * `checkbox`, `radio`, `toggle`, `range`, `select`, etc.
 *
 * Along with the blur/focus events, `input` support all standard text input
 * events like `keyup`, `keydown`, `keypress`, `input`,etc. Any standard event
 * can be attached and will function as expected.
 *
 * @usage
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-label color="primary">Inline Label</ion-label>
 *     <ion-input placeholder="Text Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" fixed>Fixed Label</ion-label>
 *     <ion-input type="tel" placeholder="Tel Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input type="number" placeholder="Number Input with no label"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="email" placeholder="Email Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="password" placeholder="Password Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" floating>Floating Label</ion-label>
 *     <ion-input></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input placeholder="Clear Input" clearInput></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-textarea placeholder="Enter a description"></ion-textarea>
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * @demo /docs/demos/src/input/
 */
@Component({
  selector: 'ion-input,ion-textarea',
  template:
  '<input #textInput *ngIf="!_isTextarea" class="text-input" ' +
    '[ngClass]="\'text-input-\' + _mode"' +
    '(input)="onInput($event)" ' +
    '(blur)="onBlur($event)" ' +
    '(focus)="onFocus($event)" ' +
    '(keydown)="onKeydown($event)" ' +
    '[type]="_type" ' +
    'dir="auto" ' +
    '[attr.aria-labelledby]="_labelId" ' +
    '[attr.min]="min" ' +
    '[attr.max]="max" ' +
    '[attr.step]="step" ' +
    '[attr.autocomplete]="autocomplete" ' +
    '[attr.autocorrect]="autocorrect" ' +
    '[placeholder]="placeholder" ' +
    '[disabled]="_disabled" ' +
    '[readonly]="_readonly">' +

  '<textarea #textInput *ngIf="_isTextarea" class="text-input" ' +
    '[ngClass]="\'text-input-\' + _mode"' +
    '(input)="onInput($event)" ' +
    '(blur)="onBlur($event)" ' +
    '(focus)="onFocus($event)" ' +
    '(keydown)="onKeydown($event)" ' +
    '[attr.aria-labelledby]="_labelId" ' +
    '[attr.autocomplete]="autocomplete" ' +
    '[attr.autocorrect]="autocorrect" ' +
    '[placeholder]="placeholder" ' +
    '[disabled]="_disabled" ' +
    '[readonly]="_readonly"></textarea>' +

  '<button ion-button *ngIf="_clearInput" clear class="text-input-clear-icon" ' +
    'type="button" ' +
    '(click)="clearTextInput($event)" ' +
    '(mousedown)="clearTextInput($event)" ' +
    'tabindex="-1"></button>' +

  '<div class="input-cover" *ngIf="_useAssist" ' +
    '(touchstart)="_pointerStart($event)" ' +
    '(touchend)="_pointerEnd($event)" ' +
    '(mousedown)="_pointerStart($event)" ' +
    '(mouseup)="_pointerEnd($event)"></div>',

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['value']
})
export class TextInput extends BaseInput<string> implements IonicFormInput {

  _autoFocusAssist: string;
  _clearInput: boolean = false;
  _clearOnEdit: boolean;
  _didBlurAfterEdit: boolean;
  _readonly: boolean = false;
  _keyboardHeight: number;
  _type: string = 'text';
  _scrollData: ScrollData;
  _isTextarea: boolean = false;
  _onDestroy = new Subject<void>();
  _coord: any;
  _isTouch: boolean;
  _useAssist = false;
  _relocated: boolean = false;

  /**
   * @input {boolean} If true, a clear icon will appear in the input when there is a value. Clicking it clears the input.
   */
  @Input()
  get clearInput() {
    return this._clearInput;
  }
  set clearInput(val: any) {
    this._clearInput = (!this._isTextarea && isTrueProperty(val));
  }

  /**
   * @input {string} The type of control to display. The default type is text.
   * Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
   */
  @Input()
  get type() {
    return (this._isTextarea)
      ? 'text'
      : this._type;
  }
  set type(val: any) {
    this._type = val;
  }

  /**
   * @input {boolean} If true, the user cannot modify the value.
   */
  @Input()
  get readonly() {
    return this._readonly;
  }
  set readonly(val: boolean) {
    this._readonly = isTrueProperty(val);
  }

  /**
   * @input {boolean} If true, the value will be cleared after focus upon edit.
   * Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Input()
  get clearOnEdit() {
    return this._clearOnEdit;
  }
  set clearOnEdit(val: any) {
    this._clearOnEdit = isTrueProperty(val);
  }

  /**
   * @hidden
   */
  @ViewChild('textInput', { read: ElementRef }) _native: ElementRef;

  /**
   * @input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Input() autocomplete: string = '';

  /**
   * @input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
   */
  @Input() autocorrect: string = '';

  /**
   * @input {string} Instructional text that shows before the input has a value.
   */
  @Input() placeholder: string = '';

  /**
   * @input {any} The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @Input() min: number | string = null;

  /**
   * @input {any} The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @Input() max: number | string = null;

  /**
   * @input {any} Works with the min and max attributes to limit the increments at which a value can be set.
   */
  @Input() step: number | string = null;

  /**
   * @hidden
   */
  @Output() input = new EventEmitter<UIEvent>();

  /**
   * @hidden
   */
  @Output() blur = new EventEmitter<UIEvent>();

  /**
   * @hidden
   */
  @Output() focus = new EventEmitter<UIEvent>();

  constructor(
    config: Config,
    private _plt: Platform,
    _form: Form,
    private _app: App,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() private _content: Content,
    @Optional() _item: Item,
    @Optional() public ngControl: NgControl,
    private _dom: DomController
  ) {
    super(config, elementRef, renderer, 'input', '', _form, _item, ngControl);

    this.autocomplete = config.get('autocomplete', 'off');
    this.autocorrect = config.get('autocorrect', 'off');
    this._autoFocusAssist = config.get('autoFocusAssist', 'delay');
    this._keyboardHeight = config.getNumber('keyboardHeight');
    this._isTextarea = !!(elementRef.nativeElement.tagName === 'ION-TEXTAREA');

    if (this._isTextarea && _item) {
      _item.setElementClass('item-textarea', true);
    }
    // If not inside content, let's disable all the hacks
    if (!_content) {
      return;
    }

    const hideCaretOnScroll = config.getBoolean('hideCaretOnScroll', false);
    if (hideCaretOnScroll) {
      this._enableHideCaretOnScroll();
    }
    const win = _plt.win() as any;
    const keyboardPlugin = win.Ionic && win.Ionic.keyboardPlugin;
    if (keyboardPlugin) {
      const keyboardResizes = config.getBoolean('keyboardResizes', false);
      if (keyboardResizes) {
        this._keyboardHeight = config.getNumber('keyboardSafeArea', 60);
        this._enableScrollMove();
      } else {
        this._enableScrollPadding();
        this._enableScrollMove();
      }

    } else {
      this._useAssist = config.getBoolean('scrollAssist', false);
      const usePadding = config.getBoolean('scrollPadding', this._useAssist);
      if (usePadding) {
        this._enableScrollPadding();
      }
    }
  }

  ngAfterContentInit() { }

  /**
   * @hidden
   */
  ngAfterViewInit() {
    assert(this._native && this._native.nativeElement, 'input element must be valid');
    // By default, password inputs clear after focus when they have content
    if (this.clearOnEdit !== false && this.type === 'password') {
      this.clearOnEdit = true;
    }
    const ionInputEle: HTMLElement = this._elementRef.nativeElement;
    const nativeInputEle: HTMLElement = this._native.nativeElement;

    // Copy remaining attributes, not handled by ionic/angular
    copyInputAttributes(ionInputEle, nativeInputEle);

    // prevent having tabIndex duplicated
    if (ionInputEle.hasAttribute('tabIndex')) {
      ionInputEle.removeAttribute('tabIndex');
    }

    // handle the autofocus attribute
    if (ionInputEle.hasAttribute('autofocus')) {
      ionInputEle.removeAttribute('autofocus');
      switch (this._autoFocusAssist) {
        case 'immediate':
          // config says to immediate focus on the input
          // works best on android devices
          nativeInputEle.focus();
          break;
        case 'delay':
          // config says to chill out a bit and focus on the input after transitions
          // works best on desktop
          this._plt.timeout(() => nativeInputEle.focus(), 800);
          break;
      }
      // traditionally iOS has big issues with autofocus on actual devices
      // autoFocus is disabled by default with the iOS mode config
    }

    // Initialize the input (can start emitting events)
    this._initialize();

    if (this.focus.observers.length > 0) {
      console.warn('(focus) is deprecated in ion-input, use (ionFocus) instead');
    }
    if (this.blur.observers.length > 0) {
      console.warn('(blur) is deprecated in ion-input, use (ionBlur) instead');
    }
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    this._onDestroy.next();
    this._onDestroy = null;
  }

  /**
   * @hidden
   */
  initFocus() {
    this.setFocus();
  }

  /**
   * @hidden
   */
  setFocus() {
    // let's set focus to the element
    // but only if it does not already have focus
    if (!this.isFocus()) {
      this._native.nativeElement.focus();
    }
  }

  /**
   * @hidden
   */
  setBlur() {
    if (this.isFocus()) {
      this._native.nativeElement.blur();
    }
  }

  /**
   * @hidden
   */
  onInput(ev: any) {
    this.value = ev.target.value;

    // TODO: deprecate this
    this.input.emit(ev);
  }

  /**
   * @hidden
   */
  onBlur(ev: UIEvent) {
    this._fireBlur();

    // TODO: deprecate this (06/07/2017)
    this.blur.emit(ev);

    this._scrollData = null;
    if (this._clearOnEdit && this.hasValue()) {
      this._didBlurAfterEdit = true;
    }
  }

  /**
   * @hidden
   */
  onFocus(ev: UIEvent) {
    this._fireFocus();

    // TODO: deprecate this (06/07/2017)
    this.focus.emit(ev);
  }

  /**
   * @hidden
   */
  onKeydown(ev: any) {
    if (ev && this._clearOnEdit) {
      this.checkClearOnEdit(ev.target.value);
    }
  }

  /**
   * @hidden
   */
  _inputUpdated() {
    super._inputUpdated();
    const inputEle = this._native.nativeElement;
    const value = this._value;
    if (inputEle.value !== value) {
      inputEle.value = value;
    }
  }

  /**
   * @hidden
   */
  clearTextInput() {
    this.value = '';
  }

  /**
  * Check if we need to clear the text input if clearOnEdit is enabled
  * @hidden
  */
  checkClearOnEdit(_: string) {
    if (!this._clearOnEdit) {
      return;
    }

    // Did the input value change after it was blurred and edited?
    if (this._didBlurAfterEdit && this.hasValue()) {
      // Clear the input
      this.clearTextInput();
    }

    // Reset the flag
    this._didBlurAfterEdit = false;
  }

  _getScrollData(): ScrollData {
    if (!this._content) {
      return newScrollData();
    }

    // get container of this input, probably an ion-item a few nodes up
    if (this._scrollData) {
      return this._scrollData;
    }
    let ele: HTMLElement = this._elementRef.nativeElement;
    ele = <HTMLElement>ele.closest('ion-item,[ion-item]') || ele;
    return this._scrollData = getScrollData(
      ele.offsetTop, ele.offsetHeight,
      this._content.getContentDimensions(), this._keyboardHeight, this._plt.height());
  }

  _relocateInput(shouldRelocate: boolean) {
    if (this._relocated === shouldRelocate) {
      return;
    }
    const platform = this._plt;
    const componentEle = this.getNativeElement();
    const focusedInputEle = this._native.nativeElement;
    console.debug(`native-input, hideCaret, shouldHideCaret: ${shouldRelocate}, input value: ${focusedInputEle.value}`);
    if (shouldRelocate) {
      // this allows for the actual input to receive the focus from
      // the user's touch event, but before it receives focus, it
      // moves the actual input to a location that will not screw
      // up the app's layout, and does not allow the native browser
      // to attempt to scroll the input into place (messing up headers/footers)
      // the cloned input fills the area of where native input should be
      // while the native input fakes out the browser by relocating itself
      // before it receives the actual focus event
      // We hide the focused input (with the visible caret) invisiable by making it scale(0),
      cloneInputComponent(platform, componentEle, focusedInputEle);
      const inputRelativeY = this._getScrollData().inputSafeY;
      // fix for #11817
      const tx = this._plt.isRTL ? 9999 : -9999;
      focusedInputEle.style[platform.Css.transform] = `translate3d(${tx}px,${inputRelativeY}px,0)`;
      focusedInputEle.style.opacity = '0';

    } else {
      removeClone(platform, componentEle, focusedInputEle);
    }
    this._relocated = shouldRelocate;
  }

  _enableScrollPadding() {
    assert(this._content, 'content is undefined');

    console.debug('Input: enableScrollPadding');

    this.ionFocus.subscribe(() => {
      const content = this._content;
      const scrollPadding = this._getScrollData().scrollPadding;
      content.addScrollPadding(scrollPadding);
      content.clearScrollPaddingFocusOut();
    });
  }

  _enableHideCaretOnScroll() {
    assert(this._content, 'content is undefined');

    const content = this._content;
    console.debug('Input: enableHideCaretOnScroll');

    content.ionScrollStart
      .takeUntil(this._onDestroy)
      .subscribe(() => scrollHideCaret(true));

    content.ionScrollEnd
      .takeUntil(this._onDestroy)
      .subscribe(() => scrollHideCaret(false));

    this.ionBlur.subscribe(() => this._relocateInput(false));

    const self = this;
    function scrollHideCaret(shouldHideCaret: boolean) {
      // if it does have focus, then do the dom write
      if (self.isFocus()) {
        self._dom.write(() => self._relocateInput(shouldHideCaret));
      }
    }
  }

  _enableScrollMove() {
    assert(this._content, 'content is undefined');

    console.debug('Input: enableAutoScroll');
    this.ionFocus.subscribe(() => {
      const scrollData = this._getScrollData();
      if (Math.abs(scrollData.scrollAmount) > 4) {
        this._content.scrollTo(0, scrollData.scrollTo, scrollData.scrollDuration);
      }
    });
  }

  _pointerStart(ev: UIEvent) {
    assert(this._content, 'content is undefined');

    // input cover touchstart
    if (ev.type === 'touchstart') {
      this._isTouch = true;
    }

    if ((this._isTouch || (!this._isTouch && ev.type === 'mousedown')) && this._app.isEnabled()) {
      // remember where the touchstart/mousedown started
      this._coord = pointerCoord(ev);
    }

    console.debug(`input-base, pointerStart, type: ${ev.type}`);
  }

  _pointerEnd(ev: UIEvent) {
    assert(this._content, 'content is undefined');

    // input cover touchend/mouseup
    console.debug(`input-base, pointerEnd, type: ${ev.type}`);

    if ((this._isTouch && ev.type === 'mouseup') || !this._app.isEnabled()) {
      // the app is actively doing something right now
      // don't try to scroll in the input
      ev.preventDefault();
      ev.stopPropagation();

    } else if (this._coord) {
      // get where the touchend/mouseup ended
      var endCoord = pointerCoord(ev);

      // focus this input if the pointer hasn't moved XX pixels
      // and the input doesn't already have focus
      if (!hasPointerMoved(8, this._coord, endCoord) && !this.isFocus()) {
        ev.preventDefault();
        ev.stopPropagation();

        // begin the input focus process
        this._jsSetFocus();
      }
    }

    this._coord = null;
  }

  _jsSetFocus() {
    assert(this._content, 'content is undefined');

    // begin the process of setting focus to the inner input element
    const content = this._content;
    console.debug(`input-base, initFocus(), scrollView: ${!!content}`);
    if (!content) {
      // not inside of a scroll view, just focus it
      this.setFocus();
    }

    var scrollData = this._getScrollData();
    if (Math.abs(scrollData.scrollAmount) < 4) {
      // the text input is in a safe position that doesn't
      // require it to be scrolled into view, just set focus now
      this.setFocus();
      return;
    }

    // temporarily move the focus to the focus holder so the browser
    // doesn't freak out while it's trying to get the input in place
    // at this point the native text input still does not have focus
    this._relocateInput(true);
    this.setFocus();

    // scroll the input into place
    content.scrollTo(0, scrollData.scrollTo, scrollData.scrollDuration, () => {
      // the scroll view is in the correct position now
      // give the native text input focus
      this._relocateInput(false);

      // ensure this is the focused input
      this.setFocus();
    });
  }

}



/**
 * @name TextArea
 * @description
 *
 * `ion-textarea` is used for multi-line text inputs. Ionic still
 * uses an actual `<textarea>` HTML element within the component;
 * however, with Ionic wrapping the native HTML text area element, Ionic
 * is able to better handle the user experience and interactivity.
 *
 * Note that `<ion-textarea>` must load its value from the `value` or
 * `[(ngModel)]` attribute. Unlike the native `<textarea>` element,
 * `<ion-textarea>` does not support loading its value from the
 * textarea's inner content.
 *
 * When requiring only a single-line text input, we recommend using
 * `<ion-input>` instead.
 *
 * @usage
 * ```html
 *  <ion-item>
 *    <ion-label>Comments</ion-label>
 *    <ion-textarea></ion-textarea>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label stacked>Message</ion-label>
 *    <ion-textarea [(ngModel)]="msg"></ion-textarea>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label floating>Description</ion-label>
 *    <ion-textarea></ion-textarea>
 *  </ion-item>
 *
 * <ion-item>
 *    <ion-label>Long Description</ion-label>
 *    <ion-textarea rows="6" placeholder="enter long description here..."></ion-textarea>
 *  </ion-item>
 * ```
 *
 * @demo /docs/demos/src/textarea/
 */


const SCROLL_ASSIST_SPEED = 0.3;

function newScrollData(): ScrollData {
  return {
    scrollAmount: 0,
    scrollTo: 0,
    scrollPadding: 0,
    scrollDuration: 0,
    inputSafeY: 0
  };
}

/**
 * @hidden
 */
export function getScrollData(
  inputOffsetTop: number,
  inputOffsetHeight: number,
  scrollViewDimensions: ContentDimensions,
  keyboardHeight: number,
  plaformHeight: number
): ScrollData {
  // compute input's Y values relative to the body
  const inputTop = (inputOffsetTop + scrollViewDimensions.contentTop - scrollViewDimensions.scrollTop);
  const inputBottom = (inputTop + inputOffsetHeight);

  // compute the safe area which is the viewable content area when the soft keyboard is up
  const safeAreaTop = scrollViewDimensions.contentTop;
  const safeAreaHeight = (plaformHeight - keyboardHeight - safeAreaTop) / 2;
  const safeAreaBottom = safeAreaTop + safeAreaHeight;

  // figure out if each edge of teh input is within the safe area
  const inputTopWithinSafeArea = (inputTop >= safeAreaTop && inputTop <= safeAreaBottom);
  const inputTopAboveSafeArea = (inputTop < safeAreaTop);
  const inputTopBelowSafeArea = (inputTop > safeAreaBottom);
  const inputBottomWithinSafeArea = (inputBottom >= safeAreaTop && inputBottom <= safeAreaBottom);
  const inputBottomBelowSafeArea = (inputBottom > safeAreaBottom);

  /*
  Text Input Scroll To Scenarios
  ---------------------------------------
  1) Input top within safe area, bottom within safe area
  2) Input top within safe area, bottom below safe area, room to scroll
  3) Input top above safe area, bottom within safe area, room to scroll
  4) Input top below safe area, no room to scroll, input smaller than safe area
  5) Input top within safe area, bottom below safe area, no room to scroll, input smaller than safe area
  6) Input top within safe area, bottom below safe area, no room to scroll, input larger than safe area
  7) Input top below safe area, no room to scroll, input larger than safe area
  */

  const scrollData: ScrollData = newScrollData();

  // when auto-scrolling, there also needs to be enough
  // content padding at the bottom of the scroll view
  // always add scroll padding when a text input has focus
  // this allows for the content to scroll above of the keyboard
  // content behind the keyboard would be blank
  // some cases may not need it, but when jumping around it's best
  // to have the padding already rendered so there's no jank
  scrollData.scrollPadding = keyboardHeight;

  if (inputTopWithinSafeArea && inputBottomWithinSafeArea) {
    // Input top within safe area, bottom within safe area
    // no need to scroll to a position, it's good as-is
    return scrollData;
  }

  // looks like we'll have to do some auto-scrolling
  if (inputTopBelowSafeArea || inputBottomBelowSafeArea || inputTopAboveSafeArea) {
    // Input top or bottom below safe area
    // auto scroll the input up so at least the top of it shows

    if (safeAreaHeight > inputOffsetHeight) {
      // safe area height is taller than the input height, so we
      // can bring up the input just enough to show the input bottom
      scrollData.scrollAmount = Math.round(safeAreaBottom - inputBottom);

    } else {
      // safe area height is smaller than the input height, so we can
      // only scroll it up so the input top is at the top of the safe area
      // however the input bottom will be below the safe area
      scrollData.scrollAmount = Math.round(safeAreaTop - inputTop);
    }

    scrollData.inputSafeY = -(inputTop - safeAreaTop) + 4;

    if (inputTopAboveSafeArea && scrollData.scrollAmount > inputOffsetHeight) {
      // the input top is above the safe area and we're already scrolling it into place
      // don't let it scroll more than the height of the input
      scrollData.scrollAmount = inputOffsetHeight;
    }
  }

  // figure out where it should scroll to for the best position to the input
  scrollData.scrollTo = (scrollViewDimensions.scrollTop - scrollData.scrollAmount);

  // calculate animation duration
  const distance = Math.abs(scrollData.scrollAmount);
  const duration = distance / SCROLL_ASSIST_SPEED;
  scrollData.scrollDuration = Math.min(400, Math.max(150, duration));

  return scrollData;
}

function cloneInputComponent(plt: Platform, srcComponentEle: HTMLInputElement, srcNativeInputEle: HTMLInputElement) {
  // Make sure we kill all the clones before creating new ones
  // It is a defensive, removeClone() should do nothing
  // removeClone(plt, srcComponentEle, srcNativeInputEle);
  assert(srcComponentEle.parentElement.querySelector('.cloned-input') === null, 'leaked cloned input');
  // given a native <input> or <textarea> element
  // find its parent wrapping component like <ion-input> or <ion-textarea>
  // then clone the entire component
  if (srcComponentEle) {
    // DOM READ
    var srcTop = srcComponentEle.offsetTop;
    var srcLeft = srcComponentEle.offsetLeft;
    var srcWidth = srcComponentEle.offsetWidth;
    var srcHeight = srcComponentEle.offsetHeight;

    // DOM WRITE
    // not using deep clone so we don't pull in unnecessary nodes
    var clonedComponentEle = <HTMLElement>srcComponentEle.cloneNode(false);
    var clonedStyle = clonedComponentEle.style;
    clonedComponentEle.classList.add('cloned-input');
    clonedComponentEle.setAttribute('aria-hidden', 'true');
    clonedStyle.pointerEvents = 'none';
    clonedStyle.position = 'absolute';
    clonedStyle.top = srcTop + 'px';
    clonedStyle.left = srcLeft + 'px';
    clonedStyle.width = srcWidth + 'px';
    clonedStyle.height = srcHeight + 'px';

    var clonedNativeInputEle = <HTMLInputElement>srcNativeInputEle.cloneNode(false);
    clonedNativeInputEle.value = srcNativeInputEle.value;
    clonedNativeInputEle.tabIndex = -1;

    clonedComponentEle.appendChild(clonedNativeInputEle);
    srcComponentEle.parentNode.appendChild(clonedComponentEle);

    srcComponentEle.style.pointerEvents = 'none';
  }

  (<any>srcNativeInputEle.style)[plt.Css.transform] = 'scale(0)';
}

function removeClone(plt: Platform, srcComponentEle: HTMLElement, srcNativeInputEle: HTMLElement) {
  if (srcComponentEle && srcComponentEle.parentElement) {
    var clonedInputEles = srcComponentEle.parentElement.querySelectorAll('.cloned-input');
    for (var i = 0; i < clonedInputEles.length; i++) {
      clonedInputEles[i].parentNode.removeChild(clonedInputEles[i]);
    }

    srcComponentEle.style.pointerEvents = '';
  }
  (<any>srcNativeInputEle.style)[plt.Css.transform] = '';
  srcNativeInputEle.style.opacity = '';
}


export interface ScrollData {
  scrollAmount: number;
  scrollTo: number;
  scrollPadding: number;
  scrollDuration: number;
  inputSafeY: number;
}
