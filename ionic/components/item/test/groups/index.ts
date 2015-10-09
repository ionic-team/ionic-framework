import {ElementRef, Host} from 'angular2/angular2';
import {Component, View, NgIf, NgFor} from 'angular2/angular2';
import {App, Content, Icon, Item, ItemGroup, ItemGroupTitle, ItemSliding, List, ListHeader, NavController} from 'ionic/ionic';

@Component({
  properties: ['data'],
  selector: 'component-list',
  directives: [ComponentList, Item, ItemGroup, ItemGroupTitle, ItemSliding, List, NgIf, NgFor],
  templateUrl: 'component-list.html'
})
class ComponentList {
  constructor(elementRef: ElementRef, @Host() content:Content) {
    console.log('Component List init', content);
  }
}

@App({
  directives: [Content, ComponentList, Item, ItemGroup, ItemGroupTitle, ItemSliding, List, NgIf, NgFor],
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
