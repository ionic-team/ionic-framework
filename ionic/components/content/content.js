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
  constructor() {
    //this.contentClass = true;
    console.log('Content!');
  }
}
