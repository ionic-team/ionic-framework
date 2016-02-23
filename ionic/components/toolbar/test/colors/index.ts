import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {


  buttonClick(button) {
    console.log(button);
  }
}
