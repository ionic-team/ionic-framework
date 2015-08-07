import {
  View,
  Directive,
  ElementRef,
  Ancestor,
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
import * as dom  from '../../util/dom';


@Directive({
  selector: '.media-switch'
})
class MediaSwitch {
  constructor(
    @Ancestor() @Inject(forwardRef(() => Switch)) swtch: Switch,
    elementRef: ElementRef,
    renderer: Renderer,
    config: IonicConfig
  ) {
    let element = elementRef.nativeElement;
    let touchEnabled = config.setting('touchEnabled');
    let startCoord = null;

    function pointerDown(ev) {
      startCoord = dom.pointerCoord(ev);
      renderer.setElementClass(elementRef, ACTIVATED, true);
      element.removeEventListener(touchEnabled ? TOUCHMOVE : MOUSEMOVE, pointerMove);
      element.addEventListener(touchEnabled ? TOUCHMOVE : MOUSEMOVE, pointerMove);
    }

    function pointerMove(ev) {
      let moveCoord = dom.pointerCoord(ev);
      console.log('pointerMove', moveCoord);
    }

    function pointerUp(ev) {
      let endCoord = dom.pointerCoord(ev);
      renderer.setElementClass(elementRef, ACTIVATED, false);
      element.removeEventListener(touchEnabled ? TOUCHMOVE : MOUSEMOVE, pointerMove);

      swtch.toggle();
    }

    element.addEventListener(touchEnabled ? TOUCHSTART : MOUSEDOWN, pointerDown);
    element.addEventListener(touchEnabled ? TOUCHEND : MOUSEUP, pointerUp);

    this.dereg = function() {
      element.removeEventListener(touchEnabled ? TOUCHSTART : MOUSEDOWN, pointerDown);
      element.removeEventListener(touchEnabled ? TOUCHEND : MOUSEUP, pointerUp);
      element.removeEventListener(touchEnabled ? TOUCHMOVE : MOUSEMOVE, pointerMove);
    }
  }

  onDestroy() {
    this.dereg();
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

const ACTIVATED = 'activated';
const MOUSEDOWN = 'mousedown';
const MOUSEMOVE = 'mousemove';
const MOUSEUP = 'mouseup';
const TOUCHSTART = 'touchstart';
const TOUCHMOVE = 'touchmove';
const TOUCHEND = 'touchend';
