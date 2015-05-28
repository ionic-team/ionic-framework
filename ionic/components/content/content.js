import {Component} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';


@Component({
  selector: 'ion-content'
})
@View({
  template: `<div class="scroll-content"><content></content></div>`
})
export class Content {}
