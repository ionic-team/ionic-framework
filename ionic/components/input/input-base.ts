import {Directive, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Config} from '../../config/config';
import {Content} from '../content/content';
import {Form} from '../../util/form';
import {Item} from '../item/item';
import {IonicApp} from '../app/app';
import {isTrueProperty} from '../../util/util';
import {Label} from '../label/label';
import {pointerCoord, hasPointerMoved, closest, copyInputAttributes}  from '../../util/dom';
import {NavController} from '../nav/nav-controller';
import {NativeInput, NextInput} from './native-input';
import {Platform} from '../../platform/platform';


export class InputBase {
  protected _coord;
  protected _deregScroll;
  protected _disabled: boolean = false;
  protected _keyboardHeight;
  protected _scrollMove: EventListener;
  protected _type: string = 'text';
  protected _useAssist: boolean = true;
  protected _value = '';
  protected _isTouch: boolean;
  protected _autoFocusAssist: string;
  protected _autoComplete: string;
  protected _autoCorrect: string;

  inputControl: NgControl;

  @Input() clearInput;
  @Input() placeholder: string = '';
  @ViewChild(NativeInput) protected _native: NativeInput;
  @Output() blur: EventEmitter<Event> = new EventEmitter;
  @Output() focus: EventEmitter<Event> = new EventEmitter;

  constructor(
    config: Config,
    protected _form: Form,
    protected _item: Item,
    protected _app: IonicApp,
    protected _platform: Platform,
    protected _elementRef: ElementRef,
    protected _scrollView: Content,
    protected _nav: NavController,
    ngControl: NgControl
  ) {
    this._useAssist = config.get('scrollAssist');
    this._keyboardHeight = config.get('keyboardHeight');

    this._autoFocusAssist = config.get('autoFocusAssist', 'delay');
    this._autoComplete = config.get('autocomplete', 'off');
    this._autoCorrect = config.get('autocorrect', 'off');

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    _form.register(this);
  }

  ngOnInit() {
    if (this._item) {
      this._item.setCssClass('item-input', true);
      this._item.registerInput(this._type);
    }

    let clearInput = this.clearInput;
    if (typeof clearInput === 'string') {
      this.clearInput = (clearInput === '' || clearInput === 'true');
    }
  }

  ngAfterContentInit() {
    let self = this;

    self._scrollMove = function(ev: UIEvent) {
      // scroll move event listener this instance can reuse
      if (!(self._nav && self._nav.isTransitioning())) {
        self.deregScrollMove();

        if (self.hasFocus()) {
          self._native.hideFocus(true);

          self._scrollView.onScrollEnd(function() {
            self._native.hideFocus(false);

            if (self.hasFocus()) {
              // if it still has focus then keep listening
              self.regScrollMove();
            }
          });
        }
      }
    };

    this.setItemControlCss();
  }

  ngAfterContentChecked() {
    this.setItemControlCss();
  }

  private setItemControlCss() {
    let item = this._item;
    let nativeControl = this._native && this._native.ngControl;

    if (item && nativeControl) {
      item.setCssClass('ng-untouched', nativeControl.untouched);
      item.setCssClass('ng-touched', nativeControl.touched);
      item.setCssClass('ng-pristine', nativeControl.pristine);
      item.setCssClass('ng-dirty', nativeControl.dirty);
      item.setCssClass('ng-valid', nativeControl.valid);
      item.setCssClass('ng-invalid', !nativeControl.valid);
    }
  }

  ngOnDestroy() {
    this._form.deregister(this);
  }

