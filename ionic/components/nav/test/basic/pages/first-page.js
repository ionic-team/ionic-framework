import {Component, View, Parent} from 'angular2/angular2'
import {NavController, Toolbar, Content} from 'ionic/ionic'
import {SecondPage} from './second-page'


@Component()
@View({
  templateUrl: 'pages/first-page.html',
  directives: [Toolbar]
})
export class FirstPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav;
  }

  push() {
    this.nav.push(SecondPage);
  }
}
