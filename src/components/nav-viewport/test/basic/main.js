import {bootstrap} from 'angular2/core'
import {Component, Template} from 'angular2/angular2'
import {NavViewport} from 'ionic2/components'
import {Log} from 'ionic2/util'
import {FirstPage} from 'app/pages/first-page'

@Component({ selector: '[ion-app]' })
@Template({
  directives: [NavViewport],
  url: 'main.html'
})
class IonicApp {
  constructor() {
    this.initial = FirstPage
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)
