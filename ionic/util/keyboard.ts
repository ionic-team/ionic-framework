import {Injectable} from 'angular2/angular2';

import {IonicForm} from './form';
import * as dom from './dom';


@Injectable()
export class IonicKeyboard {

  constructor(form: IonicForm) {
    this.form = form;
  }

  isOpen() {
    return dom.hasFocusedTextInput();
  }

  onClose(callback) {
    const self = this;

    let promise = null;

    if (!callback) {
      // a callback wasn't provided, so let's return a promise instead
      promise = new Promise(resolve => { callback = resolve; });
    }

    function checkKeyboard() {
      if (!self.isOpen()) {
        callback();

      } else {
        setTimeout(checkKeyboard, 500);
      }
    }

    setTimeout(checkKeyboard, 100);

    return promise;
  }

  close() {
    dom.raf(() => {
      if (dom.hasFocusedTextInput()) {
        // only focus out when a text input has focus
        this.form.focusOut();
      }
    });
  }

}
