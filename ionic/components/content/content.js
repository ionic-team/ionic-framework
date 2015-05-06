import {
  NgElement,
  Component,
  View,
} from 'angular2/angular2';

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
