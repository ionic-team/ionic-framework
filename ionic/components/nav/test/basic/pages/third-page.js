import {Component, View, Parent} from 'angular2/angular2'
import {NavController} from 'ionic/components'


@Component()
@View({
  templateUrl: 'pages/third-page.html',
  directives: []
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
