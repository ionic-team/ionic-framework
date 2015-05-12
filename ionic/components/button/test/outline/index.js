import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Button} from 'ionic/components/button/button'


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Button]
})
class IonicApp {}


export function main() {
  bootstrap(IonicApp);
}
