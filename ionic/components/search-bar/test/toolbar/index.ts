import {App, NavController} from 'ionic/ionic';
import {Page, Config, IonicApp} from 'ionic/ionic';
import {NavParams, NavController, ViewController} from 'ionic/ionic';
import {SearchPipe} from 'ionic/components/search-bar/search-bar';

@App({
  templateUrl: 'main.html'
})
class IonicApp {
  toolbarSearch: string;

  constructor() {

  }
}
