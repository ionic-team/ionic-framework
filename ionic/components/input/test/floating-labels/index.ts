import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    this.myParam = '';
    
    this.myValues = {
      value1: 'Dynamic Input',
      value2: 'Dynamic Textarea'
    };
  }

}
