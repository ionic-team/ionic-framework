import {Page, NavController} from 'ionic/ionic';
import {Inject} from 'angular2/core';

/*
  Generated class for the <%= jsClassName %> page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/<%= directory %>/<%= fileName %>/<%= fileName %>.html',
})
export class <%= jsClassName %> {
  constructor(@Inject(NavController) nav) {
    this.nav = nav;
  }
}
