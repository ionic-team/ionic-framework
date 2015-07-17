import {Directive, View, Parent, Ancestor, Optional, ElementRef, Attribute, forwardRef} from 'angular2/angular2';

import {IonicDirective} from '../../config/annotations';
import {IonicConfig} from '../../config/config';
import {IonInput, IonInputItem} from './input';
import {IonicApp} from '../app/app';
import {Content} from '../content/content';
import {ClickBlock} from '../../util/click-block';
import * as dom  from '../../util/dom';
import {Platform} from '../../platform/platform';


@IonicDirective({
  selector: 'ion-input'
})
export class Input extends IonInputItem {

  constructor(
    elementRef: ElementRef,
    ionicConfig: IonicConfig
  ) {
    super(elementRef, ionicConfig);
  }

}


@Directive({
  selector: 'textarea,input[type=text],input[type=password],input[type=number],input[type=search],input[type=email],input[type=url]',
  property: [
    'tabIndex'
  ],
  host: {
    '[tabIndex]': 'tabIndex',
    '(focus)': 'receivedFocus(true)',
    '(blur)': 'receivedFocus(false)',
    '(touchstart)': 'pointerStart($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mousedown)': 'pointerStart($event)',
    '(mouseup)': 'pointerEnd($event)',
    '[attr.id]': 'id'
  }
})
export class TextInput extends IonInput {
  constructor(
    @Optional() @Parent() container: Input,
    @Optional() @Ancestor() scrollView: Content,
    @Attribute('type') type: string,
    elementRef: ElementRef,
    app: IonicApp,
    config: IonicConfig
  ) {
    super(elementRef, app, config, scrollView);

    if (container) {
      container.registerInput(this);
      this.container = container;
    }

    this.type = type;
    this.elementRef = elementRef;
    this.tabIndex = this.tabIndex || '';
  }

  pointerStart(ev) {
    if (this.scrollAssist) {
      // remember where the touchstart/mousedown started
      this.startCoord = dom.pointerCoord(ev);
      this.pressStart = Date.now();
    }
  }

  pointerEnd(ev) {
    if (this.scrollAssist) {

      // get where the touchend/mouseup ended
      let endCoord = dom.pointerCoord(ev);

      // focus this input if the pointer hasn't moved XX pixels
      // and the input doesn't already have focus
      if (!dom.hasPointerMoved(20, this.startCoord, endCoord) && !this.hasFocus()) {
        ev.preventDefault();
        ev.stopPropagation();

        this.focus();
      }

      this.startCoord = this.pressStart = null;
    }
  }

  focus() {
    let scrollView = this.scrollView;

    if (scrollView && this.scrollAssist) {
      // this input is inside of a scroll view
      // scroll the input to the top
      let inputY = this.elementRef.nativeElement.offsetTop - 15;

      // do not allow any clicks while it's scrolling
      ClickBlock(true, SCROLL_INTO_VIEW_DURATION + 200);

      // used to put a lot of padding on the bottom of the scroll view
      scrollView.scrollPadding = true;

      // temporarily move the focus to the focus holder so the browser
      // doesn't freak out while it's trying to get the input in place
      this.setFocusHolder(this.type);

      // scroll the input into place
      scrollView.scrollTo(0, inputY, SCROLL_INTO_VIEW_DURATION, 8).then(() => {
        // the scroll view is in the correct position now
        // give the native input the focus
        this.setFocus();

        // all good, allow clicks again
        ClickBlock(false);
      });

    } else {
      // not inside of a scroll view, just focus it
      this.setFocus();
    }

  }

  receivedFocus(receivedFocus) {
    let self = this;
    let scrollView = self.scrollView;

    self.isActiveInput(receivedFocus);

    function touchMove(ev) {
      if (!self.isPressHold()) {
        self.setFocusHolder(self.type);
        self.deregTouchMove();
      }
    }

    if (scrollView && this.scrollAssist) {
      if (receivedFocus) {
        // when the input has focus, then the focus holder
        // should not be able to be focused
        self.deregTouchMove = scrollView && scrollView.addTouchMoveListener(touchMove);

      } else {
        // the input no longer has focus
        self.deregTouchMove && self.deregTouchMove();
      }
    }

  }

  isPressHold() {
    return this.pressStart && (this.pressStart + 500 < Date.now());
  }

}

const SCROLL_INTO_VIEW_DURATION = 500;
