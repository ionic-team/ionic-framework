import {NgElement, Component, Template, Parent} from 'angular2/angular2'
import {Toolbar} from 'ionic2/components/toolbar/toolbar'

@Component({
  selector: 'ion-view',
  bind: {
    title: 'view-title'
  }
})
@Template({
  inline: `
    <ion-toolbar [view-title]="title">
      <content select="ion-view-title"></content>
      <content select="ion-nav-items[side=primary]"></content>
      <content select="ion-nav-items[side=secondary]"></content>
    </ion-toolbar>
    <div class="pane-container">
      <content></content>
    </div>`,
  directives: [Toolbar]
})
export class View {
  constructor(@NgElement() ele:NgElement) {
    ele.domElement.classList.add('pane')
    console.log('View constructed', ele.domElement, nav);
  }
}
