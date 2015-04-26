import {Component, View as NgView, Ancestor} from 'angular2/angular2'
import {NavPane, Content, Nav} from 'ionic/ionic'
import {TabsPage} from 'pages/tabs'

@Component({
  selector: 'sign-in-page'
})
@NgView({
  templateUrl: 'pages/sign-in.html',
  directives: [Content]
})
export class SignInPage {
  constructor(
    nav: Nav
  ) {
    this.nav = nav;
    this.instanceVal = Math.random()
  }
  signIn() {
    this.nav.push(TabsPage, {
      my: 'param'
    })
  }
  instanceCheck() {
    window.alert("Instance: " + this.instanceVal)
  }
}
