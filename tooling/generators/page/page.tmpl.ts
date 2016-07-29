import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the <%= jsClassName %> page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/<%= directory %>/<%= fileName %>/<%= fileName %>.html',
})
export class <%= jsClassName %> {

  constructor(private navCtrl: NavController) {

  }

}
