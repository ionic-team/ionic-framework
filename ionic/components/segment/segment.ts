import {Component, Directive, Renderer, ElementRef, EventEmitter, Host, forwardRef, Optional} from 'angular2/angular2';
import {Control, NgControl, NgFormControl, ControlGroup, ControlDirective} from 'angular2/angular2';

import {Ion} from '../ion';
import {Config} from '../../config/config';
import {dom} from 'ionic/util';

/**
 * TODO
 */
@Component({
  selector: 'ion-segment',
  inputs: [
    'value'
  ],
  host: {
    //'(click)': 'buttonClicked($event)',
    '(change)': 'onChange($event)',
    //'[value]': 'value',
    /*
    '[class.ng-untouched]': 'cd.control?.untouched == true',
    '[class.ng-touched]': 'cd.control?.touched == true',
    '[class.ng-pristine]': 'cd.control?.pristine == true',
    '[class.ng-dirty]': 'cd.control?.dirty == true',
    '[class.ng-valid]': 'cd.control?.valid == true',
    '[class.ng-invalid]': 'cd.control?.valid == false'
    */
  },
  template: '<div class="ion-segment"><ng-content></ng-content></div>',
  directives: [forwardRef(() => SegmentButton)]
})
export class Segment extends Ion {
  /**
   * TODO
   * @param {NgControl} ngControl  TODO
   * @param {ElementRef} elementRef  TODO
   * @param {Config} config  TODO
   * @param {Renderer} renderer  TODO
   */
  constructor(
    @Optional() ngControl: NgControl,
    elementRef: ElementRef,
    config: Config,
    renderer: Renderer
  ) {
    super(elementRef, config);

    this.ele = elementRef.nativeElement
    this.elementRef = elementRef;
    this.renderer = renderer;

    this.change = new EventEmitter('change');
    this.input = new EventEmitter('input');

    this.ngControl = ngControl;

    this.buttons = [];
  }

  writeValue(value) {
    this.value = value;
  }

  /**
   * Called by child SegmentButtons to bind themselves to
   * the Segment.
   * @param {SegmentButton} segmentButton  The child SegmentButton to register.
   */
  register(segmentButton) {
    this.buttons.push(segmentButton);

    // If this button is registered and matches our value,
    // make sure to select it
    if(this.value == segmentButton.value) {
      this.selected(segmentButton);
    }
  }

  /**
   * Select the button with the given value.
   * @param {string} value  Value of the button to select.
   */
  selectFromValue(value) {
    if (this.buttons.length == 0) {
      return;
    }
    this.buttons.forEach(function(button) {
      if(button.value === value) {
        button.isActive = true;
      }
    });
  }

  /**
   * Indicate a button should be selected.
   * @param {SegmentButton} segmentButton  The button to select.
   */
  selected(segmentButton) {
    this.buttons.forEach(function(button) {
      button.isActive = false;
    });
    segmentButton.isActive = true;

    if(!this.ngControl) { return; }

    setTimeout(() => {
      this.writeValue(segmentButton.value);
      this.selectFromValue(segmentButton.value);

      this.ngControl.control.updateValue(segmentButton.value);

      // Trigger on change
      this.change.next();
    })
  }
}

/**
 * TODO
 */
@Directive({
  selector: 'ion-segment',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(input)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()',
    //'[value]': 'value',
    /*
    '[class.ng-untouched]': 'cd.control?.untouched == true',
    '[class.ng-touched]': 'cd.control?.touched == true',
    '[class.ng-pristine]': 'cd.control?.pristine == true',
    '[class.ng-dirty]': 'cd.control?.dirty == true',
    '[class.ng-valid]': 'cd.control?.valid == true',
    '[class.ng-invalid]': 'cd.control?.valid == false'
    */
  }
})
export class SegmentControlValueAccessor {
  /**
   * TODO
   * @param {NgControl} ngControl  TODO
   * @param {Renderer} renderer  TODO
   * @param {ElementRef} elementRef  TODO
   * @param {Segment} segment  TODO
   */
  constructor(
    @Optional() ngControl: NgControl,
    renderer: Renderer,
    elementRef: ElementRef,
    segment: Segment
  ) {
    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    if(!ngControl) { return; }

    this.ngControl = ngControl;
    this.renderer = renderer;
    this.elementRef = elementRef;
    this.segment = segment;

    this.ngControl.valueAccessor = this;
  }

  writeValue(value) {
    this.value = !value ? '' : value;

    this.segment.value = this.value;
    this.segment.selectFromValue(value);
  }

  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }
}

/**
 * TODO
 */
@Directive({
  selector: 'ion-segment-button',
  inputs: [
    'value'
  ],
  host: {
    '(click)': 'buttonClicked($event)',
    '[class.activated]': 'isActive',
  }
})
export class SegmentButton {
  /**
   * TODO
   * @param {Segment} segment  TODO
   * @param {ElementRef} elementRef  TODO
   */
  constructor(
    @Host() segment: Segment,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    this.segment = segment;
    this.renderer = renderer;
    this.isButton = true;

    // This is a button, and it's outlined
    this.renderer.setElementAttribute(elementRef, 'button', '');
    this.renderer.setElementAttribute(elementRef, 'outline', '');
  }

  onInit() {
    this.segment.register(this);
  }

  buttonClicked(event) {
    this.segment.selected(this, event);
    event.preventDefault();
  }

}
