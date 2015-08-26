import {Directive, View, Host, Optional, ElementRef, Attribute, Query, QueryList, NgZone} from 'angular2/angular2';

import {IonicDirective} from '../../config/annotations';
import {IonicConfig} from '../../config/config';
import {IonInput} from '../form/input';
import {Label} from '../form/label';
import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Content} from '../content/content';
import {ClickBlock} from '../../util/click-block';
import {Platform} from '../../platform/platform';
import * as dom  from '../../util/dom';



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
  constructor(
    @Attribute('type') type: string,
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    this.type = type;
    this.elementRef = elementRef;
    this.tabIndex = this.tabIndex || '';
  }

  setFocus() {
    this.elementRef.nativeElement.focus();
  }

  get hasFocus() {
    return dom.hasFocus(this.elementRef);
  }
}


@IonicDirective({
  selector: 'ion-input',
  classId: 'item-input',
  properties: [
    'tabIndex'
  ],
  host: {
    '(focus)': 'receivedFocus(true)',
    '(blur)': 'receivedFocus(false)',
    '(^touchstart)': 'pointerStart($event)',
    '(^touchend)': 'pointerEnd($event)',
    '(^mouseup)': 'pointerEnd($event)',
    '[class.has-focus]': 'inputHasFocus',
    '[tabIndex]': 'activeTabIndex',
    'class': 'item'
  }
})
export class TextInput extends Ion {

  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    app: IonicApp,
    ngZone: NgZone,
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
    this.inputQry = inputQry;
    this.labelQry = labelQry;
  }

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

  pointerStart(ev) {
    if (this.scrollAssist) {
      // remember where the touchstart/mousedown started
      this.startCoord = dom.pointerCoord(ev);
    }
  }

  pointerEnd(ev) {
    if (this.scrollAssist && ev.type === 'touchend') {
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

  initFocus() {
    let scrollView = this.scrollView;

    if (scrollView && this.scrollAssist) {
      // this input is inside of a scroll view

      // find out if text input should be manually scrolled into view
      let ele = this.elementRef.nativeElement;
      let safeAreaBottom = (Platform.height() * 0.6);

      let scrollData = this.getScollData(ele.offsetTop, ele.offsetHeight, scrollView.getDimensions(), safeAreaBottom);
      if (scrollData.noScroll) {
        // the text input is in a safe position that doesn't require
        // it to be scrolled into view, just set focus now
        return this.setFocus();
      }

      // manually scroll the text input to the top
      // do not allow any clicks while it's scrolling
      ClickBlock(true, SCROLL_INTO_VIEW_DURATION + 200);

      // temporarily move the focus to the focus holder so the browser
      // doesn't freak out while it's trying to get the input in place
      // at this point the native text input still does not have focus
      this.tempFocusMove();

      // scroll the input into place
      scrollView.scrollTo(0, scrollData.scrollTo, SCROLL_INTO_VIEW_DURATION, 8).then(() => {
        // the scroll view is in the correct position now
        // give the native text input focus
        this.setFocus();

        // all good, allow clicks again
        ClickBlock(false);
      });

    } else {
      // not inside of a scroll view, just focus it
      this.setFocus();
    }

  }

  getScollData(inputOffsetTop, inputOffsetHeight, scrollViewDimensions, safeAreaBottom) {
    // compute input's Y values relative to the body
    let inputTop = (inputOffsetTop + scrollViewDimensions.top - scrollViewDimensions.scrollTop);
    let inputBottom = (inputTop + inputOffsetHeight);

    // compute the safe area which is the viewable content area when the soft keyboard is up
    let safeAreaTop = (scrollViewDimensions.top - 1);
    let safeAreaHeight = (safeAreaBottom - safeAreaTop);

    let inputTopWithinSafeArea = (inputTop >= safeAreaTop && inputTop <= safeAreaBottom);
    let inputBottomWithinSafeArea = (inputBottom >= safeAreaTop && inputBottom <= safeAreaBottom);
    let inputBottomBelowSafeArea = (inputBottom > safeAreaBottom);
    let inputFitsWithinSafeArea = (inputOffsetHeight <= safeAreaHeight);
    let distanceInputBottomBelowSafeArea = (safeAreaBottom - inputBottom);

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
      scrollUp: 0,
      scrollDown: 0,
      scrollTo: inputOffsetTop,
      scrollPadding: 0,
    };

    if (inputTopWithinSafeArea && inputBottomBelowSafeArea) {
      // Input top within safe area, bottom below safe area
      let distanceInputTopIntoSafeArea = (safeAreaTop - inputTop);
      let distanceInputBottomBelowSafeArea = (inputBottom - safeAreaBottom);

      if (distanceInputBottomBelowSafeArea < distanceInputTopIntoSafeArea) {
        // the input's top is farther into the safe area then the bottom is out of it
        // this means we can scroll it up a little bit and the top will still be
        // within the safe area
        scrollData.scrollUp = distanceInputTopIntoSafeArea;

      } else {
        // the input's top is less below the safe area top than the
        // input's bottom is below the safe area bottom. So scroll the input
        // to be at the top of the safe area, knowing that the bottom will go below
        scrollData.scrollUp = distanceInputTopIntoSafeArea;
      }

    }


    // fallback for whatever reason
    return scrollData;
  }

  deregListeners() {
    this.deregScroll && this.deregScroll();
  }

  setFocus() {
    this.zone.run(() => {
      this.input && this.input.setFocus();
      IonInput.setAsLastInput(this);
    });

    if (this.scrollAssist && this.scrollView) {
      setTimeout(() => {
        this.deregListeners();
        this.deregScroll = this.scrollView.addScrollEventListener(this.scrollMove);
      }, 100);
    }
  }

  tempFocusMove() {
    let focusHolder = this.app.focusHolder();
    focusHolder.setFocusHolder(this.type);
  }

  get inputHasFocus() {
    return !!this.input && this.input.hasFocus;
  }

  get activeTabIndex() {
    this.input.tabIndex = (this.inputHasFocus ? 1000 : -1);
    return -1;
  }

  receivedFocus(receivedFocus) {
    let self = this;
    if (receivedFocus && !self.inputHasFocus) {
      self.initFocus();

    } else {
      this.deregListeners();
    }
  }

}

const SCROLL_INTO_VIEW_DURATION = 500;
