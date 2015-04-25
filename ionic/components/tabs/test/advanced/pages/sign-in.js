import {Component, View as NgView} from 'angular2/angular2'
import {View, NavPane, Content} from 'ionic/ionic'
import {TabsPage} from 'app/pages/tabs'

@Component({
  selector: 'sign-in-page'
})
@NgView({
  templateUrl: 'pages/sign-in.html',
  directives: [View, Content]
})
export class SignInPage {
  constructor(
    navPane: NavPane
  ) {
    this.navPane = navPane
    this.instanceVal = Math.random()
  }
  signIn() {
    this.navPane.push(TabsPage)
  }
  instanceCheck() {
    window.alert("Instance: " + this.instanceVal)
  }
}
