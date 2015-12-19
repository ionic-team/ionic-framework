import {App, NavController} from 'ionic/ionic';
import {Page, Config, IonicApp} from 'ionic/ionic';
import {NavParams, NavController, ViewController} from 'ionic/ionic';
import {SearchPipe} from 'ionic/components/searchbar/searchbar';

@App({
  templateUrl: 'main.html'
})
class E2EApp {
  defaultToolbarSearch: string = '';
  primaryToolbarSearch: string = '';
  dangerToolbarSearch: string = '';
  lightToolbarSearch: string = '';

  constructor() {

  }
}
