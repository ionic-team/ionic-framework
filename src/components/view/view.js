import {NgElement, Component, Template} from 'angular2/angular2'
import {ToolBar} from '../toolbar/toolbar'
import {Ion} from '../ion'

@Component({
  selector: 'ion-view',
  bind: {
    title: 'view-title'
  }
})
@Template({
  inline: `
    <ion-toolbar view-title="My View Title!!">
    </ion-toolbar>
    <div class="container">
      <content></content>
    </div>`,
  directives: [ToolBar]
})
export class View extends Ion {
  constructor(@NgElement() ele:NgElement) {
    ele.domElement.classList.add('view')
  }
}
