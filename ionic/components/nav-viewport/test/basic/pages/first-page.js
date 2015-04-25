import {Component, View as NgView, Parent} from 'angular2/angular2'
import {NavViewport, View} from 'ionic/components'
import {SecondPage} from 'app/pages/second-page'

@Component({
  selector: 'first-page'
})
@NgView({
  templateUrl: 'pages/first-page.html',
  directives: [View]
})
export class FirstPage {
  constructor(
    @Parent() viewport: NavViewport
  ) {
    this.viewport = viewport
  }

  nextPage() {
    this.viewport.push(SecondPage)
  }
}
