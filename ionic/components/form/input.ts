import {Directive, View, Parent, Ancestor, Optional, ElementRef, Attribute, forwardRef} from 'angular2/angular2';

import {IonicDirective} from '../../config/annotations';
import {IonicConfig} from '../../config/config';
import {IonInput} from './form';
import {Ion} from '../ion';
import {IonicApp} from '../app/app';
import {Content} from '../content/content';
import {ClickBlock} from '../../util/click-block';
import * as dom  from '../../util/dom';
import {Platform} from '../../platform/platform';


@IonicDirective({
  selector: 'ion-input'
})
export class Input extends Ion {

  constructor(
    elementRef: ElementRef,
    ionicConfig: IonicConfig
  ) {
    super(elementRef, ionicConfig);
    this.id = ++inputIds;
  }

  onInit() {
    if (this.input) {
      this.input.id = 'input-' + this.id;
    }
    if (this.label) {
      this.label.id = 'label-' + this.id;
      this.input.labelledBy = this.label.id;
    }
  }

  registerInput(directive) {
    this.input = directive;
  }

  registerLabel(directive) {
    this.label = directive;
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
    '[attr.id]': 'id',
    '[attr.aria-labelledby]': 'labelledBy',
    '[class.disable-focus]': 'disableFocus'
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
    super(elementRef, app, scrollView);

    if (container) {
      container.registerInput(this);
      this.container = container;
    }

    this.type = type;
    this.elementRef = elementRef;
    this.tabIndex = this.tabIndex || '';

    this.scrollAssist = config.setting('keyboardScrollAssist');
  }

  pointerStart(ev) {
    if (this.scrollAssist) {
      this.startCoord = dom.pointerCoord(ev);
      this.disableFocus = true;
    }
  }

  pointerEnd(ev) {
    if (this.scrollAssist) {
      let endCoord = dom.pointerCoord(ev);

      if (this.startCoord && !dom.hasPointerMoved(20, this.startCoord, endCoord) && !this.hasFocus()) {
        ev.preventDefault();
        ev.stopPropagation();

        this.focus();

      } else {
        this.disableFocus = false;
      }

      this.startCoord = null;
    }
  }

  focus() {
    let scrollView = this.scrollView;

    if (scrollView && this.scrollAssist) {
      this.disableFocus = true;

      // this input is inside of a scroll view
      // scroll the input to the top
      let inputY = this.elementRef.nativeElement.offsetTop - 8;

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

        this.disableFocus = false;
      });

    } else {
      // not inside of a scroll view, just focus it
      this.setFocus();
      this.disableFocus = false;
    }

  }

  receivedFocus(receivedFocus) {
    let self = this;
    let scrollView = self.scrollView;

    self.isActiveInput(receivedFocus);

    function touchMove(ev) {
      self.setFocusHolder(self.type);
      self.deregTouchMove();
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

}


@Directive({
  selector: 'label',
  host: {
    '[attr.id]': 'id'
  }
})
export class InputLabel {
  constructor(@Optional() @Parent() container: Input) {
    if (container) {
      container.registerLabel(this);
    }
  }
}

const SCROLL_INTO_VIEW_DURATION = 500;

let inputIds = -1;
