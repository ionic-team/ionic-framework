import {ProtoViewRef, ViewContainerRef} from 'angular2/angular2'
import {Directive, Ancestor, forwardRef} from 'angular2/angular2';

import {App, List} from 'ionic/ionic';



@App({
  templateUrl: 'main.html',
  directives: [forwardRef(() => ItemCellTemplate)]
})
class IonicApp {
  constructor() {

    this.items = []
    for(let i = 0; i < 1000; i++) {
      this.items.push({
        title: 'Item ' + i
      })
    }
  }
}


/*
  Used to find and register headers in a view, and this directive's
  content will be moved up to the common navbar location, and created
  using the same context as the view's content area.
*/
@Directive({
  selector: 'template[cell]'
})
export class ItemCellTemplate {
  constructor(@Ancestor() list: List, viewContainer: ViewContainerRef, protoViewRef: ProtoViewRef) {
    console.log('Item cell template', list, viewContainer, protoViewRef);

    this.protoViewRef = protoViewRef;
    this.viewContainer = viewContainer;

    list.setItemTemplate(this);
  }
}
