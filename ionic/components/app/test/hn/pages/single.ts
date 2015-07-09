import {IonicView, NavController, NavParams} from 'ionic/ionic';

import {HackerNews} from '../hn'


@IonicView({
  templateUrl: 'pages/single.html'
})
export class HNSinglePost {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    this.nav = nav;
    this.post = params;
    console.log('SINGLE', params);
  }
}
