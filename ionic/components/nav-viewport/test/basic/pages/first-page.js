import {Component, Template, Parent} from 'angular2/angular2'
import {NavViewport, View} from 'ionic2/ionic2'
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
    @Parent() viewport: NavViewport
  ) {
    this.viewport = viewport
  }

  nextPage() {
    this.viewport.push(SecondPage)
  }
}
