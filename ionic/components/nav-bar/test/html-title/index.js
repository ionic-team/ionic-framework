import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: []
})
class IonicApp {}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
