import {NgElement, Component, Template} from 'angular2/angular2';
import {Ion} from '../ion';

@Component({
  selector: 'ion-view',
  bind: {
    title: 'view-title'
  }
})
@Template({
  inline: `
    <div class="container">
      <div class="tool-bar">
        <div class="title">
          {{title}}
          <content select="ion-nav-title"></content>
        </div>
      </div>
      <content></content>
    </div>`
})
export class View extends Ion {
  constructor(@NgElement() ele:NgElement) {
    ele.domElement.classList.add('view');
  }
}


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
