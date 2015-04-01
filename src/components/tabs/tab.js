import {NgElement, Component, Template, Parent} from 'angular2/angular2';


@Component({
  selector: 'ion-tab',
  bind: {
    tabTitle: 'tab-title'
  }
})
@Template({
  inline: `
  <div [hidden]="!isSelected">
    <content></content>
  </div>
  `
})
export class Tab {

}
