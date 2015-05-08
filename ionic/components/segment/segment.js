import {NgElement, Component, View, Decorator} from 'angular2/angular2'
import {IonicComponent} from 'ionic/config/component'
import {Button} from 'ionic/components/button/button'


@Component({
  selector: 'ion-segment'
})
@View({
  template: `<div class="ion-segment" (^click)="buttonClicked($event)">
    <content></content>
  </div>
  `,
  directives: [Button]
})
export class Segment {
  constructor(
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.config = Button.config.invoke(this)
  }

  buttonClicked(event) {
    console.log('Button clicked', event);
  }
}
new IonicComponent(Segment, {
})
