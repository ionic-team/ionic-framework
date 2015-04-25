import {Component, View as NgView, Ancestor} from 'angular2/angular2'
import {View, NavPane, Content, TestNav, Nav} from 'ionic/ionic'
import {TabsPage} from 'pages/tabs'

@Component({
  selector: 'sign-in-page'
})
@NgView({
  templateUrl: 'pages/sign-in.html',
  directives: [View, Content]
})
export class SignInPage {
  constructor(
    nav: Nav,
    t: TestNav
  ) {
    debugger;
    this.nav = nav;
    this.instanceVal = Math.random()
  }
  signIn() {
    this.nav.push(TabsPage)
  }
  instanceCheck() {
    window.alert("Instance: " + this.instanceVal)
  }
}
