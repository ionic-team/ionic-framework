import {Directive, View, Host, Optional, ElementRef, Attribute, Query, QueryList, NgZone} from 'angular2/angular2';

import {IonicDirective} from '../../config/decorators';
import {IonicConfig} from '../../config/config';
import {IonInput} from '../form/input';
import {Label} from './label';
import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Content} from '../content/content';
import * as dom  from '../../util/dom';
import {IonicPlatform} from '../../platform/platform';


/**
 * TODO
 */
@Directive({
  selector: 'textarea,input[type=text],input[type=password],input[type=number],input[type=search],input[type=email],input[type=url],input[type=tel]',
  property: [
    'tabIndex'
  ],
  host: {
    '[tabIndex]': 'tabIndex',
    '[attr.aria-labelledby]': 'labelledBy',
    'class': 'text-input input'
  }
})
export class TextInputElement {
  /**
   * TODO
   * @param {string} type  The value of the underlying element's type attribute.
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   */
  constructor(
    @Attribute('type') type: string,
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    this.type = type;
    this.elementRef = elementRef;
    this.tabIndex = this.tabIndex || '';
  }

  /**
   * Focus the input.
   */
  setFocus() {
    this.elementRef.nativeElement.focus();
  }

  /**
   * Whether the input has focus or not.
   * @returns {boolean}  true if the input has focus, otherwise false.
   */
  get hasFocus() {
    return dom.hasFocus(this.elementRef);
  }

  /**
   * Whether the input has a value.
   * @returns {boolean}  true if the input has a value, otherwise false.
   */
  get hasValue() {
    return (this.elementRef.nativeElement.value !== '');
  }
}

/**
 * TODO
 */
@IonicDirective({
  selector: 'ion-input',
  classId: 'item-input',
  properties: [
    'tabIndex'
  ],
  host: {
    '(focus)': 'receivedFocus(true)',
    '(blur)': 'receivedFocus(false)',
    '(touchstart)': 'pointerStart($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mouseup)': 'pointerEnd($event)',
    '[class.has-focus]': 'inputHasFocus',
    '[class.has-value]': 'inputHasValue',
    '[tabIndex]': 'activeTabIndex',
    'class': 'item'
  }
})
export class TextInput extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   * @param {IonicApp} app  TODO
   * @param {NgZone} ngZone  TODO
   * @param {Content=} scrollView  The parent scroll view.
   * @param {QueryList<TextInputElement>} inputQry  TODO
   * @param {QueryList<Label>} labelQry  TODO
   */
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    app: IonicApp,
    ngZone: NgZone,
    platform: IonicPlatform,
    @Optional() @Host() scrollView: Content,
    @Query(TextInputElement) inputQry: QueryList<TextInputElement>,
    @Query(Label) labelQry: QueryList<Label>
  ) {
    super(elementRef, config);

    this.scrollView = scrollView;
    this.scrollAssist = config.setting('keyboardScrollAssist');
    this.id = IonInput.nextId();
    IonInput.registerInput(this);

    this.app = app;
    this.zone = ngZone;
    this.platform = platform;
    this.inputQry = inputQry;
    this.labelQry = labelQry;

    this.keyboardHeight = this.config.setting('keyboardHeight');
  }

  /**
   * TODO
   */
  onInit() {
    super.onInit();

    let label = this.labelQry.first;
    this.input = this.inputQry.first;

    if (this.input) {
      this.type = this.input.type;
      this.input.tabIndex = -1;

      if (label) {
        label.id = (label.id || 'label-' + this.id);
        this.input.labelledBy = label.id;
      }
    }

    let self = this;

    self.scrollMove = (ev) => {
      self.deregListeners();

      if (self.inputHasFocus) {
        self.tempFocusMove();
      }
    };
  }

  /**
   * TODO
   * @param {Event} ev  TODO
   */
  pointerStart(ev) {
    if (this.scrollAssist && this.app.isEnabled()) {
      // remember where the touchstart/mousedown started
      this.startCoord = dom.pointerCoord(ev);
    }
  }

  /**
   * TODO
   * @param {Event} ev TODO
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
      if (!dom.hasPointerMoved(8, this.startCoord, endCoord) && !this.inputHasFocus) {
        ev.preventDefault();
        ev.stopPropagation();

        this.zone.runOutsideAngular(() => {
          this.initFocus();

          // temporarily prevent mouseup's from focusing
          this.preventMouse = true;
          clearTimeout(this.mouseTimer);
          this.mouseTimer = setTimeout(() => {
            this.preventMouse = false;
          }, 500);
        });
      }

    } else if (!this.preventMouse) {
      ev.preventDefault();
      ev.stopPropagation();

      this.zone.runOutsideAngular(() => {
        this.setFocus();
      });
    }
  }

  /**
   * TODO
   * @returns {TODO} TODO
   */
   //TODO inconsistent return value, sometimes undefined
  initFocus() {
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
      scrollView.addKeyboardPadding(scrollData.scrollPadding);

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

  /**
   * TODO
   */
  deregListeners() {
    this.deregScroll && this.deregScroll();
  }

  /**
   * TODO
   */
  setFocus() {
    this.zone.run(() => {
      // set focus on the input element
      this.input && this.input.setFocus();

      // ensure the body hasn't scrolled down
      document.body.scrollTop = 0;

      IonInput.setAsLastInput(this);
    });

    if (this.scrollAssist && this.scrollView) {
      setTimeout(() => {
        this.deregListeners();
        this.deregScroll = this.scrollView.addScrollEventListener(this.scrollMove);
      }, 100);
    }
  }

  /**
   * TODO
   */
  tempFocusMove() {
    let focusHolder = this.app.focusHolder();
    focusHolder.setFocusHolder(this.type);
  }

  get inputHasFocus() {
    return !!this.input && this.input.hasFocus;
  }

  get inputHasValue() {
    return !!this.input && this.input.hasValue;
  }

  get activeTabIndex() {
    this.input.tabIndex = (this.inputHasFocus ? 1000 : -1);
    return -1;
  }

  /**
   * TODO
   * @param {boolean} receivedFocus  TODO
   */
  receivedFocus(receivedFocus) {
    if (receivedFocus && !this.inputHasFocus) {
      this.initFocus();

    } else {
      this.deregListeners();
    }
  }

}

const SCROLL_INTO_VIEW_DURATION = 400;
