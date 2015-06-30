import {ElementRef} from 'angular2/angular2'
import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Ion} from '../ion';


@Component({
  selector: 'ion-content'
})
@View({
  template: `<div class="scroll-content"><content></content></div>`
})
export class Content extends Ion{
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
