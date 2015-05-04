import {
  NgElement,
  Component,
  View,
} from 'angular2/angular2';

@Component({
  selector: 'ion-content'
})
@View({
  template: `
    <div class="scroll-content">
      <content></content>
    </div>`
})
export class Content {
  constructor(
    @NgElement() element:NgElement
  ) {
    this.domElement = element.domElement;
    this.domElement.classList.add('content');
  }
}
