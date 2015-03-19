import {NgElement, Component, Template} from 'angular2/angular2';
import {Ion} from '../ion';


@Component({
  selector: 'ion-content'
})
@Template({
  inline: `
    <div class="scroll-content">
      <content></content>
    </div>`
})
export class Content extends Ion {
  constructor(@NgElement() ele:NgElement) {
    ele.domElement.classList.add('content');
  }
}
