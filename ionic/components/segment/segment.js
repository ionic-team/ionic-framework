import {NgElement, Renderer, ElementRef, Component, DefaultValueAccessor, View, Ancestor, Optional, Decorator, Directive} from 'angular2/angular2'
import {ControlGroup, ControlDirective} from 'angular2/forms'
import {dom} from 'ionic/util';
import {IonicComponent} from 'ionic/config/component'
import {Button} from 'ionic/components/button/button'


@Component({
  selector: 'ion-segment',
  hostListeners: {
    'click': 'buttonClicked($event)'
  }
})
@View({
  template: `<div class="ion-segment">
    <content></content>
  </div>
  `,
  directives: [Button, SegmentButton],
  properties: {
    value: 'value'
  },
  hostProperties: {
    value: 'value'
  }
})
export class Segment {
  constructor(
    @NgElement() ngElement:NgElement,
    elementRef: ElementRef,
    renderer: Renderer,
    cd:ControlDirective
  ) {
    this.domElement = ngElement.domElement
    this.config = Segment.config.invoke(this)
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.controlDirective = cd;
    console.log('Segment with cd', cd);

    cd.valueAccessor = this; //ControlDirective should inject CheckboxControlDirective

    this.buttons = [];
  }

  writeValue(value) {
    console.log('SEGMENT WRITE VALUE', value);
  }

  bindButton(segmentValue) {
    this.buttons.push(segmentValue);
    let index = this.buttons.length;
    console.log('Bound button', index);
  }

  register(segmentButton) {
    this.buttons.push(segmentButton);
  }

  selected(event, segmentButton) {
    for(let button of this.buttons) {
      button.setActive(false);
    }
    segmentButton.setActive(true);

    this.value = segmentButton.value;
  }
}

new IonicComponent(Segment, {
});

@Component({
  selector: 'ion-segment-button',
  hostListeners: {
    'click': 'buttonClicked($event)'
  },
  properties: {
    value: 'value'
  }
})
@View({
  template: '<content></content>'
})
/*
@Directive({
  hostListeners: {
    mouseover: 'buttonClicked'
  }
})
*/
export class SegmentButton {
  constructor(
    @Ancestor() segment: Segment,
    @NgElement() ngElement:NgElement,
    elementRef: ElementRef,
    renderer: Renderer
  ) {
    this.domElement = ngElement.domElement
    this.segment = segment;

    segment.register(this);
  }

  setActive(isActive) {
    // TODO: No domElement
    if(isActive) {
      this.domElement.classList.add('active');
    } else {
      this.domElement.classList.remove('active');
    }
  }

  buttonClicked(event) {
    this.segment.selected(event, this);
  }

}
