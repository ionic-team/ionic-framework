import {App} from 'ionic/ionic';

// Uses the list's demo but passes the demo var to change the title
@App({
  templateUrl: '../list/main.html'
})
class ApiDemoApp {
  constructor() {
    this.demo = "Item";
  }
}
