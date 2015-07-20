import {View, Renderer, ElementRef, EventEmitter, Ancestor, forwardRef} from 'angular2/angular2';
import {Control, NgControl,NgFormControl} from 'angular2/forms';
import {ControlGroup, ControlDirective} from 'angular2/forms'

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicDirective, IonicComponent} from '../../config/annotations'
import {dom} from 'ionic/util';


@IonicComponent({
  selector: 'ion-segment',
  appInjector: [ NgControl ],
  properties: [
    'value'
  ],
  host: {
    '(click)': 'buttonClicked($event)',
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
  }
})
@View({
  template: '<div class="ion-segment"><content></content></div>',
  directives: [forwardRef(() => SegmentButton)]
})
export class Segment extends Ion {
  constructor(
    cd: NgControl,
    elementRef: ElementRef,
    ionicConfig: IonicConfig,
    renderer: Renderer
  ) {
    super(elementRef, ionicConfig);

    this.ele = elementRef.nativeElement
    this.elementRef = elementRef;
    this.renderer = renderer;

    this.change = new EventEmitter('change');
    this.input = new EventEmitter('input');

    this.cd = cd;

    this.buttons = [];
  }

  /**
   * Called by child SegmentButtons to bind themselves to
   * the Segment.
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
   */
  selectFromValue(value) {
    for(let button of this.buttons) {
      if(button.value === value) {
        button.isActive = true;
      }
    }
  }

  /**
   * Indicate a button should be selected.
   */
  selected(segmentButton) {
    for(let button of this.buttons) {
      button.isActive = false;
    }
    segmentButton.isActive = true;

    //this.onChange();


    setTimeout(() => {
      this.value = segmentButton.value;
      this.cd.valueAccessor.writeValue(segmentButton.value);
      this.selectFromValue(segmentButton.value);

      this.cd.control.updateValue(segmentButton.value);

      // Trigger on change
      this.change.next();
    })


    //this.ngControl.control().updateValue(this.value);
    // TODO: Better way to do this?
    //this.controlDirective._control().updateValue(this.value);
  }
}


@IonicDirective({
  selector: 'ion-segment',
  //properties: ['value'],
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
  constructor(cd: NgControl, renderer: Renderer, elementRef: ElementRef, segment: Segment) {
    this.onChange = (_) => {};
    this.onTouched = (_) => {};
    this.cd = cd;
    this.renderer = renderer;
    this.elementRef = elementRef;
    this.segment = segment;

    cd.valueAccessor = this;
  }

  writeValue(value) {
    // both this.value and setProperty are required at the moment
    // remove when a proper imperative API is provided
    this.value = !value ? '' : value;

    this.renderer.setElementProperty(this.elementRef, 'value', this.value);

    this.segment.value = this.value;
    this.segment.selectFromValue(value);
  }

  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }
}


@IonicDirective({
  selector: 'ion-segment-button',
  properties: [
    'value'
  ],
  host: {
    '(click)': 'buttonClicked($event)',
    '[class.active]': 'isActive'
  }
})
export class SegmentButton {
  constructor(
    @Ancestor() segment: Segment,
    elementRef: ElementRef
  ) {
    this.ele = elementRef.ele
    this.segment = segment;
  }

  onInit() {
    this.segment.register(this);
  }

  buttonClicked(event) {
    this.segment.selected(this, event);
    event.preventDefault();
  }

}
