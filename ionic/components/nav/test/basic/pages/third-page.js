import {Component, View, Parent} from 'angular2/angular2'
import {NavController, Toolbar} from 'ionic/components'


@Component()
@View({
  templateUrl: 'pages/third-page.html',
  directives: [Toolbar]
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
