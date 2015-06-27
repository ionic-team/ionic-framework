import {ElementRef} from 'angular2/angular2'
import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';


@Component({
  selector: 'ion-content'
})
@View({
  template: `<div class="scroll-content"><content></content></div>`
})
export class Content {
  constructor(elementRef: ElementRef) {
    // TODO(maxlynch): we need this nativeElement for things like aside, etc.
    // but we should be able to stamp out this behavior with a base IonicComponent
    // or something, so all elements have a nativeElement reference or a getElement() method
    this.ele = elementRef.nativeElement;

    setTimeout(() => {
      this.scrollElement = this.ele.children[0];
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
