import {NgFor, ProtoViewRef, ViewContainerRef} from 'angular2/angular2'
import {Component, Directive, View, Parent} from 'angular2/angular2';

import {Content, List, Item} from 'ionic/ionic';


/*
  Used to find and register headers in a view, and this directive's
  content will be moved up to the common navbar location, and created
  using the same context as the view's content area.
*/
@Directive({
  selector: 'template[cell]'
})
export class ItemCellTemplate {
  constructor(@Parent() list: List, viewContainer: ViewContainerRef, protoViewRef: ProtoViewRef) {
    console.log('Item cell template', list, viewContainer, protoViewRef);

    this.protoViewRef = protoViewRef;
    this.viewContainer = viewContainer;

    list.setItemTemplate(this);
  }
}


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item, ItemCellTemplate, NgFor]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')

    this.items = []
    for(let i = 0; i < 1000; i++) {
      this.items.push({
        title: 'Item ' + i
      })
    }
  }
}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
