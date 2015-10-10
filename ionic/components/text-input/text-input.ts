import {Component, Directive, NgIf, forwardRef, Host, Optional, ElementRef, Renderer, Attribute, Query, QueryList, NgZone} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {IonicForm} from '../../util/form';
import {Label} from './label';
import {IonicApp} from '../app/app';
import {Content} from '../content/content';
import * as dom  from '../../util/dom';
import {IonicPlatform} from '../../platform/platform';


/**
 * TODO
 */
@Component({
  selector: 'ion-input',
  host: {
    '(touchstart)': 'pointerStart($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mouseup)': 'pointerEnd($event)'
  },
  template:
    '<ng-content></ng-content>' +
    '<input [type]="type" aria-hidden="true" scroll-assist *ng-if="scrollAssist">',
  directives: [NgIf, forwardRef(() => InputScrollAssist)]
})
export class TextInput {

  constructor(
    form: IonicForm,
    elementRef: ElementRef,
    config: IonicConfig,
    renderer: Renderer,
    app: IonicApp,
    zone: NgZone,
    platform: IonicPlatform,
    @Optional() @Host() scrollView: Content
  ) {
    renderer.setElementClass(elementRef, 'item', true);
    this.renderer = renderer;

    this.form = form;
    form.register(this);

    this.type = 'text';
    this.lastTouch = 0;

    this.app = app;
    this.elementRef = elementRef;
    this.zone = zone;
    this.platform = platform;

    this.scrollView = scrollView;
    this.scrollAssist = config.get('scrollAssist');
    this.keyboardHeight = config.get('keyboardHeight');
  }

  registerInput(textInputElement) {
    this.input = textInputElement;
    this.type = textInputElement.type || 'text';
  }

  registerLabel(label) {
    this.label = label;
  }

  onInit() {
    if (this.input && this.label) {
      // if there is an input and an label
      // then give the label an ID
      // and tell the input the ID of who it's labelled by
      this.input.labelledBy(this.label.id);
    }

    let self = this;
    self.scrollMove = (ev) => {
      console.debug('content scrollMove');
      self.deregListeners();

      if (self.hasFocus) {
        self.tempFocusMove();
      }
    };
  }

  pointerStart(ev) {
    if (this.scrollAssist && this.app.isEnabled()) {
      // remember where the touchstart/mousedown started
      this.startCoord = dom.pointerCoord(ev);
    }
  }

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

