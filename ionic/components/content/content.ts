import {Component, View, ElementRef, onInit} from 'angular2/angular2';

import {Ion} from '../ion';


@Component({
  selector: 'ion-content',
  properties: [
    'parallax'
  ],
  lifecycle: [onInit]
})
@View({
  template: '<div class="scroll-content"><content></content></div>'
})
export class Content extends Ion {
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  onInit() {
    this.scrollElement = this.elementRef.nativeElement.children[0];
  }

  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }
}
