import {App} from '../../../../../ionic';


@App({
  templateUrl: 'main.html'
})
class MyApp {
  doRefresh() {
    console.log('DOREFRESH')
  }
}
