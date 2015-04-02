import {Component, Template, Parent} from 'angular2/angular2'
import {NavViewport} from 'ionic2/components'
import {View} from 'ionic2/components/view/view'

@Component({
  selector: 'second-page'
})
@Template({
  url: 'pages/second-page.html',
  directives: [View]
})
export class SecondPage {
  constructor(
    @Parent() viewport: NavViewport
  ) {
    this.viewport = viewport
  }
  pop() {
    this.viewport.pop()
  }
}
