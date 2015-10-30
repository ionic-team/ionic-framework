import {Page, NavController} from 'ionic/ionic';
@Page({
  templateUrl: 'app/<%= fileAndClassName %>/<%= fileAndClassName %>.html',
})
export class <%= javascriptClassName %> {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
