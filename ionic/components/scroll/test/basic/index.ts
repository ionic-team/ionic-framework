import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class MyApp {
  doRefresh() {
    console.log('DOREFRESH')
  }
}
