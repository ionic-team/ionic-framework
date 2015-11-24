import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class MyApp {
  onSlideChanged(slider) {
    console.log('Slide chnaged', slider);
  }
}
