import {Directive, onInit, ElementRef} from 'angular2/angular2';


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
    this.ele = elementRef.nativeElement;
  }
  onInit() {
    if (this.name) {
      this.ele.classList.add(this.name);
      this.label = this.name;
    }
  }
}
