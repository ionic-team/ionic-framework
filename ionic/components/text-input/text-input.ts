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
      let scrollToY = this.getScollToY();
      if (scrollToY === 0) {
        // the text input is in a safe position that doesn't require
        // it to be scrolled into view, just set focus now
        return this.setFocus();
      }

      // manually scroll the text input to the top
      // do not allow any clicks while it's scrolling
      ClickBlock(true, SCROLL_INTO_VIEW_DURATION + 200);

      // used to put a lot of padding on the bottom of the scroll view
      scrollView.scrollPadding = true;

      // temporarily move the focus to the focus holder so the browser
      // doesn't freak out while it's trying to get the input in place
      // at this point the native text input still does not have focus
      this.tempFocusMove();

      // scroll the input into place
      scrollView.scrollTo(0, scrollToY, SCROLL_INTO_VIEW_DURATION, 8).then(() => {
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

  getScollToY() {
    let ele = this.elementRef.nativeElement;
    let viewDimensions = this.scrollView.getDimensions();

    // get the inputs Y position relative to the scroll view
    let inputOffsetTop = ele.offsetTop;

    // compute offset values relative to the body
    let contentTop = viewDimensions.top;
    let inputTop = inputOffsetTop + contentTop - viewDimensions.scrollTop;
    let inputBottom = (inputTop + ele.offsetHeight);

    // compute the safe area which is the viewable
    // content area when the soft keyboard is up
    let safeTop = contentTop - 1;
    let safeBottom = (Platform.height() * 0.6);

    // Text Input Scroll To Scenarios
    // ---------------------------------------
    // 1) Input top within safe area, bottom within safe area
    // 2) Input top within safe area, bottom below safe area
    // 3) Input top and bottom below safe area
    // 4) Input top above safe area, bottom within safe area
    // 5) Input top above safe area, bottom below safe area

    if (inputTop >= safeTop && inputTop <= safeBottom) {
      // Input top within safe area

      if (inputBottom <= safeBottom) {
        // 1) Input top within safe area, bottom within safe area
        // no need to scroll to a position, it's good as-is
        return 0;
      }

      // 2) Input top within safe area, bottom below safe area
      // TODO: What if the input is still taller than safe area?
      return inputOffsetTop;
    }

    if (inputTop > safeBottom) {
      // 3) Input top and bottom below safe area
      // TODO: What if the input is still taller than safe area?
      return inputOffsetTop;
    }

    if (inputTop < safeTop) {
      // Input top above safe area

      if (inputBottom <= safeTop) {
        // 4) Input top above safe area, bottom within safe area
        // TODO: What if the input is still taller than safe area?
        return inputOffsetTop;
      }

      // 5) Input top above safe area, bottom below safe area
      // TODO: What if the input is still taller than safe area?
      return inputOffsetTop;
    }

    // fallback for whatever reason
    return inputOffsetTop;
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
