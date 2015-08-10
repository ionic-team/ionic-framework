import {Directive} from 'angular2/angular2';

import {IonicConfig} from '../../config/config';
import {pointerCoord, hasPointerMoved} from '../../util/dom';


@Directive({
  selector: 'ion-label',
  properties: [
    'id'
  ],
  host: {
    '[attr.id]': 'id',
    'class': 'input-label',
    '(touchstart)': 'pointerStart($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mousedown)': 'pointerStart($event)',
    '(mouseup)': 'pointerEnd($event)'
  }
})
export class Label {
  constructor(config: IonicConfig) {
    this.scrollAssist = config.setting('keyboardScrollAssist');
  }

  pointerStart(ev) {
    if (this.scrollAssist) {
      // remember where the touchstart/mousedown started
      this.startCoord = pointerCoord(ev);
    }
  }

  pointerEnd(ev) {
    if (this.container) {

      // get where the touchend/mouseup ended
      let endCoord = pointerCoord(ev);

      // focus this input if the pointer hasn't moved XX pixels
      if (!hasPointerMoved(20, this.startCoord, endCoord)) {
        ev.preventDefault();
        ev.stopPropagation();
        this.container.focus();
      }

      this.startCoord = null;
    }
  }

}
