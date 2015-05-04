import {
  Component,
  View,
  Ancestor,
} from 'angular2/angular2';
import {
  NavItem,
  Content,
  NavController,
  Toolbar,
  ToolbarTitle,
} from 'ionic/ionic';
import {TabsPage} from 'pages/tabs';

@Component()
@View({
  templateUrl: 'pages/sign-in.html',
  directives: [Content, Toolbar, ToolbarTitle]
})
export class SignInPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav;
  }
  signIn() {
    console.log('click');
    this.nav.push(TabsPage, {
      my: 'param'
    })
  }
}
