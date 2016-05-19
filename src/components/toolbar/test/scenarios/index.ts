import {App} from '../../../../../src';


@App({
  templateUrl: 'main.html'
})
class E2EApp {


  buttonClick(button) {
    console.log(button);
  }
}
