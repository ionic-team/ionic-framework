import { Component, Optional, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';

import { App } from '../app/app';
import { Config } from '../../config/config';
import { Content, ContentDimensions, ScrollEvent } from '../content/content';
import { copyInputAttributes, PointerCoordinates, hasPointerMoved, pointerCoord }  from '../../util/dom';
import { DomController } from '../../platform/dom-controller';
import { Form, IonicFormInput } from '../../util/form';
import { Ion } from '../ion';
import { isString, isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { NativeInput } from './native-input';
import { NextInput } from './next-input';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
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
    '<input [(ngModel)]="_value" [type]="type" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" class="text-input" [ngClass]="\'text-input-\' + _mode" *ngIf="_type!==\'textarea\'"  #input>' +
    '<textarea [(ngModel)]="_value" (blur)="inputBlurred($event)" (focus)="inputFocused($event)" [placeholder]="placeholder" [disabled]="disabled" [readonly]="readonly" class="text-input" [ngClass]="\'text-input-\' + _mode" *ngIf="_type===\'textarea\'" #textarea></textarea>' +
    '<input [type]="type" aria-hidden="true" next-input *ngIf="_useAssist">' +
    '<button ion-button clear [hidden]="!clearInput" type="button" class="text-input-clear-icon" (click)="clearTextInput()" (mousedown)="clearTextInput()"></button>' +
    '<div (touchstart)="pointerStart($event)" (touchend)="pointerEnd($event)" (mousedown)="pointerStart($event)" (mouseup)="pointerEnd($event)" class="input-cover" tappable *ngIf="_useAssist"></div>',
  encapsulation: ViewEncapsulation.None,
})
export class TextInput extends Ion implements IonicFormInput {
  _autoComplete: string;
  _autoCorrect: string;
  _autoFocusAssist: string;
  _clearInput: boolean = false;
  _clearOnEdit: boolean;
  _coord: PointerCoordinates;
  _didBlurAfterEdit: boolean;
  _disabled: boolean = false;
  _readonly: boolean = false;
  _isTouch: boolean;
  _keyboardHeight: number;
  _min: any;
  _max: any;
  _step: any;
  _native: NativeInput;
  _nav: NavControllerBase;
  _scrollStart: any;
  _scrollEnd: any;
  _type: string = 'text';
  _useAssist: boolean;
  _usePadding: boolean;
  _value: any = '';

  /** @hidden */
  inputControl: NgControl;

  constructor(
    config: Config,
    private _plt: Platform,
    private _form: Form,
    private _app: App,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() private _content: Content,
    @Optional() private _item: Item,
    @Optional() nav: NavController,
    @Optional() public ngControl: NgControl,
    private _dom: DomController
  ) {
    super(config, elementRef, renderer, 'input');

    this._nav = <NavControllerBase>nav;

    this._autoFocusAssist = config.get('autoFocusAssist', 'delay');
    this._autoComplete = config.get('autocomplete', 'off');
    this._autoCorrect = config.get('autocorrect', 'off');
    this._keyboardHeight = config.getNumber('keyboardHeight');
    this._useAssist = config.getBoolean('scrollAssist', false);
    this._usePadding = config.getBoolean('scrollPadding', this._useAssist);

    if (elementRef.nativeElement.tagName === 'ION-TEXTAREA') {
      this._type = TEXTAREA;
    }

    if (ngControl) {
      ngControl.valueAccessor = this;
      this.inputControl = ngControl;
    }

    _form.register(this);

    // only listen to content scroll events if there is content
    if (_content) {
      this._scrollStart = _content.ionScrollStart.subscribe((ev: ScrollEvent) => {
        this.scrollHideFocus(ev, true);
      });
      this._scrollEnd = _content.ionScrollEnd.subscribe((ev: ScrollEvent) => {
        this.scrollHideFocus(ev, false);
      });
    }

    this.mode = config.get('mode');
  }

  /**
   * @input {string} Instructional text that shows before the input has a value.
   */
  @Input() placeholder: string = '';

  /**
   * @input {boolean} If true, a clear icon will appear in the input when there is a value. Clicking it clears the input.
   */
  @Input()
  get clearInput() {
    return this._clearInput;
  }
  set clearInput(val: any) {
    this._clearInput = (this._type !== TEXTAREA && isTrueProperty(val));
  }

  /**
   * @input {string} The text value of the input.
   */
  @Input()
  get value() {
    return this._value;
  }
  set value(val: any) {
    this._value = val;
    this.checkHasValue(val);
  }

