import {Component, Directive, ElementRef, Renderer, Host, Optional, NgControl, Inject, forwardRef} from 'angular2/angular2';

import {IonicForm} from '../../util/form';
import {IonicConfig} from '../../config/config';
import {pointerCoord} from '../../util/dom';

/**
 * @name mediaSwitch
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
   * @param {IonicConfig} config  TODO
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
    '(mouseup)': 'pointerUp($event)'
  },
  template:
    '<ng-content select="[item-left]"></ng-content>' +
    '<ion-item-content id="{{labelId}}">' +
      '<ng-content></ng-content>' +
    '</ion-item-content>' +
    '<media-switch disable-activated>' +
      '<switch-icon></switch-icon>' +
    '</media-switch>',
  directives: [MediaSwitch]
})
export class Switch {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} config  TODO
   * @param {NgControl=} ngControl  TODO
   */
  constructor(
    form: IonicForm,
    elementRef: ElementRef,
    config: IonicConfig,
    renderer: Renderer,
    @Optional() private ngControl: NgControl
  ) {
    this.form = form;
    form.register(this);

    renderer.setElementClass(elementRef, 'item', true);

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

  writeValue(value) {
    this.checked = value;
  }

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

  // Used by the view to update the model (Control)
  // Up to us to call it in update()
  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }

  onDestroy() {
    this.removeMoveListener();
    this.switchEle = this.addMoveListener = this.removeMoveListener = null;
    this.form.deregister(this);
  }

  isDisabled(ev) {
    return (this.lastTouch + 999 > Date.now() && /mouse/.test(ev.type)) || (this.mode == 'ios' && ev.target.tagName == 'ION-SWITCH');
  }
}
