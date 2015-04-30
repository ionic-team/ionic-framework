import {
  NgElement,
  Component,
  View as NgView,
} from 'angular2/angular2';

@Component({
  selector: 'ion-content'
})
@NgView({
  template: `
    <div class="scroll-content">
      <content></content>
    </div>`
})
export class Content {
  constructor(
    @NgElement() element:NgElement
  ) {
    console.log('constructing content', element.domElement);
    this.domElement = element.domElement;
    this.domElement.classList.add('content');
  }
}
