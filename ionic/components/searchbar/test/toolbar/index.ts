import {App} from 'ionic-angular';

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
