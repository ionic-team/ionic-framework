import {Component, View as NgView, Parent} from 'angular2/angular2'
import {Nav, View} from 'ionic/ionic'
import {SecondPage} from 'pages/second-page'

@Component({
  selector: 'first-page'
})
@NgView({
  templateUrl: 'pages/first-page.html',
  directives: [View]
})
export class FirstPage {
  constructor(
    @Parent() viewport: Nav
  ) {
    this.viewport = viewport
  }

  nextPage() {
    this.viewport.push(SecondPage)
  }
}
