import {Component, Template, Parent} from 'angular2/angular2'
import {NavView} from 'ionic2/components/nav-view/nav-view'
import {View} from 'ionic2/components/view/view'
import {SecondPage} from 'app/pages/second-page'

@Component({
  selector: 'first-page'
})
@Template({
  url: 'pages/first-page.html',
  directives: [View]
})
export class FirstPage {
  constructor(
    @Parent() navView: NavView
  ) {
    this.navView = navView
  }

  nextPage() {
    this.navView.push(SecondPage)
  }
}
