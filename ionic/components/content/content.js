import {Renderer, ElementRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';


@Component({
  selector: 'ion-content',
  // hostProperties: {
  //   contentClass: 'class.content'
  // }
})
@View({
  template: `
    <div class="scroll-content">
      <content></content>
    </div>`
})
export class Content {
  constructor(elementRef: ElementRef) {
    this.domElement = elementRef.domElement;
    //this.contentClass = true;
    console.log('Content!');
  }
}