  @Input()
  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }

  @Input()
  get type() {
    return this._type;
  }

  set type(val) {
    this._type = 'text';

    if (val) {
      val = val.toLowerCase();

      if (/password|email|number|search|tel|url|date|month|time|week/.test(val)) {
        this._type = val;
      }
    }
  }

  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-input-disabled', this._disabled);
    this._native && this._native.isDisabled(this._disabled);
  }

  /**
   * @private
   */
  @ViewChild(NativeInput)
  private set _nativeInput(nativeInput: NativeInput) {
    this._native = nativeInput;

    if (this._item && this._item.labelId !== null) {
      nativeInput.labelledBy(this._item.labelId);
    }

    nativeInput.valueChange.subscribe(inputValue => {
      this.onChange(inputValue);
    });

    this.focusChange(this.hasFocus());
    nativeInput.focusChange.subscribe(textInputHasFocus => {
      this.focusChange(textInputHasFocus);
      this.checkHasValue(nativeInput.getValue());
      if (!textInputHasFocus) {
        this.onTouched(textInputHasFocus);
      }
    });

    this.checkHasValue(nativeInput.getValue());
    this.disabled = this._disabled;

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

    // by default set autocomplete="off" unless specified by the input
    if (ionInputEle.hasAttribute('autocorrect')) {
      this._autoCorrect = ionInputEle.getAttribute('autocorrect');
    }
    nativeInputEle.setAttribute('autocorrect', this._autoCorrect);
  }

  /**
   * @private
   */
  @ViewChild(NextInput)
  private set _nextInput(nextInput: NextInput) {
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
  writeValue(val) {
    this._value = val;
    this.checkHasValue(val);
  }

  /**
   * @private
   */
  onChange(val) {
    this.checkHasValue(val);
  }

  /**
   * @private
   */
  onTouched(val) {}

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
  checkHasValue(inputValue) {
    if (this._item) {
      this._item.setCssClass('input-has-value', !!(inputValue && inputValue !== ''));
    }
  }

  /**
   * @private
   */
  focusChange(inputHasFocus: boolean) {
    if (this._item) {
      this._item.setCssClass('input-has-focus', inputHasFocus);
    }
    if (!inputHasFocus) {
      this.deregScrollMove();
    }
  }

  private pointerStart(ev) {
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

  private pointerEnd(ev) {
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
    let scrollView = this._scrollView;

    if (scrollView) {
      // this input is inside of a scroll view

      // find out if text input should be manually scrolled into view
      let ele = this._elementRef.nativeElement;
      let itemEle = closest(ele, 'ion-item');
      if (itemEle) {
        ele = itemEle;
      }

      let scrollData = InputBase.getScrollData(ele.offsetTop, ele.offsetHeight, scrollView.getContentDimensions(), this._keyboardHeight, this._platform.height());
      if (scrollData.scrollAmount > -3 && scrollData.scrollAmount < 3) {
        // the text input is in a safe position that doesn't
        // require it to be scrolled into view, just set focus now
        this.setFocus();
        this.regScrollMove();
        return;
      }

      // add padding to the bottom of the scroll view (if needed)
      scrollView.addScrollPadding(scrollData.scrollPadding);

      // manually scroll the text input to the top
      // do not allow any clicks while it's scrolling
      let scrollDuration = getScrollAssistDuration(scrollData.scrollAmount);
      this._app.setEnabled(false, scrollDuration);
      this._nav && this._nav.setTransitioning(true, scrollDuration);

      // temporarily move the focus to the focus holder so the browser
      // doesn't freak out while it's trying to get the input in place
      // at this point the native text input still does not have focus
      this._native.relocate(true, scrollData.inputSafeY);

      // scroll the input into place
      scrollView.scrollTo(0, scrollData.scrollTo, scrollDuration).then(() => {
        // the scroll view is in the correct position now
        // give the native text input focus
        this._native.relocate(false, 0);

        this.setFocus();

        // all good, allow clicks again
        this._app.setEnabled(true);
        this._nav && this._nav.setTransitioning(false);
        this.regScrollMove();
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
  clearTextInput() {
    console.debug('Should clear input');
  }

  /**
   * @private
   */
  private setFocus() {
    // immediately set focus
    this._form.setAsFocused(this);

    // set focus on the actual input element
    this._native.setFocus();

    // ensure the body hasn't scrolled down
    document.body.scrollTop = 0;
  }

  /**
   * @private
   * Angular2 Forms API method called by the view (NgControl) to register the
   * onChange event handler that updates the model (Control).
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L27
   * @param {Function} fn  the onChange event handler.
   */
  registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   * Angular2 Forms API method called by the the view (NgControl) to register
   * the onTouched event handler that marks model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  private regScrollMove() {
    // register scroll move listener
    if (this._useAssist && this._scrollView) {
      setTimeout(() => {
        this.deregScrollMove();
        this._deregScroll = this._scrollView.addScrollListener(this._scrollMove);
      }, 80);
    }
  }

  /**
   * @private
   */
  private deregScrollMove() {
    // deregister the scroll move listener
    this._deregScroll && this._deregScroll();
  }

  focusNext() {
    this._form.tabFocus(this);
  }

  /**
   * @private
   */
  static getScrollData(inputOffsetTop, inputOffsetHeight, scrollViewDimensions, keyboardHeight, plaformHeight) {
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

function getScrollAssistDuration(distanceToScroll) {
  distanceToScroll = Math.abs(distanceToScroll);
  let duration = distanceToScroll / SCROLL_ASSIST_SPEED;
  return Math.min(400, Math.max(150, duration));
}
