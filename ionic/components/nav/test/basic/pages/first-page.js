import {Component, View, Parent} from 'angular2/angular2'
import {NavController} from 'ionic/ionic'
import {SecondPage} from 'pages/second-page'


@Component()
@View({
  templateUrl: 'pages/first-page.html',
  directives: []
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
