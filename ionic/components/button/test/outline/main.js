import {bootstrap} from 'angular2/core'
import {Component, Template} from 'angular2/angular2'
import {Button} from 'ionic2/components/button/button'


@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html',
  directives: [Button]
})
class IonicApp {}

bootstrap(IonicApp)
