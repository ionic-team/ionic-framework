import {Directive, Optional, ElementRef, Renderer} from 'angular2/core';

import {Config} from '../../config/config';
import {TextInput} from './text-input';
import {pointerCoord, hasPointerMoved} from '../../util/dom';
import {Form} from '../../util/form';


/**
 * @name Label
 * @description
 * Labels describe the data that the user should enter in to an input element.
 * @usage
 * ```html
 * <ion-input>
 *   <ion-label>Username</ion-label>
 *   <input type="text" value="">
 * </ion-input>
 * ```
 *
 * @see {@link ../../../../components#inputs Input Component Docs}
 * @see {@link ../Input Input API Docs}
 *
 */

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

  constructor(
    config: Config,
    @Optional() container: TextInput,
    private form: Form,
    private elementRef: ElementRef,
    private renderer: Renderer
  ) {
    this.scrollAssist = config.get('scrollAssist');
    this.container = container;
  }

  ngOnInit() {
    if (!this.id) {
      this.id = 'lbl-' + this.form.nextId();
    }
    this.container && this.container.registerLabel(this);
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

  /**
   * @private
   */
  addClass(className) {
    this.renderer.setElementClass(this.elementRef, className, true);
  }

}
