import {ElementRef} from 'angular2/angular2'
import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

@Component({
  selector: 'ion-view',
})
@View({
  template: `<content></content>`
})
export class ViewContainer {
  constructor(elementRef: ElementRef) {
    this.domElement = elementRef.domElement;
  }
}
