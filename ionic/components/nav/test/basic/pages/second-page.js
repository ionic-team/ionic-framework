import {Component, View, Parent} from 'angular2/angular2'
import {Nav} from 'ionic/components'


@Component({
  selector: 'second-page'
})
@View({
  templateUrl: 'pages/second-page.html',
  directives: []
})
export class SecondPage {
  constructor(
    @Parent() viewport: Nav
  ) {
    this.viewport = viewport
  }
  pop() {
    this.viewport.pop()
  }
}
