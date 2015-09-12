import {IonicApp, IonicView} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>List Groups</ion-title></ion-navbar>

  <ion-content>
    <ion-list inset>
      <ion-item-group *ng-for="#group of groups">
        <ion-item-group-title>{{group.title}}</ion-item-group-title>
        <ion-item *ng-for="#item of group.items">
          {{item.title}}
        </ion-item>
      </ion-item-group>

    </ion-list>
  </ion-content>
  `
})
export class ListGroupPage extends SinkPage {
  constructor(app: IonicApp) {
    super(app)

    this.groups = [];

    var letters = "abcdefghijklmnopqrstuvwxyz".split('');

    for(let i = 0; i < letters.length; i++) {
      let group = [];
      for(let j = 0; j < 10; j++) {
        group.push({
          title: letters[i] + j
        });
      }
      this.groups.push({
        title: letters[i].toUpperCase(),
        items: group
      });
    }

  }
}
