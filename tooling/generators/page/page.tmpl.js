import {Page, NavController} from 'ionic/ionic';
@Page({
  templateUrl: 'app/<%= fileName %>/<%= fileName %>.html',
})
export class <%= jsClassName %> {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}
