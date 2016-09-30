import { ElementRef, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';

import { App } from '../app/app';
import { copyInputAttributes, PointerCoordinates, hasPointerMoved, pointerCoord }  from '../../util/dom';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { Form } from '../../util/form';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { NativeInput, NextInput } from './native-input';
import { NavController } from '../../navigation/nav-controller';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';


export class InputBase extends Ion {
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
    super(config, elementRef, renderer);

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
  checkHasValue(inputValue: any) {
    if (this._item) {
      this._item.setElementClass('input-has-value', !!(inputValue && inputValue !== ''));
    }
  }

  /**
   * @private
   */
  focusChange(inputHasFocus: boolean) {
    if (this._item) {
      this._item.setElementClass('input-has-focus', inputHasFocus);
    }
    if (!inputHasFocus) {
      this.deregScrollMove();
    }
  }

  pointerStart(ev: any) {
    // input cover touchstart
    console.debug('scroll assist pointerStart', ev.type);

    if (ev.type === 'touchstart') {
      this._isTouch = true;
    }

    if ((this._isTouch || (!this._isTouch && ev.type === 'mousedown')) && this._app.isEnabled()) {
      // remember where the touchstart/mousedown started
      this._coord = pointerCoord(ev);
    }
  }

  pointerEnd(ev: any) {
    // input cover touchend/mouseup
    console.debug('scroll assist pointerEnd', ev.type);

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
        console.debug('initFocus', ev.type);
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
    var scrollView = this._scrollView;

    if (scrollView) {
      // this input is inside of a scroll view
      // find out if text input should be manually scrolled into view

      // get container of this input, probably an ion-item a few nodes up
      var ele: HTMLElement = this._elementRef.nativeElement;
      ele = <HTMLElement>ele.closest('ion-item,[ion-item]') || ele;

      var scrollData = InputBase.getScrollData(ele.offsetTop, ele.offsetHeight, scrollView.getContentDimensions(), this._keyboardHeight, this._platform.height());
      if (scrollData.scrollAmount > -3 && scrollData.scrollAmount < 3) {
        // the text input is in a safe position that doesn't
        // require it to be scrolled into view, just set focus now
        this.setFocus();
        this.regScrollMove();
        return;
      }

      if (this._usePadding) {
        // add padding to the bottom of the scroll view (if needed)
        scrollView.addScrollPadding(scrollData.scrollPadding);
      }

      // manually scroll the text input to the top
      // do not allow any clicks while it's scrolling
      var scrollDuration = getScrollAssistDuration(scrollData.scrollAmount);
      this._app.setEnabled(false, scrollDuration);
      this._nav && this._nav.setTransitioning(true, scrollDuration);

      // temporarily move the focus to the focus holder so the browser
      // doesn't freak out while it's trying to get the input in place
      // at this point the native text input still does not have focus
      this._native.beginFocus(true, scrollData.inputSafeY);

      // scroll the input into place
      scrollView.scrollTo(0, scrollData.scrollTo, scrollDuration).then(() => {
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

  /**
   * @private
   */
  static getScrollData(inputOffsetTop: number, inputOffsetHeight: number, scrollViewDimensions: any, keyboardHeight: number, plaformHeight: number) {
    // compute input's Y values relative to the body
    let inputTop = (inputOffsetTop + scrollViewDimensions.contentTop - scrollViewDimensions.scrollTop);
    let inputBottom = (inputTop + inputOffsetHeight);

    // compute the safe area which is the viewable content area when the soft keyboard is up
    let safeAreaTop = scrollViewDimensions.contentTop;
    let safeAreaHeight = plaformHeight - keyboardHeight - safeAreaTop;
    safeAreaHeight /= 2;
    let safeAreaBottom = safeAreaTop + safeAreaHeight;

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

    let scrollData = {
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
    if (inputTopBelowSafeArea || inputBottomBelowSafeArea) {
      // Input top and bottom below safe area
      // auto scroll the input up so at least the top of it shows

      if (safeAreaHeight > inputOffsetHeight) {
        // safe area height is taller than the input height, so we
        // can bring it up the input just enough to show the input bottom
        scrollData.scrollAmount = Math.round(safeAreaBottom - inputBottom);

      } else {
        // safe area height is smaller than the input height, so we can
        // only scroll it up so the input top is at the top of the safe area
        // however the input bottom will be below the safe area
        scrollData.scrollAmount = Math.round(safeAreaTop - inputTop);
      }

      scrollData.inputSafeY = -(inputTop - safeAreaTop) + 4;

    } else if (inputTopAboveSafeArea) {
      // Input top above safe area
      // auto scroll the input down so at least the top of it shows
      scrollData.scrollAmount = Math.round(safeAreaTop - inputTop);

      scrollData.inputSafeY = (safeAreaTop - inputTop) + 4;
    }

    // figure out where it should scroll to for the best position to the input
    scrollData.scrollTo = (scrollViewDimensions.scrollTop - scrollData.scrollAmount);

    if (scrollData.scrollAmount < 0) {
      // when auto-scrolling up, there also needs to be enough
      // content padding at the bottom of the scroll view
      // manually add it if there isn't enough scrollable area

      // figure out how many scrollable area is left to scroll up
      let availablePadding = (scrollViewDimensions.scrollHeight - scrollViewDimensions.scrollTop) - scrollViewDimensions.contentHeight;

      let paddingSpace = availablePadding + scrollData.scrollAmount;
      if (paddingSpace < 0) {
        // there's not enough scrollable area at the bottom, so manually add more
        scrollData.scrollPadding = (scrollViewDimensions.contentHeight - safeAreaHeight);
      }
    }

    // if (!window.safeAreaEle) {
    //   window.safeAreaEle = document.createElement('div');
    //   window.safeAreaEle.style.position = 'absolute';
    //   window.safeAreaEle.style.background = 'rgba(0, 128, 0, 0.7)';
    //   window.safeAreaEle.style.padding = '2px 5px';
    //   window.safeAreaEle.style.textShadow = '1px 1px white';
    //   window.safeAreaEle.style.left = '0px';
    //   window.safeAreaEle.style.right = '0px';
    //   window.safeAreaEle.style.fontWeight = 'bold';
    //   window.safeAreaEle.style.pointerEvents = 'none';
    //   document.body.appendChild(window.safeAreaEle);
    // }
    // window.safeAreaEle.style.top = safeAreaTop + 'px';
    // window.safeAreaEle.style.height = safeAreaHeight + 'px';
    // window.safeAreaEle.innerHTML = `
    //   <div>scrollTo: ${scrollData.scrollTo}</div>
    //   <div>scrollAmount: ${scrollData.scrollAmount}</div>
    //   <div>scrollPadding: ${scrollData.scrollPadding}</div>
    //   <div>inputSafeY: ${scrollData.inputSafeY}</div>
    //   <div>scrollHeight: ${scrollViewDimensions.scrollHeight}</div>
    //   <div>scrollTop: ${scrollViewDimensions.scrollTop}</div>
    //   <div>contentHeight: ${scrollViewDimensions.contentHeight}</div>
    // `;

    return scrollData;
  }
}

const SCROLL_ASSIST_SPEED = 0.3;

function getScrollAssistDuration(distanceToScroll: number) {
  distanceToScroll = Math.abs(distanceToScroll);
  let duration = distanceToScroll / SCROLL_ASSIST_SPEED;
  return Math.min(400, Math.max(150, duration));
}
