import {Component, Directive, Attribute, forwardRef, Host, Optional, ElementRef, Renderer, Input, Output, EventEmitter, ContentChild, ContentChildren, HostListener} from 'angular2/core';
import {NgIf} from 'angular2/common';

import {NavController} from '../nav/nav-controller';
import {Config} from '../../config/config';
import {Form} from '../../util/form';
import {Label} from '../label/label';
import {IonicApp} from '../app/app';
import {Content} from '../content/content';
import {CSS, hasFocus, pointerCoord, hasPointerMoved}  from '../../util/dom';
import {Platform} from '../../platform/platform';
import {Button} from '../button/button';
import {Icon} from '../icon/icon';


/**
 * @private
 */
@Directive({
  selector: 'textarea,input[type=text],input[type=password],input[type=number],input[type=search],input[type=email],input[type=url],input[type=tel],input[type=date],input[type=datetime],input[type=datetime-local],input[type=week],input[type=time]',
  host: {
    'class': 'text-input'
  }
})
export class TextInputElement {
  @Input() value: string;
  @Input() ngModel: any;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() focusChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    @Attribute('type') type: string,
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {
    this.type = type || 'text';
  }

  ngOnInit() {
    if (this.ngModel) {
      this.value = this.ngModel;
    } else {
      this.value = this._elementRef.nativeElement.value;
    }
  }

  @HostListener('keyup', ['$event'])
  _keyup(ev) {
    this.valueChange.emit(ev.target.value);
  }

  @HostListener('focus')
  _focus() {
    this.focusChange.emit(true);
  }

  @HostListener('blur')
  _blur() {
    this.focusChange.emit(false);
    this.hideFocus(false);
  }

  labelledBy(val) {
    this._renderer.setElementAttribute(this._elementRef, 'aria-labelledby', val);
  }

  setFocus() {
    this.element().focus();
  }

  relocate(shouldRelocate, inputRelativeY) {
    if (this._relocated !== shouldRelocate) {

      let focusedInputEle = this.element();
      if (shouldRelocate) {
        let clonedInputEle = cloneInput(focusedInputEle, 'cloned-input');

        focusedInputEle.classList.add('hide-focused-input');
        focusedInputEle.style[CSS.transform] = `translate3d(-9999px,${inputRelativeY}px,0)`;
        focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);

        this.setFocus();

      } else {
        focusedInputEle.classList.remove('hide-focused-input');
        focusedInputEle.style[CSS.transform] = '';
        let clonedInputEle = focusedInputEle.parentNode.querySelector('.cloned-input');
        if (clonedInputEle) {
          clonedInputEle.parentNode.removeChild(clonedInputEle);
        }
      }

      this._relocated = shouldRelocate;
    }
  }

  hideFocus(shouldHideFocus) {
    let focusedInputEle = this.element();

    if (shouldHideFocus) {
      let clonedInputEle = cloneInput(focusedInputEle, 'cloned-hidden');

      focusedInputEle.classList.add('hide-focused-input');
      focusedInputEle.style[CSS.transform] = 'translate3d(-9999px,0,0)';
      focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);

    } else {
      focusedInputEle.classList.remove('hide-focused-input');
      focusedInputEle.style[CSS.transform] = '';
      let clonedInputEle = focusedInputEle.parentNode.querySelector('.cloned-hidden');
      if (clonedInputEle) {
        clonedInputEle.parentNode.removeChild(clonedInputEle);
      }
    }
  }

  hasFocus() {
    return hasFocus(this.element());
  }

  addClass(className) {
    this._renderer.setElementClass(this._elementRef, className, true);
  }

  hasClass(className) {
    this._elementRef.nativeElement.classList.contains(className);
  }

  element() {
    return this._elementRef.nativeElement;
  }

}


/**
 * @name Input
 * @module ionic
 * @description
 *
 * `ion-input` is a generic wrapper for both inputs and textareas. You can give `ion-input` attributes to tell it how to handle a child `ion-label` component.
 *
 * @property [fixed-label] - a persistant label that sits next the the input
 * @property [floating-label] - a label that will float about the input if the input is empty of looses focus
 * @property [stacked-label] - A stacked label will always appear on top of the input
 * @property [inset] - The input will be inset
 * @property [clearInput] - A clear icon will appear in the input which clears it
 *
 * @usage
 * ```html
 *  <ion-input>
 *    <ion-label>Username</ion-label>
 *    <input type="text" value="">
 *  </ion-input>
 *
 *  <ion-input clearInput>
 *    <input type="text" placeholder="Username">
 *  </ion-input>
 *
 *  <ion-input fixed-label>
 *    <ion-label>Username</ion-label>
 *    <input type="text" value="">
 *  </ion-input>
 *
 *  <ion-input floating-label>
 *    <ion-label>Username</ion-label>
 *    <input type="text" value="">
 *  </ion-input>
 * ```
 *
 */