        this.zone.runOutsideAngular(() => {
          this.initFocus();

          // temporarily prevent mouseup's from focusing
          this.lastTouch = Date.now();
        });
      }

    } else if (this.lastTouch + 500 < Date.now()) {
      ev.preventDefault();
      ev.stopPropagation();

      this.setFocus();
    }
  }

  initFocus() {
    // begin the process of setting focus to the inner input element

    let scrollView = this.scrollView;

    if (scrollView && this.scrollAssist) {
      // this input is inside of a scroll view

      // find out if text input should be manually scrolled into view
      let ele = this.elementRef.nativeElement;

      let scrollData = TextInput.getScollData(ele.offsetTop, ele.offsetHeight, scrollView.getDimensions(), this.keyboardHeight, this.platform.height());
      if (scrollData.noScroll) {
        // the text input is in a safe position that doesn't require
        // it to be scrolled into view, just set focus now
        return this.setFocus();
      }

      // add padding to the bottom of the scroll view (if needed)
      scrollView.addScrollPadding(scrollData.scrollPadding);

      // manually scroll the text input to the top
      // do not allow any clicks while it's scrolling
      this.app.setEnabled(false, SCROLL_INTO_VIEW_DURATION);
      this.app.setTransitioning(true, SCROLL_INTO_VIEW_DURATION);

      // temporarily move the focus to the focus holder so the browser
      // doesn't freak out while it's trying to get the input in place
      // at this point the native text input still does not have focus
      this.tempFocusMove();

      // scroll the input into place
      scrollView.scrollTo(0, scrollData.scrollTo, SCROLL_INTO_VIEW_DURATION, 6).then(() => {
        // the scroll view is in the correct position now
        // give the native text input focus
        this.setFocus();

        // all good, allow clicks again
        this.app.setEnabled(true);
        this.app.setTransitioning(false);
      });

    } else {
      // not inside of a scroll view, just focus it
      this.setFocus();
    }

  }

  /**
   * TODO
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

    if (inputTopWithinSafeArea && inputBottomWithinSafeArea) {
      // Input top within safe area, bottom within safe area
      // no need to scroll to a position, it's good as-is
      return { noScroll: true };
    }

    // looks like we'll have to do some auto-scrolling
    let scrollData = {
      scrollAmount: 0,
      scrollTo: 0,
      scrollPadding: 0,
    };

    if (inputTopBelowSafeArea || inputBottomBelowSafeArea) {
      // Input top and bottom below safe area
      // auto scroll the input up so at least the top of it shows

      if (safeAreaHeight > inputOffsetHeight) {
        // safe area height is taller than the input height, so we
        // can bring it up the input just enough to show the input bottom
        scrollData.scrollAmount = (safeAreaBottom - inputBottom);

      } else {
        // safe area height is smaller than the input height, so we can
        // only scroll it up so the input top is at the top of the safe area
        // however the input bottom will be below the safe area
        scrollData.scrollAmount = (safeAreaTop - inputTop);
      }


    } else if (inputTopAboveSafeArea) {
      // Input top above safe area
      // auto scroll the input down so at least the top of it shows
      scrollData.scrollAmount = (safeAreaTop - inputTop);

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
    //   window.safeAreaEle.style.background = 'rgba(0, 128, 0, 0.3)';
    //   window.safeAreaEle.style.padding = '10px';
    //   window.safeAreaEle.style.textShadow = '2px 2px white';
    //   window.safeAreaEle.style.left = '0px';
    //   window.safeAreaEle.style.right = '0px';
    //   window.safeAreaEle.style.pointerEvents = 'none';
    //   document.body.appendChild(window.safeAreaEle);
    // }
    // window.safeAreaEle.style.top = safeAreaTop + 'px';
    // window.safeAreaEle.style.height = safeAreaHeight + 'px';
    // window.safeAreaEle.innerHTML = `
    //   <div>scrollTo: ${scrollData.scrollTo}</div>
    //   <div>scrollAmount: ${scrollData.scrollAmount}</div>
    //   <div>scrollPadding: ${scrollData.scrollPadding}</div>
    //   <div>scrollHeight: ${scrollViewDimensions.scrollHeight}</div>
    //   <div>scrollTop: ${scrollViewDimensions.scrollTop}</div>
    //   <div>contentHeight: ${scrollViewDimensions.contentHeight}</div>
    // `;

    return scrollData;
  }

  focusChange(hasFocus) {
    this.renderer.setElementClass(this.elementRef, 'has-focus', hasFocus);
  }

  hasValue(inputValue) {
    this.renderer.setElementClass(this.elementRef, 'has-value', inputValue && inputValue !== '');
  }

  setFocus() {
    if (this.input) {

      this.zone.run(() => {

        this.form.setAsFocused(this);

        // set focus on the actual input element
        this.input.setFocus();

        // ensure the body hasn't scrolled down
        document.body.scrollTop = 0;
      });

    }

    if (this.scrollAssist && this.scrollView) {
      this.zone.runOutsideAngular(() => {
        this.deregListeners();
        this.deregScroll = this.scrollView.addScrollEventListener(this.scrollMove);
      });
    }
  }

  deregListeners() {
    this.deregScroll && this.deregScroll();
  }

  tempFocusMove() {
    this.form.setFocusHolder(this.type);
  }

  get hasFocus() {
    return !!this.input && this.input.hasFocus;
  }

  onDestroy() {
    this.deregListeners();
    this.form.deregister(this);
  }

}


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
    val && this.renderer.setElementAttribute(this.elementRef, 'aria-labelledby', val);
  }

  setFocus() {
    this.getNativeElement().focus();
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

  constructor(form: IonicForm, textInput: TextInput) {
    this.form = form;
    this.textInput = textInput;
  }

  receivedFocus(ev) {
    this.form.focusNext(this.textInput);
  }

}


const SCROLL_INTO_VIEW_DURATION = 400;
