import {App} from '../../../../../ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class MyApp {
  doRefresh() {
    console.log('DOREFRESH')
  }
}