@Component({
  selector: 'ion-input',
  host: {
    '(touchstart)': 'pointerStart($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mouseup)': 'pointerEnd($event)',
    'class': 'item',
    '[class.ng-untouched]': 'hasClass("ng-untouched")',
    '[class.ng-touched]': 'hasClass("ng-touched")',
    '[class.ng-pristine]': 'hasClass("ng-pristine")',
    '[class.ng-dirty]': 'hasClass("ng-dirty")',
    '[class.ng-valid]': 'hasClass("ng-valid")',
    '[class.ng-invalid]': 'hasClass("ng-invalid")'
  },
  template:
    '<div class="item-inner">' +
      '<ng-content></ng-content>' +
      '<input [type]="type" aria-hidden="true" scroll-assist *ngIf="_assist">' +
      '<button clear *ngIf="clearInput && value" class="text-input-clear-icon" (click)="clearTextInput()" (mousedown)="clearTextInput()"></button>' +
    '</div>',
  directives: [NgIf, forwardRef(() => InputScrollAssist), forwardRef(() => TextInputElement), Button]
})
export class TextInput {
  /**
   * @private
   */
  @Input() clearInput: any;
  value: string = '';

  constructor(
    config: Config,
    private _form: Form,
    private _renderer: Renderer,
    private _elementRef: ElementRef,
    private _app: IonicApp,
    private _platform: Platform,
    @Optional() @Host() private _scrollView: Content,
    @Optional() private _nav: NavController,
    @Attribute('floating-label') isFloating: string,
    @Attribute('stacked-label') isStacked: string,
    @Attribute('fixed-label') isFixed: string,
    @Attribute('inset') isInset: string
  ) {
    _form.register(this);

    this.type = 'text';
    this.lastTouch = 0;

    // make more gud with pending @Attributes API
    this.displayType = (isFloating === '' ? 'floating' : (isStacked === '' ? 'stacked' : (isFixed === '' ? 'fixed' : (isInset === '' ? 'inset' : null))));

    this._assist = config.get('scrollAssist');
    this.keyboardHeight = config.get('keyboardHeight');
  }

  /**
   * @private
   */
  @ContentChild(TextInputElement)
  set _setInput(textInputElement) {
    if (textInputElement) {
      textInputElement.addClass('item-input');
      if (this.displayType) {
        textInputElement.addClass(this.displayType + '-input');
      }
      this.input = textInputElement;
      this.type = textInputElement.type;

      this.hasValue(this.input.value);
      textInputElement.valueChange.subscribe(inputValue => {
        this.hasValue(inputValue);
      });

      this.focusChange(this.hasFocus());
      textInputElement.focusChange.subscribe(hasFocus => {
        this.focusChange(hasFocus);
      });

    } else {
      console.error('<input> or <textarea> elements required within <ion-input>')
    }
  }

  /**
   * @private
   */
  @ContentChild(Label)
  set _setLabel(label) {
    if (label && this.displayType) {
      label.addClass(this.displayType + '-label');
    }
    this.label = label;
  }

  /**
   * @private
   */
  @ContentChildren(Button)
  set _buttons(buttons) {
    buttons.toArray().forEach(button => {
      if (!button.isItem) {
        button.addClass('item-button');
      }
    });
  }

  /**
   * @private
   */
  @ContentChildren(Icon)
  set _icons(icons) {
    icons.toArray().forEach(icon => {
      icon.addClass('item-icon');
    });
  }

  /**
   * @private
   * On Initialization check for attributes
   */
  ngOnInit() {
    let clearInput = this.clearInput;
    if (typeof clearInput === 'string') {
      this.clearInput = (clearInput === '' || clearInput === 'true');
    }
  }

  /**
   * @private
   */
  ngAfterViewInit() {
    let self = this;
    if (self.input && self.label) {
      // if there is an input and a label
      // then give the label an ID
      // and tell the input the ID of who it's labelled by
      self.input.labelledBy(self.label.id);
    }

    self.scrollMove = function(ev) {
      if (!(self._nav && self._nav.isTransitioning())) {
        self.deregMove();

        if (self.hasFocus()) {
          self.input.hideFocus(true);
          self._scrollView.onScrollEnd(function() {
            self.input.hideFocus(false);

            if (self.hasFocus()) {
              self.regMove();
            }
          });
        }
      }
    };
  }

  /**
    * @private
   */
  clearTextInput() {
    console.log("Should clear input");
    console.log(this.textInputElement.value);
  }

