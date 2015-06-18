import {NgFor, ProtoViewRef, ViewContainerRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';

import {Content, List, Item} from 'ionic/ionic';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item, ItemCellTemplate, NgFor]
})
export default class IonicApp {
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
