import {Renderer, ElementRef, EventEmitter} from 'angular2/angular2'

import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Control, NgControl,NgFormControl} from 'angular2/forms';
import {ControlGroup, ControlDirective} from 'angular2/forms'
import {dom} from 'ionic/util';
import {IonicComponent} from 'ionic/config/component'


@IonicComponent(Segment)
@View({
  template: `<div class="ion-segment">
    <content></content>
  </div>
  `,
  directives: [SegmentButton]
})
export class Segment {

  static get config() {
    return {
      selector: 'ion-segment',
      appInjector: [ NgFormControl ],
      properties: [
        'value'
      ],
      host: {
        '(click)': 'buttonClicked($event)',
        '[value]': 'value',
        '[class.ng-untouched]': 'cd.control?.untouched == true',
        '[class.ng-touched]': 'cd.control?.touched == true',
        '[class.ng-pristine]': 'cd.control?.pristine == true',
        '[class.ng-dirty]': 'cd.control?.dirty == true',
        '[class.ng-valid]': 'cd.control?.valid == true',
        '[class.ng-invalid]': 'cd.control?.valid == false'
      }
    }
  }

  constructor(
    cd: NgFormControl,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    console.log('COnstructing');
    this.domElement = elementRef.domElement
    this.elementRef = elementRef;
    this.renderer = renderer;

    this.change = new EventEmitter('change');
    this.input = new EventEmitter('input');

    this.cd = cd;

    this.onChange = (_) => {};
    this.onTouched = (_) => {};
    cd.valueAccessor = this;

    this.buttons = [];
  }

  onInit() {
    console.log('NGFORMCONTROL', this.cd);
    Segment.applyConfig(this);
  }

  writeValue(value) {
    console.log('WRITE', value);
    // both this.value and setProperty are required at the moment
    // remove when a proper imperative API is provided
    this.value = !value ? '' : value;
    this.renderer.setElementProperty(this.elementRef.parentView.render, this.elementRef.boundElementIndex, 'value', this.value);

    setTimeout(() => {
      this.selectFromValue(value);
    })
  }

  registerOnChange(fn) { this.onChange = fn; }

  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * Called by child SegmentButtons to bind themselves to
   * the Segment.
   */
  register(segmentButton) {
    this.buttons.push(segmentButton);

    // If we don't have a default value, and this is the
    // first button added, select it
    if(!this.value && this.buttons.length === 1) {
      setTimeout(() => {
        // We need to defer so the control directive can initialize
        this.selected(segmentButton);
      })
    }
  }

  /**
   * Select the button with the given value.
   */
  selectFromValue(value) {
    for(let button of this.buttons) {
      if(button.value === value) {
        button.isActive = true;
        //this.selected(button);
      }
    }
  }


  /**
   * Indicate a button should be selected.
   */
  selected(segmentButton) {
    for(let button of this.buttons) {
      button.setActive(false);
    }
    segmentButton.setActive(true);

    this.onChange();

    //this.writeValue(segmentButton.value);
    //this.value = segmentButton.value;

    //this.ngControl.control().updateValue(this.value);
    // TODO: Better way to do this?
    //this.controlDirective._control().updateValue(this.value);
  }
}


@Directive({
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
    this.domElement = elementRef.domElement
    this.segment = segment;

    segment.register(this);
  }

  setActive(isActive) {
    this.isActive = isActive;
  }

  buttonClicked(event) {
    this.segment.selected(this, event);
    event.preventDefault();
  }

}
