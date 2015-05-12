import { ElementRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';

import {IonicComponent} from 'ionic/config/component'

@Directive({
  selector: 'button, ion-button, [ion-button],.button',
})
export class Button {
  constructor(
    elementRef: ElementRef
    //@NgElement() ngElement:NgElement
  ) {
    this.domElement = elementRef.domElement;
    this.config = Button.config.invoke(this);
  }
}
new IonicComponent(Button, {
   enhanceRawElement: true,
   propClasses: ['primary', 'secondary', 'danger', 'light', 'stable', 'dark', 'block', 'clear', 'full', 'icon']
})
