import { ElementRef, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';

import { App } from '../app/app';
import { copyInputAttributes, PointerCoordinates, hasPointerMoved, pointerCoord }  from '../../util/dom';
import { Config } from '../../config/config';
import { Content, ContentDimensions } from '../content/content';
import { Form, IonicFormInput } from '../../util/form';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { NativeInput, NextInput } from './native-input';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';


/**
 * @private
 * Hopefully someday a majority of the auto-scrolling tricks can get removed.
 */
export class InputBase extends Ion implements IonicFormInput {
  _coord: PointerCoordinates;
  _deregScroll: Function;
  _disabled: boolean = false;
  _keyboardHeight: number;
  _scrollMove: EventListener;
  _type: string = 'text';
  _useAssist: boolean;
  _usePadding: boolean;
  _value: any = '';
  _isTouch: boolean;
  _autoFocusAssist: string;
  _autoComplete: string;
  _autoCorrect: string;
  _nav: NavControllerBase;
  _native: NativeInput;

  // Whether to clear after the user returns to the input and resumes editing
  _clearOnEdit: boolean;
  // A tracking flag to watch for the blur after editing to help with clearOnEdit
  _didBlurAfterEdit: boolean;

  inputControl: NgControl;

  constructor(
    config: Config,
    protected _form: Form,
    protected _item: Item,
    protected _app: App,
    protected _platform: Platform,
    elementRef: ElementRef,
    renderer: Renderer,
    protected _scrollView: Content,
    nav: NavController,
    ngControl: NgControl
  ) {
    super(config, elementRef, renderer, 'input');

    this._nav = <NavControllerBase>nav;
    this._useAssist = config.getBoolean('scrollAssist', false);
    this._usePadding = config.getBoolean('scrollPadding', this._useAssist);
    this._keyboardHeight = config.getNumber('keyboardHeight');

    this._autoFocusAssist = config.get('autoFocusAssist', 'delay');
    this._autoComplete = config.get('autocomplete', 'off');
    this._autoCorrect = config.get('autocorrect', 'off');

    if (ngControl) {
      ngControl.valueAccessor = this;
      this.inputControl = ngControl;
    }

    _form.register(this);
  }

  scrollMove(ev: UIEvent) {
    // scroll move event listener this instance can reuse
    console.debug(`input-base, scrollMove`);

    if (!(this._nav && this._nav.isTransitioning())) {
      this.deregScrollMove();

      if (this.hasFocus()) {
        this._native.hideFocus(true);

        this._scrollView.onScrollEnd(() => {
          this._native.hideFocus(false);

          if (this.hasFocus()) {
            // if it still has focus then keep listening
            this.regScrollMove();
          }
        });
      }
    }
  };

  setItemInputControlCss() {
    let item = this._item;
    let nativeInput = this._native;
    let inputControl = this.inputControl;

    // Set the control classes on the item
    if (item && inputControl) {
      this.setControlCss(item, inputControl);
    }

    // Set the control classes on the native input
    if (nativeInput && inputControl) {
      this.setControlCss(nativeInput, inputControl);
    }
  }

  setControlCss(element: any, control: NgControl) {
    element.setElementClass('ng-untouched', control.untouched);
    element.setElementClass('ng-touched', control.touched);
    element.setElementClass('ng-pristine', control.pristine);
    element.setElementClass('ng-dirty', control.dirty);
    element.setElementClass('ng-valid', control.valid);
    element.setElementClass('ng-invalid', !control.valid);
  }

  setValue(val: any) {
    this._value = val;
    this.checkHasValue(val);
  }

  setType(val: string) {
    this._type = 'text';

    if (val) {
      val = val.toLowerCase();

      if (/password|email|number|search|tel|url|date|month|time|week/.test(val)) {
        this._type = val;
      }
    }
  }

  setDisabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setElementClass('item-input-disabled', this._disabled);
    this._native && this._native.isDisabled(this._disabled);
  }

  setClearOnEdit(val: boolean) {
    this._clearOnEdit = isTrueProperty(val);
  }

  /**
  * Check if we need to clear the text input if clearOnEdit is enabled
  * @private
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
   * Overriden in child input
   * @private
   */
  clearTextInput() {}

  /**
   * @private
   */
  setNativeInput(nativeInput: NativeInput) {
    this._native = nativeInput;

    if (this._item && this._item.labelId !== null) {
      nativeInput.labelledBy(this._item.labelId);
    }

    nativeInput.valueChange.subscribe((inputValue: any) => {
      this.onChange(inputValue);
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
    this.setDisabled(this._disabled);

    var ionInputEle: HTMLElement = this._elementRef.nativeElement;
    let nativeInputEle: HTMLElement = nativeInput.element();

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
        setTimeout(() => {
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
   * @private
   */
  setNextInput(nextInput: NextInput) {
    if (nextInput) {
      nextInput.focused.subscribe(() => {
        this._form.tabFocus(this);
      });
    }
  }

  /**
   * @private
   * Angular2 Forms API method called by the model (Control) on change to update
   * the checked value.
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
   */
  writeValue(val: any) {
    this._value = val;
    this.checkHasValue(val);
  }

  /**
   * @private
   */
  onChange(val: any) {
    this.checkHasValue(val);
  }

  /**
   * onKeydown handler for clearOnEdit
   * @private
   */
  onKeydown(val: any) {
    if (this._clearOnEdit) {
      this.checkClearOnEdit(val);
    }
  }

  /**
   * @private
   */
  onTouched(val: any) {}

  /**
   * @private
   */
  hasFocus(): boolean {
    // check if an input has focus or not
    return this._native.hasFocus();
  }

  /**
   * @private
   */
  hasValue(): boolean {
    let inputValue = this._value;
    return (inputValue !== null && inputValue !== undefined && inputValue !== '');
  }

  /**
   * @private
   */
  checkHasValue(inputValue: any) {
    if (this._item) {
      let hasValue = (inputValue !== null && inputValue !== undefined && inputValue !== '');

      this._item.setElementClass('input-has-value', hasValue);
    }
  }

  /**
   * @private
   */
  focusChange(inputHasFocus: boolean) {
    if (this._item) {
      console.debug(`input-base, focusChange, inputHasFocus: ${inputHasFocus}, ${this._item.getNativeElement().nodeName}.${this._item.getNativeElement().className}`);
      this._item.setElementClass('input-has-focus', inputHasFocus);
    }
    if (!inputHasFocus) {
      this.deregScrollMove();
    }

    // If clearOnEdit is enabled and the input blurred but has a value, set a flag
    if (this._clearOnEdit && !inputHasFocus && this.hasValue()) {
      this._didBlurAfterEdit = true;
    }
  }

  pointerStart(ev: any) {
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

  pointerEnd(ev: any) {
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
   * @private
   */
  initFocus() {
    // begin the process of setting focus to the inner input element
    const scrollView = this._scrollView;

    console.debug(`input-base, initFocus(), scrollView: ${!!scrollView}`);

    if (scrollView) {
      // this input is inside of a scroll view
      // find out if text input should be manually scrolled into view

      // get container of this input, probably an ion-item a few nodes up
      let ele: HTMLElement = this._elementRef.nativeElement;
      ele = <HTMLElement>ele.closest('ion-item,[ion-item]') || ele;

      const scrollData = getScrollData(ele.offsetTop, ele.offsetHeight, scrollView.getContentDimensions(), this._keyboardHeight, this._platform.height());
      if (Math.abs(scrollData.scrollAmount) < 4) {
        // the text input is in a safe position that doesn't
        // require it to be scrolled into view, just set focus now
        this.setFocus();

        // all good, allow clicks again
        this._app.setEnabled(true);
        this._nav && this._nav.setTransitioning(false);
        this.regScrollMove();

        if (this._usePadding) {
          this._scrollView.clearScrollPaddingFocusOut();
        }
        return;
      }

      if (this._usePadding) {
        // add padding to the bottom of the scroll view (if needed)
        scrollView.addScrollPadding(scrollData.scrollPadding);
      }

      // manually scroll the text input to the top
      // do not allow any clicks while it's scrolling
      const scrollDuration = getScrollAssistDuration(scrollData.scrollAmount);
      this._app.setEnabled(false, scrollDuration);
      this._nav && this._nav.setTransitioning(true);

      // temporarily move the focus to the focus holder so the browser
      // doesn't freak out while it's trying to get the input in place
      // at this point the native text input still does not have focus
      this._native.beginFocus(true, scrollData.inputSafeY);

      // scroll the input into place
      scrollView.scrollTo(0, scrollData.scrollTo, scrollDuration, () => {
        console.debug(`input-base, scrollTo completed, scrollTo: ${scrollData.scrollTo}, scrollDuration: ${scrollDuration}`);
        // the scroll view is in the correct position now
        // give the native text input focus
        this._native.beginFocus(false, 0);

        // ensure this is the focused input
        this.setFocus();

        // all good, allow clicks again
        this._app.setEnabled(true);
        this._nav && this._nav.setTransitioning(false);
        this.regScrollMove();

        if (this._usePadding) {
          this._scrollView.clearScrollPaddingFocusOut();
        }
      });

    } else {
      // not inside of a scroll view, just focus it
      this.setFocus();
      this.regScrollMove();
    }
  }

  /**
   * @private
   */
  setFocus() {
    // immediately set focus
    this._form.setAsFocused(this);

    // set focus on the actual input element
    console.debug(`input-base, setFocus ${this._native.element().value}`);
    this._native.setFocus();

    // ensure the body hasn't scrolled down
    document.body.scrollTop = 0;
  }

  /**
   * @private
   * Angular2 Forms API method called by the view (formControlName) to register the
   * onChange event handler that updates the model (Control).
   * @param {Function} fn  the onChange event handler.
   */
  registerOnChange(fn: any) { this.onChange = fn; }

  /**
   * @private
   * Angular2 Forms API method called by the view (formControlName) to register
   * the onTouched event handler that marks model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  registerOnTouched(fn: any) { this.onTouched = fn; }

  /**
   * @private
   */
  regScrollMove() {
    // register scroll move listener
    if (this._useAssist && this._scrollView) {
      setTimeout(() => {
        this.deregScrollMove();
        this._deregScroll = this._scrollView.addScrollListener(this.scrollMove.bind(this));
      }, 80);
    }
  }

  /**
   * @private
   */
  deregScrollMove() {
    // deregister the scroll move listener
    this._deregScroll && this._deregScroll();
  }

  focusNext() {
    this._form.tabFocus(this);
  }
}



/**
 * @private
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


const SCROLL_ASSIST_SPEED = 0.3;

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