  /**
   * @private
   */
  pointerStart(ev) {
    if (this._assist && this._app.isEnabled()) {
      // remember where the touchstart/mousedown started
      this.startCoord = pointerCoord(ev);
    }
  }

  /**
   * @private
   */
  pointerEnd(ev) {
    if (!this._app.isEnabled()) {
      ev.preventDefault();
      ev.stopPropagation();

    } else if (this._assist && ev.type === 'touchend') {
      // get where the touchend/mouseup ended
      let endCoord = pointerCoord(ev);

      // focus this input if the pointer hasn't moved XX pixels
      // and the input doesn't already have focus
      if (!hasPointerMoved(8, this.startCoord, endCoord) && !this.hasFocus()) {
        ev.preventDefault();
        ev.stopPropagation();

        this.initFocus();

        // temporarily prevent mouseup's from focusing
        this.lastTouch = Date.now();
      }

    } else if (this.lastTouch + 999 < Date.now()) {
      ev.preventDefault();
      ev.stopPropagation();

      this.setFocus();
      this.regMove();
    }
  }

  /**
   * @private
   */
  initFocus() {
    // begin the process of setting focus to the inner input element

    let scrollView = this._scrollView;

    if (scrollView && this._assist) {
      // this input is inside of a scroll view

      // find out if text input should be manually scrolled into view
      let ele = this._elementRef.nativeElement;

      let scrollData = TextInput.getScrollData(ele.offsetTop, ele.offsetHeight, scrollView.getDimensions(), this.keyboardHeight, this._platform.height());
      if (scrollData.scrollAmount > -3 && scrollData.scrollAmount < 3) {
        // the text input is in a safe position that doesn't require
        // it to be scrolled into view, just set focus now
        this.setFocus();
        this.regMove();
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
      this.input.relocate(true, scrollData.inputSafeY);

      // scroll the input into place
      scrollView.scrollTo(0, scrollData.scrollTo, scrollDuration).then(() => {
        // the scroll view is in the correct position now
        // give the native text input focus
        this.input.relocate(false);

        // all good, allow clicks again
        this._app.setEnabled(true);
        this._nav && this._nav.setTransitioning(false);
        this.regMove();
      });

    } else {
      // not inside of a scroll view, just focus it
      this.setFocus();
      this.regMove();
    }

  }

  /**
   * @private
   */
  setFocus() {
    if (this.input) {
      this._form.setAsFocused(this);

      // set focus on the actual input element
      this.input.setFocus();

      // ensure the body hasn't scrolled down
      document.body.scrollTop = 0;
    }
  }

  /**
   * @private
   */
  regMove() {
    if (this._assist && this._scrollView) {
      setTimeout(() => {
        this.deregMove();
        this.deregScroll = this._scrollView.addScrollEventListener(this.scrollMove);
      }, 80);
    }
  }

  /**
   * @private
   */
  deregMove() {
    this.deregScroll && this.deregScroll();
  }

  /**
   * @private
   */
  focusChange(hasFocus) {
    this._renderer.setElementClass(this._elementRef, 'input-focused', hasFocus);
    if (!hasFocus) {
      this.deregMove();
    }
  }

  /**
   * @private
   */
  hasFocus() {
    return !!this.input && this.input.hasFocus();
  }

  /**
   * @private
   */
  hasValue(inputValue) {
    let inputHasValue = !!(inputValue && inputValue !== '');
    this._renderer.setElementClass(this._elementRef, 'input-has-value', inputHasValue);
  }

  /**
   * @private
   * This function is used to add the Angular css classes associated with inputs in forms
   */
  hasClass(className) {
    this.input && this.input.hasClass(className);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this.deregMove();
    this._form.deregister(this);
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

/**
 * @private
 */
@Directive({
  selector: '[scroll-assist]'
})
class InputScrollAssist {

  constructor(private _form: Form, private _input: TextInput) {}

  @HostListener('focus')
  receivedFocus() {
    this._form.focusNext(this._input);
  }

}

function cloneInput(srcInput, addCssClass) {
  let clonedInputEle = srcInput.cloneNode(true);
  clonedInputEle.classList.add(addCssClass);
  clonedInputEle.classList.remove('hide-focused-input');
  clonedInputEle.setAttribute('aria-hidden', true);
  clonedInputEle.removeAttribute('aria-labelledby');
  clonedInputEle.tabIndex = -1;
  return clonedInputEle;
}

const SCROLL_ASSIST_SPEED = 0.4;

function getScrollAssistDuration(distanceToScroll) {
  //return 3000;
  distanceToScroll = Math.abs(distanceToScroll);
  let duration = distanceToScroll / SCROLL_ASSIST_SPEED;
  return Math.min(400, Math.max(100, duration));
}
