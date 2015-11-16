import {Directive, Optional} from 'angular2/angular2';

import {Config} from '../../config/config';
import {TextInput} from './text-input';
import {pointerCoord, hasPointerMoved} from '../../util/dom';


@Directive({
  selector: 'ion-label',
  inputs: [
    'id'
  ],
  host: {
    '[attr.id]': 'id',
    '(touchstart)': 'pointerStart($event)',
    '(touchend)': 'pointerEnd($event)',
    '(mousedown)': 'pointerStart($event)',
    '(mouseup)': 'pointerEnd($event)'
  }
})
export class Label {

  constructor(config: Config, @Optional() container: TextInput) {
    this.scrollAssist = config.get('scrollAssist');
    if (!this.id) {
      this.id = 'lbl-' + (++labelIds);
    }
    this.container = container;
    container && container.registerLabel(this);
  }

  /**
   * @private
   */
  pointerStart(ev) {
    if (this.scrollAssist) {
      // remember where the touchstart/mousedown started
      this.startCoord = pointerCoord(ev);
    }
  }

  /**
   * @private
   */
  pointerEnd(ev) {
    if (this.container) {

      // get where the touchend/mouseup ended
      let endCoord = pointerCoord(ev);

      // focus this input if the pointer hasn't moved XX pixels
      if (!hasPointerMoved(20, this.startCoord, endCoord)) {
        ev.preventDefault();
        ev.stopPropagation();
        this.container.initFocus();
      }

      this.startCoord = null;
    }
  }

}

let labelIds = -1;
