import {Directive, Parent, Optional} from 'angular2/angular2';

import {Input} from './text-input';
import {IonicConfig} from '../../config/config';
import * as dom  from '../../util/dom';


@Directive({
  selector: 'label',
  host: {
    '[attr.for]': 'labelFor',
    '[class.input-label]': 'inputLabel',
    '(touchstart)': 'pointerStart($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mousedown)': 'pointerStart($event)',
    '(mouseup)': 'pointerEnd($event)'
  }
})
export class Label {
  constructor(@Optional() @Parent() container: Input, config: IonicConfig) {
    if (container) {
      container.registerLabel(this);
      this.inputLabel = true;
    }
    this.container = container;
    this.scrollAssist = config.setting('keyboardScrollAssist');
  }

  pointerStart(ev) {
    if (this.scrollAssist) {
      // remember where the touchstart/mousedown started
      this.startCoord = dom.pointerCoord(ev);
    }
  }

  pointerEnd(ev) {
    if (this.scrollAssist && this.container) {

      // get where the touchend/mouseup ended
      let endCoord = dom.pointerCoord(ev);

      // focus this input if the pointer hasn't moved XX pixels
      if (!dom.hasPointerMoved(20, this.startCoord, endCoord)) {
        ev.preventDefault();
        ev.stopPropagation();

        this.container.focus();
      }

      this.startCoord = null;
    }
  }

}
