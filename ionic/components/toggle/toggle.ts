import {Component, Directive, ElementRef, Host, Optional, Inject, forwardRef} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Form} from '../../util/form';
import {Config} from '../../config/config';
import {pointerCoord} from '../../util/dom';


/**
 * @private
 */
@Directive({
  selector: '.toggle-media',
  host: {
    '[class.toggle-activated]': 'toggle.isActivated'
  }
})
class MediaToggle {
  /**
   * TODO
   * @param {Toggle} toggle  TODO
   * @param {} elementRef  TODO
   * @param {Config} config  TODO
   */
  constructor(
    @Host() @Inject(forwardRef(() => Toggle)) toggle: Toggle,
    elementRef: ElementRef
  ) {
    toggle.toggleEle = elementRef.nativeElement;
    this.toggle = toggle;
  }

}


/**
 * @name Toggle
 * @description
 * A toggle technically is the same thing as an HTML checkbox input, except it looks different and is easier to use on a touch device. Ionic prefers to wrap the checkbox input with the `<label>` in order to make the entire toggle easy to tap or drag.
 * Togglees can also have colors assigned to them, by adding any color attribute to them.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/js/latest/api/forms/) for more info on forms and input.
 * @property {any} [value] - the inital value of the toggle
 * @property {boolean} [checked] - whether the toggle it toggled or not
 * @property {boolean} [disabled] - whether the toggle is disabled or not
 * @property {string} [id] - a unique ID for a toggle
 * @usage
 * ```html
 * <!-- Create a single toggle -->
 *  <ion-toggle checked="true">
 *    Pineapple
 *  </ion-toggle>
 *
 * <!-- Create a list of togglees -->
 *  <ion-list>
 *
 *    <ion-toggle checked="true">
 *      Apple
 *    </ion-toggle>
 *
 *     <ion-toggle checked="false">
 *       Banana
 *     </ion-toggle>
 *
 *     <ion-toggle disabled="true">
 *       Cherry
 *     </ion-toggle>
 *
 *  </ion-list>
 * ```
 * @demo /docs/v2/demos/toggle/
 * @see {@link /docs/v2/components#toggle Toggle Component Docs}
 */
@Component({
  selector: 'ion-toggle,ion-switch',
  inputs: [
    'value',
    'checked',
    'disabled',
    'id'
  ],
  host: {
    'role': 'checkbox',
    'tappable': 'true',
    '[attr.id]': 'id',
    '[tabindex]': 'tabIndex',
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
      '<div disable-activated class="toggle-media">' +
        '<div class="toggle-icon"></div>' +
      '</div>' +
    `</div>`,
  directives: [MediaToggle]
})
export class Toggle {

  constructor(
    form: Form,
    elementRef: ElementRef,
    config: Config,
    @Optional() private _ngControl: NgControl
  ) {
    // deprecated warning
    if (elementRef.nativeElement.tagName == 'ION-SWITCH') {
      console.warn('<ion-switch> has been renamed to <ion-toggle>, please update your HTML');
    }

    this.tabIndex = 0;

    this.form = form;
    form.register(this);

    this.lastTouch = 0;
    this.mode = config.get('mode');

    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    if (_ngControl) {
      _ngControl.valueAccessor = this;
    }

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
      self.toggleEle.addEventListener('touchmove', pointerMove);
      self.toggleEle.addEventListener('mousemove', pointerMove);
      elementRef.nativeElement.addEventListener('mouseout', pointerOut);
    };

    this.removeMoveListener = function() {
      self.toggleEle.removeEventListener('touchmove', pointerMove);
      self.toggleEle.removeEventListener('mousemove', pointerMove);
      elementRef.nativeElement.removeEventListener('mouseout', pointerOut);
    };
  }

  /**
   * @private
   */
  ngOnInit() {
    if (!this.id) {
      this.id = 'tgl-' + this.form.nextId();
    }

    this.labelId = 'lbl-' + this.id;
  }

  /**
   * Set checked state of this toggle.
   * @param {boolean} value  Boolean to set this toggle's checked state to.
   * @private
   */
  check(value) {
    this.checked = !!value;
    this.onChange(this.checked);
  }

  /**
   * Toggle the checked state of this toggle.
   * @private
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
  ngOnDestroy() {
    this.removeMoveListener();
    this.toggleEle = this.addMoveListener = this.removeMoveListener = null;
    this.form.deregister(this);
  }

  /**
   * @private
   */
  isDisabled(ev) {
    return (this.lastTouch + 999 > Date.now() && /mouse/.test(ev.type)) || (this.mode == 'ios' && ev.target.tagName == 'ION-TOGGLE');
  }

  /**
   * @private
   */
  initFocus() {

  }
}
