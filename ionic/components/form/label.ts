import {Directive, Host, Optional} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import * as dom  from '../../util/dom';
import {Input} from './text-input';
import {Checkbox} from '../checkbox/checkbox';
import {RadioButton} from '../radio/radio';
import {Switch} from '../switch/switch';


@Directive({
  selector: 'ion-label',
  properties: [
    'id'
  ],
  host: {
    '[attr.id]': 'id',
    '[class.input-label]': 'inputLabel',
    '(touchstart)': 'pointerStart($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mousedown)': 'pointerStart($event)',
    '(mouseup)': 'pointerEnd($event)'
  }
})
export class Label {
  constructor(
    @Optional() @Host() textContainer: Input,
    config: IonicConfig
  ) {
    this.container = textContainer;

    if (this.container) {
      this.container.registerLabel(this);
      this.inputLabel = true;
    }

    this.scrollAssist = config.setting('keyboardScrollAssist');
  }

  pointerStart(ev) {
    if (this.scrollAssist) {
      // remember where the touchstart/mousedown started
      this.startCoord = dom.pointerCoord(ev);
    }
  }

  pointerEnd(ev) {
    if (this.container) {

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