  /**
   * @input {string} The type of control to display. The default type is text. Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
   */
  @Input()
  get type() {
    return this._type;
  }
  set type(val: any) {
    if (this._type !== TEXTAREA) {
      this._type = 'text';

      if (isString(val)) {
        val = val.toLowerCase();

        if (TEXT_TYPE_REGEX.test(val)) {
          this._type = val;
        }
      }
    }
  }

  /**
   * @input {boolean} If true, the user cannot interact with this element.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this.setDisabled(this._disabled = isTrueProperty(val));
  }

  /**
   * @hidden
   */
  setDisabled(val: boolean) {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'disabled', val ? '' : null);
    this._item && this._item.setElementClass('item-input-disabled', val);
    this._native && this._native.isDisabled(val);
  }

  /**
   * @hidden
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
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
   * @input {boolean} If true, the value will be cleared after focus upon edit. Defaults to `true` when `type` is `"password"`, `false` for all other types.
   */
  @Input()
  get clearOnEdit() {
    return this._clearOnEdit;
  }
  set clearOnEdit(val: any) {
    this._clearOnEdit = isTrueProperty(val);
  }

  /**
   * @input {any} The minimum value, which must not be greater than its maximum (max attribute) value.
   */
  @Input()
  get min() {
    return this._min;
  }
  set min(val: any) {
    this.setMin(this._min = val);
  }

  /**
   * @hidden
   */
  setMin(val: any) {
    this._native && this._native.setMin(val);
  }

  /**
   * @input {any} The maximum value, which must not be less than its minimum (min attribute) value.
   */
  @Input()
  get max() {
    return this._max;
  }
  set max(val: any) {
    this.setMax(this._max = val);
  }

  /**
   * @hidden
   */
  setMax(val: any) {
    this._native && this._native.setMax(val);
  }

  /**
   * @input {any} Works with the min and max attributes to limit the increments at which a value can be set.
   */
  @Input()
  get step() {
    return this._step;
  }
  set step(val: any) {
    this.setStep(this._step = val);
  }

  /**
   * @hidden
   */
  setStep(val: any) {
    this._native && this._native.setStep(val);
  }

  /**
   * @hidden
   */
  @ViewChild('input', { read: NativeInput })
  set _nativeInput(nativeInput: NativeInput) {
    if (this.type !== TEXTAREA) {
      this.setNativeInput(nativeInput);
    }
  }

  /**
   * @hidden
   */
  @ViewChild('textarea', { read: NativeInput })
  set _nativeTextarea(nativeInput: NativeInput) {
    if (this.type === TEXTAREA) {
      this.setNativeInput(nativeInput);
    }
  }

  /**
   * @hidden
   */
  @ViewChild(NextInput)
  set _nextInput(nextInput: NextInput) {
    if (nextInput) {
      nextInput.focused.subscribe(() => {
        this._form.tabFocus(this);
      });
    }
  }

  /**
   * @output {event} Emitted when the input no longer has focus.
   */
  @Output() blur: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @output {event} Emitted when the input has focus.
   */
  @Output() focus: EventEmitter<Event> = new EventEmitter<Event>();

  /**
   * @hidden
   */
  setNativeInput(nativeInput: NativeInput) {
    this._native = nativeInput;
    nativeInput.setValue(this._value);
    nativeInput.setMin(this._min);
    nativeInput.setMax(this._max);
    nativeInput.setStep(this._step);
    nativeInput.isDisabled(this.disabled);

    if (this._item && this._item.labelId !== null) {
      nativeInput.labelledBy(this._item.labelId);
    }

    nativeInput.valueChange.subscribe((inputValue: any) => {
      this.onChange(inputValue);
      this.checkHasValue(inputValue);
    });

    nativeInput.keydown.subscribe((inputValue: any) => {
      this.onKeydown(inputValue);
    });

    this.focusChange(this.hasFocus());
    nativeInput.focusChange.subscribe((textInputHasFocus: any) => {
      this.focusChange(textInputHasFocus);
      this.checkHasValue(nativeInput.getValue());
      if (!textInputHasFocus) {
        this.onTouched(textInputHasFocus);
      }
    });

    this.checkHasValue(nativeInput.getValue());

    var ionInputEle: HTMLElement = this._elementRef.nativeElement;
    var nativeInputEle: HTMLElement = nativeInput.element();

    // copy ion-input attributes to the native input element
    copyInputAttributes(ionInputEle, nativeInputEle);

    if (ionInputEle.hasAttribute('autofocus')) {
      // the ion-input element has the autofocus attributes
      ionInputEle.removeAttribute('autofocus');

      if (this._autoFocusAssist === 'immediate') {
        // config says to immediate focus on the input
        // works best on android devices
        nativeInputEle.focus();

      } else if (this._autoFocusAssist === 'delay') {
        // config says to chill out a bit and focus on the input after transitions
        // works best on desktop
        this._plt.timeout(() => {
          nativeInputEle.focus();
        }, 650);
      }

      // traditionally iOS has big issues with autofocus on actual devices
      // autoFocus is disabled by default with the iOS mode config
    }

    // by default set autocomplete="off" unless specified by the input
    if (ionInputEle.hasAttribute('autocomplete')) {
      this._autoComplete = ionInputEle.getAttribute('autocomplete');
    }
    nativeInputEle.setAttribute('autocomplete', this._autoComplete);

    // by default set autocorrect="off" unless specified by the input
    if (ionInputEle.hasAttribute('autocorrect')) {
      this._autoCorrect = ionInputEle.getAttribute('autocorrect');
    }
    nativeInputEle.setAttribute('autocorrect', this._autoCorrect);
  }

  /**
   * @hidden
   */
  initFocus() {
    // begin the process of setting focus to the inner input element
    const app = this._app;
    const content = this._content;
    const nav = this._nav;
    const nativeInput = this._native;

    console.debug(`input-base, initFocus(), scrollView: ${!!content}`);

    if (content) {
      // this input is inside of a scroll view
      // find out if text input should be manually scrolled into view

      // get container of this input, probably an ion-item a few nodes up
      var ele: HTMLElement = this._elementRef.nativeElement;
      ele = <HTMLElement>ele.closest('ion-item,[ion-item]') || ele;

      var scrollData = getScrollData(ele.offsetTop, ele.offsetHeight, content.getContentDimensions(), this._keyboardHeight, this._plt.height());
      if (Math.abs(scrollData.scrollAmount) < 4) {
        // the text input is in a safe position that doesn't
        // require it to be scrolled into view, just set focus now
        this.setFocus();

        // all good, allow clicks again
        app.setEnabled(true);
        nav && nav.setTransitioning(false);

        if (this._usePadding) {
          content.clearScrollPaddingFocusOut();
        }
        return;
      }

      if (this._usePadding) {
        // add padding to the bottom of the scroll view (if needed)
        content.addScrollPadding(scrollData.scrollPadding);
      }

      // manually scroll the text input to the top
      // do not allow any clicks while it's scrolling
      var scrollDuration = getScrollAssistDuration(scrollData.scrollAmount);
      app.setEnabled(false, scrollDuration);
      nav && nav.setTransitioning(true);

      // temporarily move the focus to the focus holder so the browser
      // doesn't freak out while it's trying to get the input in place
      // at this point the native text input still does not have focus
      nativeInput.beginFocus(true, scrollData.inputSafeY);

      // scroll the input into place
      content.scrollTo(0, scrollData.scrollTo, scrollDuration, () => {
        console.debug(`input-base, scrollTo completed, scrollTo: ${scrollData.scrollTo}, scrollDuration: ${scrollDuration}`);
        // the scroll view is in the correct position now
        // give the native text input focus
        nativeInput.beginFocus(false, 0);

        // ensure this is the focused input
        this.setFocus();

        // all good, allow clicks again
        app.setEnabled(true);
        nav && nav.setTransitioning(false);

        if (this._usePadding) {
          content.clearScrollPaddingFocusOut();
        }
      });

    } else {
      // not inside of a scroll view, just focus it
      this.setFocus();
    }
  }

  /**
   * @hidden
   */
  setFocus() {
    // immediately set focus
    this._form.setAsFocused(this);

    // set focus on the actual input element
    console.debug(`input-base, setFocus ${this._native.element().value}`);
    this._native.setFocus();

    // ensure the body hasn't scrolled down
    this._dom.write(() => {
      this._plt.doc().body.scrollTop = 0;
    });
  }

  /**
   * @hidden
   */
  scrollHideFocus(ev: ScrollEvent, shouldHideFocus: boolean) {
    // do not continue if there's no nav, or it's transitioning
    if (this._nav && this.hasFocus()) {
      // if it does have focus, then do the dom write
      this._dom.write(() => {
        this._native.hideFocus(shouldHideFocus);
      });
    }
  }

  /**
   * @hidden
   */
  inputBlurred(ev: UIEvent) {
    this.blur.emit(ev);
  }

  /**
   * @hidden
   */
  inputFocused(ev: UIEvent) {
    this.focus.emit(ev);
  }

  /**
   * @hidden
   */
  writeValue(val: any) {
    this._value = val;
    this.checkHasValue(val);
  }

  /**
   * @hidden
   */
  onChange(val: any) {
    this.checkHasValue(val);
  }

  /**
   * @hidden
   */
  onKeydown(val: any) {
    if (this._clearOnEdit) {
      this.checkClearOnEdit(val);
    }
  }

  /**
   * @hidden
   */
  onTouched(val: any) {}

  /**
   * @hidden
   */
  hasFocus(): boolean {
    // check if an input has focus or not
    return this._plt.hasFocus(this._native.element());
  }

  /**
   * @hidden
   */
  hasValue(): boolean {
    const inputValue = this._value;
    return (inputValue !== null && inputValue !== undefined && inputValue !== '');
  }

  /**
   * @hidden
   */
  checkHasValue(inputValue: any) {
    if (this._item) {
      var hasValue = (inputValue !== null && inputValue !== undefined && inputValue !== '');
      this._item.setElementClass('input-has-value', hasValue);
    }
  }

  /**
   * @hidden
   */
  focusChange(inputHasFocus: boolean) {
    if (this._item) {
      console.debug(`input-base, focusChange, inputHasFocus: ${inputHasFocus}, ${this._item.getNativeElement().nodeName}.${this._item.getNativeElement().className}`);
      this._item.setElementClass('input-has-focus', inputHasFocus);
    }

    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this._clearOnEdit && !inputHasFocus && this.hasValue()) {
      this._didBlurAfterEdit = true;
    }
  }

  /**
   * @hidden
   */
  pointerStart(ev: UIEvent) {
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

  /**
   * @hidden
   */
  pointerEnd(ev: UIEvent) {
    // input cover touchend/mouseup
    console.debug(`input-base, pointerEnd, type: ${ev.type}`);

    if ((this._isTouch && ev.type === 'mouseup') || !this._app.isEnabled()) {
      // the app is actively doing something right now
      // don't try to scroll in the input
      ev.preventDefault();
      ev.stopPropagation();

    } else if (this._coord) {
      // get where the touchend/mouseup ended
      let endCoord = pointerCoord(ev);

      // focus this input if the pointer hasn't moved XX pixels
      // and the input doesn't already have focus
      if (!hasPointerMoved(8, this._coord, endCoord) && !this.hasFocus()) {
        ev.preventDefault();
        ev.stopPropagation();

        // begin the input focus process
        this.initFocus();
      }
    }

    this._coord = null;
  }
  /**
   * @hidden
   */
  setItemInputControlCss() {
    let item = this._item;
    let nativeInput = this._native;
    let inputControl = this.inputControl;

    // Set the control classes on the item
    if (item && inputControl) {
      setControlCss(item, inputControl);
    }

    // Set the control classes on the native input
    if (nativeInput && inputControl) {
      setControlCss(nativeInput, inputControl);
    }
  }

  /**
   * @hidden
   */
  ngOnInit() {
    const item = this._item;
    if (item) {
      if (this.type === TEXTAREA) {
        item.setElementClass('item-textarea', true);
      }
      item.setElementClass('item-input', true);
      item.registerInput(this.type);
    }

    // By default, password inputs clear after focus when they have content
    if (this.type === 'password' && this.clearOnEdit !== false) {
      this.clearOnEdit = true;
    }
  }

  /**
   * @hidden
   */
  ngAfterContentChecked() {
    this.setItemInputControlCss();
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._form.deregister(this);

    // only stop listening to content scroll events if there is content
    if (this._content) {
      this._scrollStart.unsubscribe();
      this._scrollEnd.unsubscribe();
    }
  }

  /**
   * @hidden
   */
  clearTextInput() {
    console.debug('Should clear input');
    this._value = '';
    this.onChange(this._value);
    this.writeValue(this._value);
  }

  /**
  * Check if we need to clear the text input if clearOnEdit is enabled
  * @hidden
  */
  checkClearOnEdit(inputValue: string) {
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

  /**
   * @hidden
   * Angular2 Forms API method called by the view (formControlName) to register the
   * onChange event handler that updates the model (Control).
   * @param {Function} fn  the onChange event handler.
   */
  registerOnChange(fn: any) { this.onChange = fn; }

  /**
   * @hidden
   * Angular2 Forms API method called by the view (formControlName) to register
   * the onTouched event handler that marks model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  registerOnTouched(fn: any) { this.onTouched = fn; }


  /**
   * @hidden
   */
  focusNext() {
    this._form.tabFocus(this);
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
const TEXTAREA = 'textarea';
const TEXT_TYPE_REGEX = /password|email|number|search|tel|url|date|month|time|week/;


/**
 * @hidden
 */
export function getScrollData(inputOffsetTop: number, inputOffsetHeight: number, scrollViewDimensions: ContentDimensions, keyboardHeight: number, plaformHeight: number) {
  // compute input's Y values relative to the body
  let inputTop = (inputOffsetTop + scrollViewDimensions.contentTop - scrollViewDimensions.scrollTop);
  let inputBottom = (inputTop + inputOffsetHeight);

  // compute the safe area which is the viewable content area when the soft keyboard is up
  let safeAreaTop = scrollViewDimensions.contentTop;
  let safeAreaHeight = (plaformHeight - keyboardHeight - safeAreaTop) / 2;
  let safeAreaBottom = safeAreaTop + safeAreaHeight;

  // figure out if each edge of teh input is within the safe area
  let inputTopWithinSafeArea = (inputTop >= safeAreaTop && inputTop <= safeAreaBottom);
  let inputTopAboveSafeArea = (inputTop < safeAreaTop);
  let inputTopBelowSafeArea = (inputTop > safeAreaBottom);
  let inputBottomWithinSafeArea = (inputBottom >= safeAreaTop && inputBottom <= safeAreaBottom);
  let inputBottomBelowSafeArea = (inputBottom > safeAreaBottom);

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

  const scrollData: ScrollData = {
    scrollAmount: 0,
    scrollTo: 0,
    scrollPadding: 0,
    inputSafeY: 0
  };

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

  // when auto-scrolling, there also needs to be enough
  // content padding at the bottom of the scroll view
  // always add scroll padding when a text input has focus
  // this allows for the content to scroll above of the keyboard
  // content behind the keyboard would be blank
  // some cases may not need it, but when jumping around it's best
  // to have the padding already rendered so there's no jank
  scrollData.scrollPadding = keyboardHeight;

  // var safeAreaEle: HTMLElement = (<any>window).safeAreaEle;
  // if (!safeAreaEle) {
  //   safeAreaEle = (<any>window).safeAreaEle  = document.createElement('div');
  //   safeAreaEle.style.cssText = 'position:absolute; padding:1px 5px; left:0; right:0; font-weight:bold; font-size:10px; font-family:Courier; text-align:right; background:rgba(0, 128, 0, 0.8); text-shadow:1px 1px white; pointer-events:none;';
  //   document.body.appendChild(safeAreaEle);
  // }
  // safeAreaEle.style.top = safeAreaTop + 'px';
  // safeAreaEle.style.height = safeAreaHeight + 'px';
  // safeAreaEle.innerHTML = `
  //   <div>scrollTo: ${scrollData.scrollTo}</div>
  //   <div>scrollAmount: ${scrollData.scrollAmount}</div>
  //   <div>scrollPadding: ${scrollData.scrollPadding}</div>
  //   <div>inputSafeY: ${scrollData.inputSafeY}</div>
  //   <div>scrollHeight: ${scrollViewDimensions.scrollHeight}</div>
  //   <div>scrollTop: ${scrollViewDimensions.scrollTop}</div>
  //   <div>contentHeight: ${scrollViewDimensions.contentHeight}</div>
  //   <div>plaformHeight: ${plaformHeight}</div>
  // `;

  return scrollData;
}

function setControlCss(element: any, control: NgControl) {
  element.setElementClass('ng-untouched', control.untouched);
  element.setElementClass('ng-touched', control.touched);
  element.setElementClass('ng-pristine', control.pristine);
  element.setElementClass('ng-dirty', control.dirty);
  element.setElementClass('ng-valid', control.valid);
  element.setElementClass('ng-invalid', !control.valid);
}

function getScrollAssistDuration(distanceToScroll: number) {
  distanceToScroll = Math.abs(distanceToScroll);
  let duration = distanceToScroll / SCROLL_ASSIST_SPEED;
  return Math.min(400, Math.max(150, duration));
}

export interface ScrollData {
  scrollAmount: number;
  scrollTo: number;
  scrollPadding: number;
  inputSafeY: number;
}
