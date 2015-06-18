import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Button} from 'ionic/components/button/button'

@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [Button]
})
export default class IonicApp {}
