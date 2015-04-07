import {Component, Template} from 'angular2/angular2'
import {View, NavView} from 'ionic2/components'
import {TabsPage} from 'app/pages/tabs'

@Component({
  selector: 'sign-in-page'
})
@Template({
  url: 'pages/sign-in.html',
  directives: [View]
})
export class SignInPage {
  constructor(
    navView: NavView
  ) {
    this.navView = navView
  }
  signIn() {
    this.navView.push(TabsPage)
  }
}
