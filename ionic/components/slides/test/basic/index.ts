import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class IonicApp {
  next() {
    console.log('Next');
  }
  prev() {
    console.log('Prev');
  }
}
