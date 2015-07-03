import {Component, View, ElementRef} from 'angular2/angular2';

import {Ion} from '../ion';


/**
 * ion-scroll is a non-flexboxed scroll area that can
 * scroll horizontally or vertically.
 */
@Component({
  selector: 'ion-scroll',
  properties: [
    'scrollX', 'scrollY'
  ],
  host: {
    '[class.scroll-x]': 'scrollX',
    '[class.scroll-y]': 'scrollY'
  }
})
@View({
  template: `<div class="scroll-content"><content></content></div>`
})
export class Scroll extends Ion {
  constructor(elementRef: ElementRef) {
    super(elementRef);

    setTimeout(() => {
      this.scrollElement = elementRef.nativeElement.children[0];
    });
  }

  addScrollEventListener(handler) {
    if(!this.scrollElement) { return; }

    this.scrollElement.addEventListener('scroll', handler);

    return () => {
      this.scrollElement.removeEventListener('scroll', handler);
    }
  }
}
