import {Component, View, Parent} from 'angular2/angular2'
import {NavController, Toolbar, Content} from 'ionic/ionic'


@Component()
@View({
  templateUrl: 'pages/third-page.html',
  directives: [Toolbar, Content]
})
export class ThirdPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav
  }
  pop() {
    this.nav.pop()
  }
}
