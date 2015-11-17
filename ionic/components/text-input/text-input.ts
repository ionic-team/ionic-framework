import {Component, Directive, NgIf, forwardRef, Host, Optional, ElementRef, Renderer, Attribute} from 'angular2/angular2';

import {Config} from '../../config/config';
import {Form} from '../../util/form';
import {Label} from './label';
import {IonicApp} from '../app/app';
import {Content} from '../content/content';
import * as dom  from '../../util/dom';
import {Platform} from '../../platform/platform';


/**
 * TODO
 */
@Component({
  selector: 'ion-input',
  host: {
    '(touchstart)': 'pointerStart($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mouseup)': 'pointerEnd($event)',
    'class': 'item'
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
    @Optional() @Host() scrollView: Content
  ) {
    this.renderer = renderer;

    this.form = form;
    form.register(this);

    this.type = 'text';
    this.lastTouch = 0;

    this.app = app;
    this.elementRef = elementRef;
    this.platform = platform;

    this.scrollView = scrollView;
    this.scrollAssist = config.get('scrollAssist');
    this.keyboardHeight = config.get('keyboardHeight');
  }

  /**
   * @private
   */
  registerInput(textInputElement) {
    this.input = textInputElement;
    this.type = textInputElement.type || 'text';
  }

  /**
   * @private
   */
  registerLabel(label) {
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
      if (!self.app.isTransitioning()) {
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

      let scrollData = TextInput.getScollData(ele.offsetTop, ele.offsetHeight, scrollView.getDimensions(), this.keyboardHeight, this.platform.height());
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
      this.app.setTransitioning(true, scrollDuration);

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
        this.app.setTransitioning(false);
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
  static getScollData(inputOffsetTop, inputOffsetHeight, scrollViewDimensions, keyboardHeight, plaformHeight) {
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
    this.renderer.setElementClass(this.elementRef, 'has-focus', hasFocus);
    if (!hasFocus) {
      this.deregMove();
      this.input.hideFocus(false);
    }
  }

  /**
   * @private
   */
  hasValue(inputValue) {
    this.renderer.setElementClass(this.elementRef, 'has-value', inputValue && inputValue !== '');
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
    '(focus)': 'wrapper.focusChange(true)',
    '(blur)': 'wrapper.focusChange(false)',
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
    renderer.setElementAttribute(this.elementRef, 'text-input', '');

    if (wrapper) {
      // it's within ionic's ion-input, let ion-input handle what's up
      wrapper.registerInput(this);
    }
  }

  onKeyup(ev) {
    this.wrapper.hasValue(ev.target.value);
  }

  onInit() {
    this.wrapper.hasValue(this.value);
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
        let clonedInputEle = focusedInputEle.cloneNode(true);
        clonedInputEle.classList.add('cloned-input');
        clonedInputEle.classList.remove('hide-focused-input');
        clonedInputEle.setAttribute('aria-hidden', true);
        clonedInputEle.tabIndex = -1;

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
      let clonedInputEle = focusedInputEle.cloneNode(true);
      clonedInputEle.classList.add('cloned-hidden');
      clonedInputEle.setAttribute('aria-hidden', true);
      clonedInputEle.tabIndex = -1;

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

  getNativeElement() {
    return this.elementRef.nativeElement;
  }

}

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


const SCROLL_ASSIST_SPEED = 0.5;

function getScrollAssistDuration(distanceToScroll) {
  //return 3000;
  distanceToScroll = Math.abs(distanceToScroll);
  let duration = distanceToScroll / SCROLL_ASSIST_SPEED;
  return Math.min(380, Math.max(80, duration));
}
