import {Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';


@Directive({
  selector: 'icon',
  properties: [
    'name'
  ],
  host: {
    '[attr.aria-label]': 'label',
    'role': 'img'
  },
  lifecycle: [onInit]
})
export class Icon {
  constructor(elementRef: ElementRef) {
    this.domElement = elementRef.domElement;
  }
  onInit() {
    if (this.name) {
      this.domElement.classList.add(this.name);
      this.label = this.name;
    }
  }
}
