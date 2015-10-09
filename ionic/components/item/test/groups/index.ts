import {Host} from 'angular2/angular2';
import {App} from 'ionic/ionic';
import {Component, View, NgIf, NgFor} from 'angular2/angular2';
import {Content, Icon, Item, ItemGroup, ItemGroupTitle, ItemSliding, List, ListHeader, NavController} from 'ionic/ionic';


console.log('content', Content)

@Component({
  properties: ['data'],
  selector: 'component-list'
})
@View({
  directives: [ComponentList, Item, ItemGroup, ItemGroupTitle, List, NgIf, NgFor],
  templateUrl: 'list.html'
})
class ComponentList {
  constructor(@Host() content:Content) {
    console.log('Component List init', content);
  }
}

@App({
  directives: [ComponentList, Item, ItemGroup, ItemGroupTitle, List, NgIf, NgFor],
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    this.data = ['1'];
  }
}
