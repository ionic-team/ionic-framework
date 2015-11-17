import {Component, NgIf, NgFor} from 'angular2/angular2';
import {App, Icon, Item, ItemGroup, ItemGroupTitle, ItemSliding, List, ListHeader, NavController} from 'ionic/ionic';

@Component({
  properties: ['data'],
  selector: 'component-list',
  directives: [Item, ItemGroup, ItemGroupTitle, ItemSliding, List, NgIf, NgFor],
  templateUrl: 'component-list.html'
})
export class ComponentList {
  constructor() {

  }
}

@App({
  directives: [ComponentList],
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    let session = {
      "name": "Breakfast",
      "location": "Main hallway"
    };

    this.data = {
      "day": "05/17/2016",
      "sessions": [
        {
          "name": "Breakfast",
          "location": "Main hallway"
        }
      ]
    };

    for(let i = 0; i < 50; i++) {
      this.data.sessions.push(session);
    }
  }
}
