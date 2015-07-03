import {Component, View} from 'angular2/angular2';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html'
})
class IonicApp {}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}
