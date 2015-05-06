import {Component, View, Parent} from 'angular2/angular2'
import {NavController, Toolbar, Content} from 'ionic/ionic'
import {ThirdPage} from 'pages/third-page'


@Component()
@View({
  templateUrl: 'pages/second-page.html',
  directives: [Toolbar]
})
export class SecondPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav
  }
  pop() {
    this.nav.pop();
  }
  push() {
    this.nav.push(ThirdPage);
  }
}
