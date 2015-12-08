import {Component, Directive, Attribute, NgIf, forwardRef, Host, Optional, ElementRef, Renderer, Attribute} from 'angular2/angular2';

import {NavController} from '../nav/nav-controller';
import {Config} from '../../config/config';
import {Form} from '../../util/form';
import {Label} from './label';
import {IonicApp} from '../app/app';
import {Content} from '../content/content';
import * as dom  from '../../util/dom';
import {Platform} from '../../platform/platform';


/**
 * @name Input
 * @module ionic
 * @description
 * `ionInput` is a generic wrapper for both inputs and textareas. You can give `ion-input` to tell it how to handle a chile `ion-label` component
 * @property [fixed-labels] - a persistant label that sits next the the input
 * @property [floating-labels] - a label that will float about the input if the input is empty of looses focus
 * @property [stacked-labels] - A stacked label will always appear on top of the input
 * @usage
 * ```html
 *  <ion-input>
 *    <ion-label>Username</ion-label>
 *    <input type="text" value="">
 *  </ion-input>
 *
 *  <ion-input>
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
    '[class.ng-untouched]': 'addNgClass("ng-untouched")',
    '[class.ng-touched]': 'addNgClass("ng-touched")',
    '[class.ng-pristine]': 'addNgClass("ng-pristine")',
    '[class.ng-dirty]': 'addNgClass("ng-dirty")',
    '[class.ng-valid]': 'addNgClass("ng-valid")',
    '[class.ng-invalid]': 'addNgClass("ng-invalid")'
  },
  template:
    '<div class="item-inner">' +
      '<ng-content></ng-content>' +
      '<input [type]="type" aria-hidden="true" scroll-assist *ng-if="scrollAssist">' +
    '</div>',
  directives: [NgIf, forwardRef(() => InputScrollAssist)]
})
export class TextInput {

  constructor(
    form: Form,
    elementRef: ElementRef,
    config: Config,
    renderer: Renderer,
    app: IonicApp,
    platform: Platform,
    @Optional() @Host() scrollView: Content,
    @Optional() navCtrl: NavController,
    @Attribute('floating-label') isFloating: string,
    @Attribute('stacked-label') isStacked: string,
    @Attribute('fixed-label') isFixed: string
  ) {
    this.renderer = renderer;

    this.form = form;
    form.register(this);

    this.type = 'text';
    this.lastTouch = 0;

    // make more gud with pending @Attributes API
    this.displayType = (isFloating === '' ? 'floating' : (isStacked === '' ? 'stacked' : (isFixed === '' ? 'fixed' : null)));

    this.app = app;
    this.elementRef = elementRef;
    this.platform = platform;
    this.navCtrl = navCtrl;

    this.scrollView = scrollView;
    this.scrollAssist = config.get('scrollAssist');
    this.keyboardHeight = config.get('keyboardHeight');
  }

  /**
   * @private
   * This function is used to add the Angular css classes associated with inputs in forms
   */
   addNgClass(className) {
     return this.input.elementRef.nativeElement.classList.contains(className);
   }

  /**
   * @private
   */
  registerInput(textInputElement) {
    if (this.displayType) {
      textInputElement.addClass(this.displayType + '-input');
    }
    this.input = textInputElement;
    this.type = textInputElement.type || 'text';
  }

  /**
   * @private
   */
  registerLabel(label) {
    if (this.displayType) {
      label.addClass(this.displayType + '-label');
    }
    this.label = label;
  }

  /**
   * @private
   */
  onInit() {
    if (this.input && this.label) {
      // if there is an input and an label
      // then give the label an ID
      // and tell the input the ID of who it's labelled by
      this.input.labelledBy(this.label.id);
    }

    let self = this;
    self.scrollMove = (ev) => {
      if (!(this.navCtrl && this.navCtrl.isTransitioning())) {
        self.deregMove();

        if (self.hasFocus) {
          self.input.hideFocus(true);
          this.scrollView.onScrollEnd(() => {
            self.input.hideFocus(false);

            if (self.hasFocus) {
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
  pointerStart(ev) {
    if (this.scrollAssist && this.app.isEnabled()) {
      // remember where the touchstart/mousedown started
      this.startCoord = dom.pointerCoord(ev);
    }
  }

  /**
   * @private
   */
  pointerEnd(ev) {
    if (!this.app.isEnabled()) {
      ev.preventDefault();
      ev.stopPropagation();

    } else if (this.scrollAssist && ev.type === 'touchend') {
      // get where the touchend/mouseup ended
      let endCoord = dom.pointerCoord(ev);

      // focus this input if the pointer hasn't moved XX pixels
      // and the input doesn't already have focus
      if (!dom.hasPointerMoved(8, this.startCoord, endCoord) && !this.hasFocus) {
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

    let scrollView = this.scrollView;

    if (scrollView && this.scrollAssist) {
      // this input is inside of a scroll view

      // find out if text input should be manually scrolled into view
      let ele = this.elementRef.nativeElement;

      let scrollData = TextInput.getScrollData(ele.offsetTop, ele.offsetHeight, scrollView.getDimensions(), this.keyboardHeight, this.platform.height());
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
      this.app.setEnabled(false, scrollDuration);
      this.navCtrl && this.navCtrl.setTransitioning(true, scrollDuration);

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
        this.app.setEnabled(true);
        this.navCtrl && this.navCtrl.setTransitioning(false);
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
   * @param {TODO} inputOffsetTop  TODO
   * @param {TODO} inputOffsetHeight  TODO
   * @param {TODO} scrollViewDimensions  TODO
   * @param {TODO} keyboardHeight  TODO
   * @returns {TODO} TODO
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

  /**
   * @private
   */
  focusChange(hasFocus) {
    this.renderer.setElementClass(this.elementRef, 'input-focused', hasFocus);
    if (!hasFocus) {
      this.deregMove();
      this.input.hideFocus(false);
    }
  }

  /**
   * @private
   */
  hasValue(inputValue) {
    this.renderer.setElementClass(this.elementRef, 'input-has-value', inputValue && inputValue !== '');
  }

  /**
   * @private
   */
  setFocus() {
    if (this.input) {
      this.form.setAsFocused(this);

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
    if (this.scrollAssist && this.scrollView) {
      setTimeout(() => {
        this.deregMove();
        this.deregScroll = this.scrollView.addScrollEventListener(this.scrollMove);
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
  get hasFocus() {
    return !!this.input && this.input.hasFocus;
  }

  /**
   * @private
   */
  onDestroy() {
    this.deregMove();
    this.form.deregister(this);
  }

}


/**
 * @private
 */
@Directive({
  selector: 'textarea,input[type=text],input[type=password],input[type=number],input[type=search],input[type=email],input[type=url],input[type=tel]',
  inputs: ['value'],
  host: {
    '(focus)': 'focusChange(true)',
    '(blur)': 'focusChange(false)',
    '(keyup)': 'onKeyup($event)'
  }
})
export class TextInputElement {

  constructor(
    @Attribute('type') type: string,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() wrapper: TextInput
  ) {
    this.type = type;
    this.elementRef = elementRef;
    this.wrapper = wrapper;
    this.renderer = renderer;

    // all text inputs (textarea, input[type=text],input[type=password], etc)
    renderer.setElementClass(elementRef, 'text-input', true);

    if (wrapper) {
      // it's within ionic's ion-input, let ion-input handle what's up
      renderer.setElementClass(elementRef, 'item-input', true);
      wrapper.registerInput(this);
    }
  }

  onInit() {
    this.wrapper && this.wrapper.hasValue(this.value);
  }

  focusChange(changed) {
    this.wrapper && this.wrapper.focusChange(changed);
  }

  onKeyup(ev) {
    this.wrapper && this.wrapper.hasValue(ev.target.value);
  }

  labelledBy(val) {
    this.renderer.setElementAttribute(this.elementRef, 'aria-labelledby', val);
  }

  setFocus() {
    this.getNativeElement().focus();
  }

  relocate(shouldRelocate, inputRelativeY) {
    if (this._relocated !== shouldRelocate) {

      let focusedInputEle = this.getNativeElement();
      if (shouldRelocate) {
        let clonedInputEle = cloneInput(focusedInputEle, 'cloned-input');

        focusedInputEle.classList.add('hide-focused-input');
        focusedInputEle.style[dom.CSS.transform] = `translate3d(-9999px,${inputRelativeY}px,0)`;
        focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);

        this.wrapper.setFocus();

      } else {
        focusedInputEle.classList.remove('hide-focused-input');
        focusedInputEle.style[dom.CSS.transform] = '';
        let clonedInputEle = focusedInputEle.parentNode.querySelector('.cloned-input');
        if (clonedInputEle) {
          clonedInputEle.parentNode.removeChild(clonedInputEle);
        }
      }

      this._relocated = shouldRelocate;
    }
  }

  hideFocus(shouldHideFocus) {
    let focusedInputEle = this.getNativeElement();

    if (shouldHideFocus) {
      let clonedInputEle = cloneInput(focusedInputEle, 'cloned-hidden');

      focusedInputEle.classList.add('hide-focused-input');
      focusedInputEle.style[dom.CSS.transform] = 'translate3d(-9999px,0,0)';
      focusedInputEle.parentNode.insertBefore(clonedInputEle, focusedInputEle);

    } else {
      focusedInputEle.classList.remove('hide-focused-input');
      focusedInputEle.style[dom.CSS.transform] = '';
      let clonedInputEle = focusedInputEle.parentNode.querySelector('.cloned-hidden');
      if (clonedInputEle) {
        clonedInputEle.parentNode.removeChild(clonedInputEle);
      }
    }
  }

  get hasFocus() {
    return dom.hasFocus(this.getNativeElement());
  }

  addClass(className) {
    this.renderer.setElementClass(this.elementRef, className, true);
  }

  getNativeElement() {
    return this.elementRef.nativeElement;
  }

}

/**
 * @private
 */
@Directive({
  selector: '[scroll-assist]',
  host: {
    '(focus)': 'receivedFocus($event)'
  }
})
class InputScrollAssist {

  constructor(form: Form, textInput: TextInput) {
    this.form = form;
    this.textInput = textInput;
  }

  receivedFocus(ev) {
    this.form.focusNext(this.textInput);
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
