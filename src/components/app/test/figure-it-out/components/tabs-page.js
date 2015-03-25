import {Component, Template, bootstrap} from 'angular2/angular2';
import {Tabs, Tab} from 'ionic2/components/tabs/tabs2';

/*
@Route('tabs')
*/
@Component({
  selector: 'tabs-page'
})
@Template({
  inline: `
  <ion-tabs>
    <ion-tab title="One">
       One content
    </ion-tab>
    <ion-tab title="Two">
       Two content
    </ion-tab>
  </ion-tabs>
  `,
  directives: [Tabs, Tab]
})
export class TabsPage {
  constructor() {
  }
}
