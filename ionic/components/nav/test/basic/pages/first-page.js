import {Component, View, Parent} from 'angular2/angular2'
import {Nav} from 'ionic/ionic'
import {SecondPage} from 'pages/second-page'

@Component({
  selector: 'first-page'
})
@View({
  templateUrl: 'pages/first-page.html',
  directives: []
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
