import {Component, onInit} from 'angular2/src/core/annotations_impl/annotations';

import {IonicView, IonicConfig, IonicRouter} from 'ionic/ionic';
import {FirstPage} from './pages/first-page'


@Component({
  selector: 'ion-app'
})
@IonicView({
  template: '<ion-nav></ion-nav>'
})
class MyApp {}


export function main(ionicBootstrap) {

  var myRouter = new IonicRouter({
    'FirstPage': {
      'path': '/firstpage',
      'module': 'dist/examples/nav/basic/pages/first-page',
    },
    'SecondPage': {
      'path': '/secondpage',
      'module': './second-page'
    },
    'ThirdPage': {
      'path': '/thirdpage',
      'module': './third-page'
    },
  });

  myRouter.otherwise('FirstPage');

  let myConfig = new IonicConfig();

  ionicBootstrap(MyApp, myConfig, myRouter);
}
