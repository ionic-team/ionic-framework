import {
  View,
  Directive,
  ElementRef,
  Host,
  Optional,
  NgControl,
  Renderer,
  Inject,
  forwardRef
} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonInputItem} from '../form/input';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/annotations';
import {pointerCoord} from '../../util/dom';


@Directive({
  selector: '.media-switch',
  host: {
    '(^touchstart)': 'pointerDown($event)',
    '(^mousedown)': 'pointerDown($event)',
    '(^touchend)': 'pointerUp($event)',
    '(^mouseup)': 'pointerUp($event)',
    '[class.activated]': 'isActivated'
  }
})
class MediaSwitch {
  constructor(
    @Host() @Inject(forwardRef(() => Switch)) swtch: Switch,
    elementRef: ElementRef,
    config: IonicConfig
  ) {
    this.swtch = swtch;
    let self = this;
    let element = elementRef.nativeElement;

    function pointerMove(ev) {
      let currentX = pointerCoord(ev).x;

      if (swtch.checked) {
        if (currentX + 15 < self.startX) {
          swtch.toggle();
          self.startX = currentX;
        }
      } else if (currentX - 15 > self.startX) {
        swtch.toggle();
        self.startX = currentX;
      }
    }

    this.addMoveListener = function() {
      element.addEventListener('touchmove', pointerMove);
      element.addEventListener('mousemove', pointerMove);
    };

    this.removeMoveListener = function() {
      element.removeEventListener('touchmove', pointerMove);
      element.removeEventListener('mousemove', pointerMove);
    };
  }

  pointerDown(ev) {
    this.startX = pointerCoord(ev).x;

    this.removeMoveListener();
    this.addMoveListener();

    this.isActivated = true;
  }

  pointerUp(ev) {
    let endX = pointerCoord(ev).x;

    if (this.swtch.checked) {
      if (this.startX + 4 > endX) {
        this.swtch.toggle();
      }
    } else if (this.startX - 4 < endX) {
      this.swtch.toggle();
    }

    this.removeMoveListener();
    this.isActivated = false;
  }

  onDestroy() {
    this.removeMoveListener();
    this.swtch = this.addMoveListener = this.removeMoveListener = null;
  }

}


@IonicComponent({
  selector: 'ion-switch',
  properties: [
    'value',
    'checked',
    'disabled',
    'id'
  ],
  host: {
    'class': 'item',
    'role': 'checkbox',
    '[attr.tab-index]': 'tabIndex',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-labelledby]': 'labelId'
  }
})
@IonicView({
  template:
  '<div class="item-content">' +
    '<ng-content></ng-content>' +
  '</div>' +
  '<div class="item-media media-switch">' +
    '<div class="switch-icon">' +
      '<div class="switch-track"></div>' +
      '<div class="switch-handle"></div>' +
    '</div>' +
  '</div>',
  directives: [MediaSwitch]
})
export class Switch extends IonInputItem {
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    @Optional() private cd: NgControl
  ) {
    super(elementRef, config);
    this.tabIndex = 0;

    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    if (cd) cd.valueAccessor = this;
  }

  onInit() {
    super.onInit();
    this.labelId = 'label-' + this.id;
  }

  check(value) {
    this.checked = !!value;
    this.onChange(this.checked);
  }

  toggle() {
    this.check(!this.checked);
  }

  click(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.toggle();
  }

  writeValue(value) {
    this.checked = value;
  }

  // Used by the view to update the model (Control)
  // Up to us to call it in update()
  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }
}
