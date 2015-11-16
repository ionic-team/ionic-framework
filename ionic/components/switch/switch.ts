import {Component, Directive, ElementRef, Host, Optional, NgControl, Inject, forwardRef} from 'angular2/angular2';

import {Form} from '../../util/form';
import {Config} from '../../config/config';
import {pointerCoord} from '../../util/dom';


/**
 * @private
 */
@Directive({
  selector: 'media-switch',
  host: {
    '[class.switch-activated]': 'swtch.isActivated'
  }
})
class MediaSwitch {
  /**
   * TODO
   * @param {Switch} swtch  TODO
   * @param {} elementRef  TODO
   * @param {Config} config  TODO
   */
  constructor(
    @Host() @Inject(forwardRef(() => Switch)) swtch: Switch,
    elementRef: ElementRef
  ) {
    swtch.switchEle = elementRef.nativeElement;
    this.swtch = swtch;
  }

}


/**
 * A switch technically is the same thing as an HTML checkbox input, except it looks different and is easier to use on a touch device. Ionic prefers to wrap the checkbox input with the <label> in order to make the entire toggle easy to tap or drag.
 *
 * Toggles can also have colors assigned to them, by adding the `toggle-assertive` attribute to assign the assertive color.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/js/latest/api/forms/) for more info on forms and input.
 *
 * @usage
 * ```html
 * // Create a single switch
 *  <ion-switch checked="true">
 *    Pineapple
 *  </ion-switch>
 *
 * // Create a list of switches:
 *  <ion-list>
 *
 *    <ion-switch checked="true">
 *      Apple
 *    </ion-switch>
 *
 *     <ion-switch checked="false">
 *       Banana
 *     </ion-switch>
 *
 *     <ion-switch disabled="true">
 *       Cherry
 *     </ion-switch>
 *
 *  </ion-list>
 * ```
 *
 */
@Component({
  selector: 'ion-switch',
  inputs: [
    'value',
    'checked',
    'disabled',
    'id'
  ],
  host: {
    'role': 'checkbox',
    'tappable': 'true',
    '[attr.tab-index]': 'tabIndex',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-labelledby]': 'labelId',
    '(touchstart)': 'pointerDown($event)',
    '(mousedown)': 'pointerDown($event)',
    '(touchend)': 'pointerUp($event)',
    '(mouseup)': 'pointerUp($event)',
    'class': 'item'
  },
  template:
    '<ng-content select="[item-left]"></ng-content>' +
    '<div class="item-inner">' +
      '<ion-item-content id="{{labelId}}">' +
        '<ng-content></ng-content>' +
      '</ion-item-content>' +
      '<media-switch disable-activated>' +
        '<switch-icon></switch-icon>' +
      '</media-switch>' +
    `</div>`,
  directives: [MediaSwitch]
})
export class Switch {

  constructor(
    form: Form,
    elementRef: ElementRef,
    config: Config,
    @Optional() private ngControl: NgControl
  ) {
    this.form = form;
    form.register(this);

    this.lastTouch = 0;
    this.mode = config.get('mode');

    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    if (ngControl) ngControl.valueAccessor = this;


    let self = this;
    function pointerMove(ev) {
      let currentX = pointerCoord(ev).x;

      if (self.checked) {
        if (currentX + 15 < self.startX) {
          self.toggle(ev);
          self.startX = currentX;
        }
      } else if (currentX - 15 > self.startX) {
        self.toggle(ev);
        self.startX = currentX;
      }
    }

    function pointerOut(ev) {
      if (ev.currentTarget === ev.target) {
        self.pointerUp(ev);
      }
    }

    this.addMoveListener = function() {
      self.switchEle.addEventListener('touchmove', pointerMove);
      self.switchEle.addEventListener('mousemove', pointerMove);
      elementRef.nativeElement.addEventListener('mouseout', pointerOut);
    };

    this.removeMoveListener = function() {
      self.switchEle.removeEventListener('touchmove', pointerMove);
      self.switchEle.removeEventListener('mousemove', pointerMove);
      elementRef.nativeElement.removeEventListener('mouseout', pointerOut);
    };
  }

  /**
   * @private
   */
  onInit() {
    this.labelId = 'label-' + this.inputId;
  }

  /**
   * Set checked state of this switch.
   * @param {boolean} value  Boolean to set this switch's checked state to.
   */
  check(value) {
    this.checked = !!value;
    this.onChange(this.checked);
  }

  /**
   * Toggle the checked state of this switch.
   */
  toggle(ev) {
    this.check(!this.checked);
  }

  /**
   * @private
   */
  writeValue(value) {
    this.checked = value;
  }

  /**
   * @private
   */
  pointerDown(ev) {
    if (/touch/.test(ev.type)) {
      this.lastTouch = Date.now();
    }

    if (this.isDisabled(ev)) return;

    this.startX = pointerCoord(ev).x;

    this.removeMoveListener();
    this.addMoveListener();

    this.isActivated = true;
  }

  /**
   * @private
   */
  pointerUp(ev) {
    if (this.isDisabled(ev)) return;

    let endX = pointerCoord(ev).x;

    if (this.checked) {
      if (this.startX + 4 > endX) {
        this.toggle(ev);
      }
    } else if (this.startX - 4 < endX) {
      this.toggle(ev);
    }

    this.removeMoveListener();
    this.isActivated = false;
  }

  /**
   * @private
   */
  registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  onDestroy() {
    this.removeMoveListener();
    this.switchEle = this.addMoveListener = this.removeMoveListener = null;
    this.form.deregister(this);
  }

  /**
   * @private
   */
  isDisabled(ev) {
    return (this.lastTouch + 999 > Date.now() && /mouse/.test(ev.type)) || (this.mode == 'ios' && ev.target.tagName == 'ION-SWITCH');
  }
}
