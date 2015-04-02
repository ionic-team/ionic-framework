import {Component, Template, Parent} from 'angular2/angular2'
import {View, NavViewport} from 'ionic2/components'
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
    @Parent() viewport: NavViewport
  ) {
    this.viewport = viewport
  }
  signIn() {
    this.viewport.push(TabsPage)
  }
}
